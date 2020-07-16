import base64
import functools
import hashlib

import requests
from django.conf import settings
from django.core.cache import cache
from django.core.exceptions import SuspiciousOperation
from django.utils.encoding import force_bytes
from mozilla_django_oidc.auth import LOGGER, OIDCAuthenticationBackend


class TimedOIDCAuthenticationBackend(OIDCAuthenticationBackend):
    def get_introspection(self, access_token, id_token, payload):
        """Return user details dictionary."""

        basic = base64.b64encode(
            f"{settings.OIDC_RP_CLIENT_ID}:{settings.OIDC_RP_CLIENT_SECRET}".encode(
                "utf-8"
            )
        ).decode()
        headers = {
            "Authorization": f"Basic {basic}",
            "Content-Type": "application/x-www-form-urlencoded",
        }
        response = requests.post(
            settings.OIDC_OP_INTROSPECT_ENDPOINT,
            verify=settings.OIDC_VERIFY_SSL,
            headers=headers,
            data={"token": access_token},
        )
        response.raise_for_status()
        return response.json()

    def get_userinfo_or_introspection(self, access_token):
        try:
            claims = self.cached_request(
                self.get_userinfo, access_token, "auth.userinfo"
            )
        except requests.HTTPError as e:
            if not (
                e.response.status_code in [401, 403] and settings.OIDC_CHECK_INTROSPECT
            ):
                raise e

            # check introspection if userinfo fails (confidental client)
            claims = self.cached_request(
                self.get_introspection, access_token, "auth.introspection"
            )
            if "client_id" not in claims:
                raise SuspiciousOperation("client_id not present in introspection")

        return claims

    def get_or_create_user(self, access_token, id_token, payload):
        """Verify claims and return user, otherwise raise an Exception."""

        claims = self.get_userinfo_or_introspection(access_token)

        users = self.filter_users_by_claims(claims)

        if len(users) == 1:
            return users[0]
        elif settings.OIDC_CREATE_USER:
            return self.create_user(claims)
        else:
            LOGGER.debug(
                "Login failed: No user with username %s found, and "
                "OIDC_CREATE_USER is False",
                self.get_username(claims),
            )
            return None

    def filter_users_by_claims(self, claims):
        username = self.get_username(claims)
        return self.UserModel.objects.filter(username=username)

    def cached_request(self, method, token, cache_prefix):
        token_hash = hashlib.sha256(force_bytes(token)).hexdigest()

        func = functools.partial(method, token, None, None)

        return cache.get_or_set(
            f"{cache_prefix}.{token_hash}",
            func,
            timeout=settings.OIDC_BEARER_TOKEN_REVALIDATION_TIME,
        )

    def create_user(self, claims):
        """Return object for a newly created user account."""
        username = self.get_username(claims)
        email = claims.get(settings.OIDC_EMAIL_CLAIM, "")
        first_name = claims.get(settings.OIDC_FIRSTNAME_CLAIM, "")
        last_name = claims.get(settings.OIDC_LASTNAME_CLAIM, "")
        return self.UserModel.objects.create(
            username=username, email=email, first_name=first_name, last_name=last_name
        )

    def get_username(self, claims):
        try:
            return claims[settings.OIDC_USERNAME_CLAIM]
        except KeyError:
            raise SuspiciousOperation("Couldn't find username claim")

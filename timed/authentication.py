from rest_framework_jwt.authentication import BaseJSONWebTokenAuthentication


class JSONWebTokenAuthenticationQueryParam(BaseJSONWebTokenAuthentication):
    """Allows json web token to be passed on as GET parameter."""

    def get_jwt_value(self, request):
        return request.query_params.get('jwt')

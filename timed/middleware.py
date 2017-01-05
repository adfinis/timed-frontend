"""Custom middlewares."""


class DisableCSRFMiddleware(object):
    """Middleware to disable CSRF."""

    def process_request(self, request):
        """Process request and set property to true."""
        setattr(request, '_dont_enforce_csrf_checks', True)

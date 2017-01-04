from django.conf.urls         import url, include
from django.contrib           import admin
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token

urlpatterns = [
    url(r'^jet/',                include('jet.urls', 'jet')),
    url(r'^admin/',              admin.site.urls),
    url(r'^api/v1/auth/login',   obtain_jwt_token,  name='login'),
    url(r'^api/v1/auth/refresh', refresh_jwt_token, name='refresh'),
    url(r'^api/v1/',             include('timed_api.urls'))
]

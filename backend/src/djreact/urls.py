from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [

    path('api-auth/', include('rest_framework.urls')),
    path('admin/', admin.site.urls),
    #path('api/', include('articles.api.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('api/', include('core.api.urls')),
    path('api/cities_light/api/', include('cities_light.contrib.restframework3')),
      # url(r'^cities_light/api/',
      #   include('cities_light.contrib.restframework.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)


if not settings.DEBUG:
    urlpatterns += [re_path(r'^.*',
                            TemplateView.as_view(template_name='index.html'))]

import os.path
from django.conf.urls import patterns, include, url
from IP.views import *

from django.contrib import admin
admin.autodiscover()

contents = os.path.join (
    os.path.dirname( __file__ ), 'contents' )

urlpatterns = patterns('',

    # Browsing
    url(r'^$', main_page),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^upload/', upload),
    url(r'^process/', process),
     
    # Media
    url(r'^contents/(?P<path>.*)$', 'django.views.static.serve', 
        { 'document_root': contents }),
)
 
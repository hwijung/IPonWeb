import json 
from django.http import HttpResponse
from django.shortcuts import render, render_to_response
from IPonWeb.settings import *
from IP.opencv import *

# Create your views here.
def main_page (request):
    return render_to_response ( 'index.html' )

def upload(request):
    if request.method == 'POST':
        if 'file' in request.FILES:
            file = request.FILES['file']
            filename = file._name
            path = '%s/%s' % (UPLOAD_DIR, filename)
            
            fp = open(path , 'wb')
            for chunk in file.chunks():
                fp.write(chunk)
            fp.close()
            
            height, width = get_size(path)  
            json_data = json.dumps({'result':True, 'height':height, 'width':width, 'output':filename})
           
            return HttpResponse(json_data, mimetype="application/json")
        
    json_data = json.dumps({'result':False })
    return HttpResponse(json_data, mimetype="application/json")
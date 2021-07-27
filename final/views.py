from django.views import generic
from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.contrib.auth.mixins import LoginRequiredMixin

import os
import sys
# import cv2
import numpy as np
from datetime import datetime
from .forms import *
from .get_exif import *
# from .models import FaceData5
# from .face_landmark import *

# Create your views here.
class IndexView(LoginRequiredMixin, generic.TemplateView):
    template_name = "index.html"
    # 403でエラーを明示したい場合に使用
    # raise_exception = True
index = IndexView.as_view()

# File Uploader
def Uploader(request, *args, **kwargs):
	if request.method == 'POST':
		form = UploadFileForm(request.POST, request.FILES)
		# 画像ファイルがアップロードされた場合
		if form.is_valid():
			sys.stderr.write("*** file_upload *** aaa ***\n")
			file_path = handle_uploaded_file(request.FILES['file'])
			file_obj = request.FILES['file']
			sys.stderr.write(file_obj.name + "\n")
			root_ext_pair = os.path.splitext(file_path)
			print('tetetetete', file_path)
			if root_ext_pair[1] == '.jpg':
				os.rename(file_path, './static/material/img/uploaded.jpg')
				file_path = './static/material/img/uploaded.jpg'
				now = datetime.now().strftime('%Y%m%d_%H%M%S')
				

				base = './static/material/img/'
				# 画像ファイルを開く
				files = os.listdir(base)
				time_lat_lon = []
				for item in files:
				    if item == '.DS_Store':
				        continue
				    taken_time, lat, lon = get_gps(base + item)
				    time_lat_lon.append([item, taken_time, lat, lon])
				print(time_lat_lon)

			# return render(request, 'index.html', {'result': time_lat_lon})
			return render(request, 'map.html')

		delID = request.POST.get("delete", "")
		if delID:
			print('削除リクエスト: ', delID)
			# PostgreSQLからface_idをキーにレコードを削除
			FaceData5.objects.filter(face_id=delID).delete()
			# 画像も削除
			# 〜〜〜〜〜〜
			allrecords = list(FaceData5.objects.all().values())
			return render(request, 'index.html', {'result': allrecords})
	else:
		form = UploadFileForm()
	return render(request, 'uploader.html', {'form':form})

def main(request):
	# return HttpResponseRedirect('/main')
	return HttpResponse('Hello World')
#coding:utf-8
import os
vd = './docs/ruc/'
movie_name = os.listdir(vd)
for temp in movie_name:
    new_name = temp.replace('a', '');
    print(new_name, vd+temp, vd+new_name);
    os.rename(vd+temp, vd+new_name)
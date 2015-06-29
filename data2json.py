import json


from os import listdir
from os.path import join
from os.path import isdir
data = {"total_data":[],"train_data":[],"test_data":[]}


folder = 'C3_sy'


label_map = {'melt':1,'plus_metal':2,'shadowing':3}

for f in listdir(folder):
    if(not isdir(join(folder,f))):
        continue
    for g in listdir(join(folder,f)):
        if(not isdir(join(folder,f,g))):
            continue
        for i in listdir(join(folder,f,g)):
            data["total_data"].append({join(folder,f,g,i):label_map[g]})
            if(f=='train'):
                data["train_data"].append({join(folder,f,g,i):label_map[g]})
            else:
                data["test_data"].append({join(folder,f,g,i):label_map[g]})

with open('data.json','wb') as outfile:
    json.dump(data,outfile)

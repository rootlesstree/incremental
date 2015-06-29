import numpy as np
import scipy.io as io
import cPickle

train_label = io.loadmat('train_label_C3.mat')
train_label = train_label['train_labels']
test_label = io.loadmat('test_label_C3.mat')
test_label = test_label['test_labels']
LBP = io.loadmat('train_lbphf_sam24_C3.mat')
LBP_train = LBP['train_lbphf_sam24']
LBP = io.loadmat('test_lbphf_sam24_C3.mat')
LBP_test = LBP['test_lbphf_sam24']

data = {"train_data":[],"test_data":[],"total_data":[]}

total_data = []
counter = 0



for k,i in enumerate(LBP_train):
    data["train_data"].append({counter:str(train_label[k][0])})
    total_data.append(i)
    counter = counter + 1
for k,i in enumerate(LBP_test):
    data["test_data"].append({counter:str(test_label[k][0])})
    counter = counter + 1
    total_data.append(i)


f = open("lbp.json","wb")

import json
json.dump(data,f)

f.close()

f = open("total_lbp.pkl","wb")
cPickle.dump(total_data,f)
f.close()




from flask import Flask, jsonify, render_template, request
import cPickle
import json
import random
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
app = Flask(__name__)

f = open('new_data.json','rb')
data = json.load(f)
f.close()
f = open("lbp.json","rb")
lbp_data = json.load(f)
f.close()
f = open("total_lbp.pkl","rb")
total_data = cPickle.load(f)
f.close()

test_data = []
test_label = []
for i in lbp_data["test_data"]:
	test_data.append(total_data[int(i.keys()[0])])
	test_label.append(int(i.values()[0]))

def accuracy(array_a,array_b):
	total_points = len(array_b)
	correct_counter = 0

	for k,a in enumerate(array_a):
		b = array_b[k]
		if(a==b):
			correct_counter += 1
	return float(correct_counter)/total_points


@app.route('/')
def index(methods=None):
    return render_template('demo2.html',data=lbp_data)

@app.route('/demo1')
def demo1():
	return render_template('demo1.html',data=data)

@app.route('/_generate',methods=['POST','GET'])
def generate():
	data = request.json['train_set']
	returned_data = {}
	returned_data[len(data)] = random.random()
	return jsonify(data=returned_data)

@app.route('/_react_demo2',methods=['POST','GET'])
def react_demo2():
	data = request.json['train_data']
	label = request.json['train_label']
	returned_data = {}
	train_data = []
	train_label = []
	for d in data:
		pos = int(d[0])
		train_data.append(total_data[pos])
		train_label.append(int(lbp_data["train_data"][pos][d[0]].encode('utf-8')))
	svm = SVC(C=10)
	svm.fit(train_data,train_label)
	predictions = svm.predict(test_data)
	returned_data[len(data)] = accuracy(predictions,test_label)
	return jsonify(data=returned_data)


if __name__ == '__main__':
    app.run()


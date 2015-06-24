from flask import Flask, jsonify, render_template, request
import cPickle
import json
app = Flask(__name__)

f = open('new_data.json','rb')
data = json.load(f)

@app.route('/')
def index(methods=None):
    return render_template('index.html',data=data)

@app.route('/_generate',methods=['POST','GET'])
def generate():
	data = request.json['train_set']
	print data
	return jsonify(data={5:0.1,10:0.2,15:0.3,20:0.4,25:0.5,30:0.6,35:0.7,40:0.8,45:0.9,50:1})

if __name__ == '__main__':
    app.run()


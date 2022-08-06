import json

from flask import Flask, request, render_template
from flask import jsonify

import os

app = Flask(__name__, 
	static_url_path='',
	static_folder='/home/anton/Documents/Tulane/Hackathon/ImageNomeR/static',
	template_folder='/home/anton/Documents/Tulane/Hackathon/ImageNomeR/templates')

cache = {}

@app.route('/')
def index():
    return render_template('index.html', cache=cache)

@app.route('/analyze')
def analyze():
	args = request.args
	if 'id' not in args:
		return 'id not in query parameters'
	return render_template('analyze.html', cache=cache, id=args['id'])	

@app.route('/clear')
def postClear():
	args = request.args
	if 'id' not in args:
		return 'id not in query parameters'
	_id = args['id']
	if _id in cache:
		if 'runid' in args:
			runid = args['runid']
			for i in range(len(cache[_id]['runs'])):
				if cache[_id]['runs'][i].runid == runid:
					del cache[_id]['runs'][i]
					return 'Success'
			return f'runid {runid} not found'
		elif 'metadata' in args:
			del cache[_id]['metadata']
			return 'Success'
		elif 'subjects' in args:
			del cache[_id]['subjects']
			return 'Success'
		else:
			del cache[_id]
			return 'Success'
	else:
		return f'No such id {_id}'

@app.route('/test')
def testData():
	return 'ok'

@app.route('/post', methods=['POST'])
def post():
	try:
		args = request.args
		if 'type' not in args:
			return 'missing type'
		if 'id' not in args:
			return 'missing id'
		typ = args['type']
		if typ == 'data':
			return postData()
		elif typ == 'subjects':
			if args['id'] not in cache:
				initCache(args['id'])
			cache[args['id']]['subjects'] = request.json
			return 'Success'
		elif typ == 'metadata':
			if args['id'] not in cache:
				initCache(args['id'])
			cache[args['id']]['metadata'] = request.json
			return 'Success'
		else:
			return 'type must be "data", "metadata", or "subjects"'
	except Exception as e:
		return f'exception: {e}'

def postData():
	args = request.args
	if 'runid' not in args:
		return 'missing runid'
	data = request.json
	if data['runid'] != int(args['runid']):
		return f'data and args have two different runids {data["runid"]} {args["runid"]}'
	if args['id'] not in cache:
		initCache(args['id'])
	prevData = cache[args['id']]['runs']
	for prev in prevData:
		if prev['runid'] == data['runid']:
			return f'duplicate runid {data["runid"]}'
	prevData.append(data)
	return f'Success'

def initCache(_id):
	cache[_id] = {}
	cache[_id]['runs'] = []
	cache[_id]['subjects'] = None
	cache[_id]['metadata'] = None
	
@app.route("/data", methods=['GET'])
def getData():
	args = request.args
	if 'id' not in args or 'runid' not in args:
		return 'missing id or runid'
	if args['id'] not in cache:
		return f'no such id {args["id"]}'
	others = []
	for prev in cache[args['id']]['runs']:
		others.append(prev['runid'])
		if prev['runid'] == int(args['runid']):
			return jsonify(prev)
	return f'no such runid {args["runid"]} {others}'
    
# run app from command line
#  sudo python3 flask-backend.py
# verified this way on development machine. Will verify on production machine
# sudo flask --app src/flask-backend/flask-backend.py run --host 0.0.0.0 --port 80 --no-debugger
if(__name__ == '__main__'):
    app.run(host='localhost', port=80)


import uuid
import json
import requests

class JsonData:
	def __init__(self, analysis):
		assert isinstance(analysis, Analysis)
		self.analysis = analysis
		self.dict = {}
		self.dict['desc'] = analysis.desc

	def pack(self):
		keys = set(self.dict.keys())
		assert any(key in keys for key in ['Accuracy', 'RMSE'])
		assert 'Train' in keys and 'Test' in keys 
		assert len(self.dict['Train']) == len(self.dict['Test'])
		assert len(self.dict['Train']) >= 2
		assert 'Weights' in keys and 'Labels' in keys
		assert len(self.dict['Weights']) == len(self.dict['Labels'])
		return json.dumps(self.dict)

	def post(self):
		return self.analysis.post(self.pack())

class Analysis:
	def __init__(self, desc='test', host='localhost'):
		self.id = uuid.uuid4()
		self.desc = desc
		self.host = host
		self.prev = []
		self.runid = 0

	def getUrl(self):
		return f'{self.url}?id={self.id}&runid={self.runid}'
	
	def post(self, data):
		self.runid += 1
		url = f'http://{self.host}/post?id={self.id}&runid={self.runid}'
		headers = {"Content-Type": "application/json", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
		r = requests.post(url, headers=headers, data=data);
		return r

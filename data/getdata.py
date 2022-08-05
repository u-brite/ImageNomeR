# Get dummy json data for working on web frontend

import requests

host = 'https://hunimal.org/Hackathon/data'
#files = ['dummyOmics1.json']
files = ['fmri-FC.pkl', 'fmri-FC-slim.pkl']
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

for file in files:
	r = requests.get(f'{host}/{file}', headers=headers)

	with open(files[0], 'w') as f:
		f.write(r.text)

	print(r.status_code)
	if r.status_code != 200:
		print('Something went wrong')
	else:
		print('Done')

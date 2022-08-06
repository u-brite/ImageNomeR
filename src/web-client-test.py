
import requests

host = 'http://localhost:80'
file = 'dummyFmri1.json'

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

r = requests.get(f'{host}/data', headers=headers)

print(r.status_code)
if r.status_code != 200:
	print('Something went wrong')
else:
	with open(file, 'wb') as f:
		f.write(r.content)
	print('Done')

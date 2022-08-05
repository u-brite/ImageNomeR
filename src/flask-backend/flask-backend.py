import json

from flask import Flask
from flask import jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return 'Backend Server for Team ImageNomeR'


@app.route("/data")
def getData():
    with open('data/dummyFmri1.json') as inFile:
        data = json.load(inFile)
        return jsonify(data)

    
# run app from command line
#  sudo python3 flask-backend.py
# verified this way on development machine. Will verify on production machine
# sudo flask --app src/flask-backend/flask-backend.py run --host 0.0.0.0 --port 80 --no-debugger
if(__name__ == '__main__'):
    app.run(host='0.0.0.0', port=80)


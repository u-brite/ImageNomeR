from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return 'Backend Server for Team ImageNomeR'
    
# run app from command line
#  sudo python3 flask-backend.py
# verified this way on development machine. Will verify on production machine
# flask --app src/flask-backend/flask-backend.py run --host 0.0.0.0 --port 80
if(__name__ == '__main__'):
    app.run(host='0.0.0.0', port=80)


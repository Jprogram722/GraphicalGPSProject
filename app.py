from flask import Flask, render_template, jsonify, make_response, send_from_directory
import webview
import sys
import threading
import serial.serialutil
from helpers.getData import send_data
import serial

app = Flask(__name__)

def runServer():
    app.run()

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/api/test-data")
def getTestData():
    try:
        data = send_data()
        print(data)
        return jsonify({"Latitude": data[0], "Longitude": data[1], "Bearing": data[2],"Status": "Success"})
    except serial.serialutil.SerialException:
        return jsonify({"Latitude": None, "Longitude": None, "Bearing": None, "Status": "Failed"})
    
@app.route("/api/maps/<path:filename>")
def getMap(filename):
    response = make_response(send_from_directory('static/maps', filename))
    response.accept_ranges = 'bytes'
    return response

if __name__ == '__main__':
    # Run Flask server on a seperate thread
    t = threading.Thread(target=runServer)
    t.daemon = True
    t.start()

    window = webview.create_window("GPS App", "http://localhost:5000", fullscreen=True)
    webview.start(debug=True)
    # Can everything on webview close
    sys.exit()
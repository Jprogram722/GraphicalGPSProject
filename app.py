from flask import Flask, render_template, jsonify, make_response, send_from_directory, request
import serial.serialutil
from helpers.getData import parse_data_pi
import serial

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/api/get-data")
def getArduinoData():
    
    distance = float(request.args.get('distance'))
    time = float(request.args.get('time'))
    prev_long = float(request.args.get('prev-long'))
    prev_lat = float(request.args.get('prev-lat'))

    data = parse_data_pi(distance, time, prev_lat, prev_long)
    data["Status"] = "Success"

    return jsonify(data)
    # except Exception as err:
       # print(err)
	#return jsonify({"Latitude": None, "Longitude": None, "Altitude":None, "Bearing": None, "Speed": None ,"Status": "Failed"})
    
@app.route("/api/maps/<path:filename>")
def getMap(filename):
    response = make_response(send_from_directory('static/maps', filename))
    response.accept_ranges = 'bytes'
    return response

if __name__ == '__main__':
    app.run()

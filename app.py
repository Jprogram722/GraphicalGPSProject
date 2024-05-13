from flask import Flask, render_template, jsonify, make_response, send_from_directory, request
from helpers import getData, getSQL

app = Flask(__name__)

@app.route("/")
def index():
    getSQL.create_distances_table()
    return render_template('index.html')

@app.route("/api/get-data")
def getArduinoData():

    distance = float(request.args.get('distance'))
    time = float(request.args.get('time'))
    prev_long = float(request.args.get('prev-long'))
    prev_lat = float(request.args.get('prev-lat'))

    data = getData.parse_data_pi(distance, time, prev_lat, prev_long)
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

@app.route("/api/get-total-distance")
def get_distance():
    response = getSQL.get_distance_data()

    return response

@app.route("/api/get-locations")
def get_locations():
    response = getSQL.get_locations_data()

    return response

if __name__ == '__main__':
    app.run()
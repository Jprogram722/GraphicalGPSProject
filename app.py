from flask import Flask, render_template, jsonify
import serial.serialutil
from helpers.getData import send_data
import serial


app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/api/test-data")
def getTestData():
    try:
        data = send_data()
        return jsonify({"Latitude": data[0], "Longitude": data[1], "Status": "Success"})
    except serial.serialutil.SerialException:
        return jsonify({"Latitude": None, "Longitude": None, "Status": "Failed"})
    
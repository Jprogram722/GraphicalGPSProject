from flask import Flask, render_template, jsonify


app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/api/test-data")
def getTestData():
    return jsonify({"name": "Bob", "age": 36})
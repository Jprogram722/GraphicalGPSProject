#!/bin/sh
export DISPLAY=:0
flask run &
firefox -new-tab "http://127.0.0.1:5000" --kiosk
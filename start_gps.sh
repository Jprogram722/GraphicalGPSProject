#!/bin/sh
export DISPLAY=:0
flask run &
chromium-browser --kiosk "http://127.0.0.1:5000"
#!/bin/bash
closeBackgroundProc () {
	echo 'Exiting processes...'
	pkill -f app.py
	docker stop angry_babbage
}

trap closeBackgroundProc INT
trap closeBackgroundProc EXIT

export DISPLAY=:0
cd /home/graphicgps/GraphicGPSProject/GraphicalGPSProject
.venv/bin/python3 app.py &
cd ../osrm-backend
docker start angry_babbage &
chromium-browser "127.0.0.1:5000"

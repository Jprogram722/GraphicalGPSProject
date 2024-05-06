# this file will be for getting the arduino data

from serial.tools import list_ports
import serial

def get_port() -> str:
    # gets the list of ports
    ports = list_ports.comports()

    # prints each port to the console
    for port in ports:
        print(str(port))

def send_data_arduino() -> dict:

    # connect to the arduino through the serial port with baud 9600
    arduinoCom: serial.Serial = serial.Serial('/dev/serial0', 9600)

    # read a line from the serial port
    arduino_str: str = arduinoCom.readline().decode('utf-8')

    # remove new line character
    arduino_str = arduino_str.replace("\n", "")

    data = arduino_str.split(",")

    data_obj = {"Latitude": float(data[0]), "Longitude": float(data[1]), "Bearing": int(data[2])}

    return data_obj

def parse_data_pi():
    serialLinesObtained = 0
    piCom = serial.Serial('/dev/serial0', 9600)

    latitude_degrees = longitude_degrees = 0
    speed_kph = 0 

    while (serialLinesObtained < 2):

        pi_str = piCom.readline().decode('utf-8')
        pi_str = pi_str.replace("\n", "")

        pi_array = pi_str.split(",")
        if (pi_array[0] == "$GPGGA"):

            time = pi_array[1]
            latitude_mag = pi_array[2]
            latitude_dir = pi_array[3]
            longitude_mag = pi_array[4]
            longitude_dir = pi_array[5]
            
            if(latitude_mag != "" and longitude_mag != ""):
                latitude_degrees = float(latitude_mag[:2]) + (float(latitude_mag[2:]) / 60)
                if(latitude_dir == "S"):
                    latitude_degrees *= -1
                longitude_degrees = float(longitude_mag[:3]) + (float(longitude_mag[3:]) / 60)
                if(longitude_dir == "W"):
                    longitude_degrees *= -1
            
            serialLinesObtained += 1
        
        if (pi_array[0] == "$GPVTG"):
            speed_kph = pi_array[7]
            serialLinesObtained += 1

    return { "Latitude": latitude_degrees, "Longitude": longitude_degrees, "Bearing": None, "Speed": speed_kph }



def main() -> None:
    print(parse_data_pi())




if __name__ == "__main__":
    main()

# this file will be for getting the arduino data

from serial.tools import list_ports
import serial

def get_port() -> str:
    # gets the list of ports
    ports = list_ports.comports()

    # prints each port to the console
    for port in ports:
        print(str(port))

def send_data() -> dict:

    # connect to the arduino through the serial port with baud 9600
    arduinoCom: serial.Serial = serial.Serial('COM3', 9600)

    # read a line from the serial port
    arduino_str: str = arduinoCom.readline().decode('utf-8')

    # remove new line character
    arduino_str = arduino_str.replace("\n", "")

    data = arduino_str.split(",")

    data_obj = {"Latitude": float(data[0]), "Longitude": float(data[1]), "Bearing": int(data[2])}

    return data_obj


def main() -> None:
    print(send_data())




if __name__ == "__main__":
    main()

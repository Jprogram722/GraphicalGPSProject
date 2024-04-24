# this file will be for getting the arduino data

from serial.tools import list_ports
import serial

def send_data() -> str:

    # connect to the arduino through the serial port with baud 9600
    arduinoCom: serial.Serial = serial.Serial('COM3', 9600)

    # read a line from the serial port
    arduino_str: str = arduinoCom.readline().decode('ascii')
    # remove new line character
    arduino_str = arduino_str.replace("\n", "")

    lat_and_long = arduino_str.split(",")

    for i in  range(len(lat_and_long)):
        lat_and_long[i] = float(lat_and_long[i])

    return lat_and_long


def main() -> None:
    # gets the list of ports
    ports = list_ports.comports()

    # prints each port to the console
    for port in ports:
        print(port)

    # print(send_data())


if __name__ == "__main__":
    main()

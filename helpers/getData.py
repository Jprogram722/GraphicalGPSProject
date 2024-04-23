# this file will be for getting the arduino data

from serial.tools import list_ports
import serial

def send_data() -> str:
    arduinoCom: serial.Serial = serial.Serial('[arduino port]', 9600)

    arduino_str: str = arduinoCom.readline().decode('ascii')
    arduino_str = arduino_str.replace("\n", "")
    return arduino_str


def main() -> None:
    # gets the list of ports
    ports = list_ports.comports()

    # prints each port to the console
    for port in ports:
        print(port)


if __name__ == "__main__":
    main()

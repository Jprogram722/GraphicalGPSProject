# this file will be for getting the arduino data

from serial.tools import list_ports
import serial
import smbus2
import time
import math
import qmc5883l
import board


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
def parse_data_pi() -> dict:
    """
    This function will read gps data from the serial monitor and parse the
    data to make it human readable

    Example:
    >>> parse_data_pi()
    >>> {"Latitude": float, "Longitude": float, "Bearing": int}
    """

    piCom = serial.Serial('/dev/serial0', 9600)

    latitude_degrees = longitude_degrees = 0
    speed_kph = 0 

    while (serialLinesObtained < 2):

        # get data from the serial monitor
        pi_str = piCom.readline().decode('utf-8')
        pi_str = pi_str.replace("\n", "")

        # split string into array
        pi_array = pi_str.split(",")
        if (pi_array[0] == "$GPGGA"):
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

    return { "Latitude": latitude_degrees, "Longitude": longitude_degrees, "Bearing": get_magnetometer_data(), "Speed": speed_kph }

def get_magnetometer_data() -> float:

    i2c = board.I2C()
    qmc = qmc5883l.QMC5883L(i2c)

    
    # get x, y, and z for magnetometer
    x, y, z = qmc.magnetic

    # print(f"x:{x:.2f}Gs, y:{y:.2f}Gs, z{z:.2f}Gs")

    # get the angle in degrees
    angle = math.degrees(math.atan2(y, x))
    # no negative angles
    if angle < 0:
        angle = angle + 360

    return round(angle,1)

    
def read_I2C_devices():
    # Create an smbus object
    bus = smbus2.SMBus(1)  # Use 1 for Raspberry Pi 2 or newer, 0 for Raspberry Pi 1

    # Iterate over possible I2C device addresses (0x03 to 0x77)
    for address in range(0x03, 0x78):
        try:
            # Try to read a byte from the current address
            bus.read_byte(address)
            print("Found I2C device at address:", hex(address))
        except Exception as e:
            # If an exception occurs, the device was not found at this address
            pass

def parse_accelerometer_data(high, low):
    value = (high << 8) | low
    if value >= 0x8000:
        return -((65535 - value) + 1)
    else:
        return value

def read_accelerometer_data():
    bus = smbus2.SMBus(1)
    bus.write_byte_data(0x68, 0x6B, 0x00)
    
    # 0x3B -> 0x48
    
    average_accl_data = {"Ax": 0, "Ay": 0, "Az": 0}

    for i in range(1000):
        accel_data = bus.read_i2c_block_data(0x68, 0x3B, 6)
        Ax = parse_accelerometer_data(accel_data[0], accel_data[1])
        Ay = parse_accelerometer_data(accel_data[2], accel_data[3])
        Az = parse_accelerometer_data(accel_data[4], accel_data[5])

        gyro_data = bus.read_i2c_block_data(0x68, 0x40, 6)
        Gx = parse_accelerometer_data(gyro_data[0], gyro_data[1])
        Gy = parse_accelerometer_data(gyro_data[2], gyro_data[3])
        Gz = parse_accelerometer_data(gyro_data[4], gyro_data[5])

        # print(f"Ax: {Ax}, Ay: {Ay}, Az: {Az}")
        # print(f"Gx: {Gx}, Gy: {Gy}, Gz: {Gz}\n")

        average_accl_data["Ax"] += Ax
        average_accl_data["Ay"] += Ay
        average_accl_data["Az"] += Az

    average_accl_data

def main() -> None:
    print(get_magnetometer_data())




if __name__ == "__main__":
    main()

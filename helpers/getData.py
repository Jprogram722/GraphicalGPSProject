# this file will be for getting the arduino data

from serial.tools import list_ports
import serial
import smbus2
from datetime import datetime
import math
import qmc5883l
import board
import time
from helpers import getSQL


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

def append_sentance(sentance_array: list, frame_array: list[list]) -> list[list]:
    if((sentance_array not in frame_array) and (sentance_array[0] == "$GPGGA" or sentance_array[0] == "$GPRMC")):
        frame_array.append(sentance_array)
        return frame_array
    else:
        return frame_array
    
def get_GPGGA_data(sentance: list):
    # lat_mag, lat_dir, long_mag, long_dir, altitude
    return sentance[2], sentance[3], sentance[4], sentance[5], sentance[9]


def get_distance(lat_mag: float, long_mag: float, prev_lat: float, prev_long: float) -> float:
    """
    This function will get the distance traveled by the user.
    This involves using the haversine function which is haversine(theta) = sin^2(theta/2)

    >>> get_distance(44.66493030437651, -63.61204579060415)
    >>> 0.4857593908446175
    """
    
    # earths radius
    R = 6371 #km

    # get the change in position in radians
    d_lat = (lat_mag - prev_lat) * math.pi/180
    d_long = (long_mag - prev_long) * math.pi/180

    # get the current and previous latitude in radians
    current_lat_mag_radians = (lat_mag) * math.pi/180
    prev_lat_mag_radians = (prev_lat) * math.pi/180

    # sub compnent of the distance calculation
    a = a = (pow(math.sin(d_lat / 2), 2) +
         pow(math.sin(d_long / 2), 2) *
             math.cos(current_lat_mag_radians) * math.cos(prev_lat_mag_radians))
    
    # another subcomponent of haversine function
    c = 2 * math.asin(math.sqrt(a))

    return c*R # return distance in kilometers

def get_dt(current_time: float) -> float:
    """
    This function will get the change in time
    """

    return datetime.now().timestamp() - current_time


def parse_data_pi(distance: float, time: float, prev_lat: float, prev_long: float) -> dict:
    """
    This function will read gps data from the serial monitor and parse the
    data to make it human readable

    Example:
    >>> parse_data_pi()
    >>> {"Latitude": float, 
    "Longitude": float, 
    "Altitude": float, 
    "Bearing": int, 
    "Speed": float, 
    "Distance": float, 
    "Time": float, 
    "PrevLat": float,
    "PrevLong": float}
    """

    # open and read from this serial port at a baud rate of 9600
    piCom = serial.Serial('/dev/serial0', 9600)

    # init some variables
    latitude_degrees = longitude_degrees = altitude = 0
    speed_kph: float = 0

    while True:

        # get data from the serial monitor
        pi_str = piCom.readline().decode('utf-8')
        pi_str = pi_str.replace("\n", "")

        # split string into array
        pi_array = pi_str.split(",")
	
        if (pi_array[0] == "$GPGGA"):
            break

    # get data from the GPS readout
    latitude_mag, latitude_dir, longitude_mag, longitude_dir, altitude = get_GPGGA_data(pi_array) 

    if(altitude != ""):
        altitude = float(altitude)
            
    if(latitude_mag != "" and longitude_mag != ""):
        # convert latitude from degree, minute, seconds to decimal degrees
        latitude_degrees = float(latitude_mag[:2]) + (float(latitude_mag[2:]) / 60)
        # if in the sourthern hemisphere
        if(latitude_dir == "S"):
            latitude_degrees *= -1
        # convert longitude from degree, minute, seconds to decimal degrees
        longitude_degrees = float(longitude_mag[:3]) + (float(longitude_mag[3:]) / 60)
        # if in the western hemisphere
        if(longitude_dir == "W"):
            longitude_degrees *= -1

        if(prev_lat == 0 and prev_long == 0):
            # new coordinates become old coordinates
            prev_lat, prev_long = latitude_degrees, longitude_degrees
        else:
            # get distance before inputting into db
            if(distance == 0):
                distance = abs(get_distance(latitude_degrees, longitude_degrees, prev_lat, prev_long))
                prev_lat, prev_long = latitude_degrees, longitude_degrees
            else:
                distance = abs(get_distance(latitude_degrees, longitude_degrees, prev_lat, prev_long))
                getSQL.insert_into_distance_table(distance)
                prev_lat, prev_long = latitude_degrees, longitude_degrees

    # get a current time before inserting into the database
    if(time == 0):
        time = datetime.now().timestamp()
    else:
        speed_kph = (distance/ get_dt(time)) * 3600 # convert seconds to hours (60 seconds * 60 minutes = 1 hour)
        time = datetime.now().timestamp()

    # close the serial port when done with it
    piCom.close()
    
    # real return
    return { 
        "Latitude": latitude_degrees, 
        "Longitude": longitude_degrees, 
        "Altitude": altitude,
        "Bearing": get_magnetometer_data(), 
        "Speed": speed_kph,
        "Distance": distance,
        "Time": time,
        "prevLat": prev_lat,
        "prevLong": prev_long,
    }
    
    # test return
    # return { "Latitude": 44.11111111111, "Longitude": -61.2222222222, "Altitude": 435.231223,"Bearing": get_magnetometer_data(), "Speed": 31.11111111 }

def get_magnetometer_data() -> float:
    """
    This function will read data from the magnetometer
    and return the angle that the user is pointing relative to the north pole

    Example:
    >>> get_magnetometer_data()
    >>> 352.2
    """

    try:
        i2c = board.I2C()
        qmc = qmc5883l.QMC5883L(i2c)

        
        # get x, y, and z for magnetometer
        x, y, z = qmc.magnetic

        # get the angle in degrees (143 is the offset)
        angle = round((math.degrees(math.atan(y/x)) * 2))
        # no negative angles
        if angle < 0:
            angle = angle + 360

        return angle
    except Exception as err:
        print(err)
        return 0

    
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




if __name__ == "__main__":
    # open and read from this serial port at a baud rate of 9600
    i2c = board.I2C()
    qmc = qmc5883l.QMC5883L(i2c)
    while True:
        i2c = board.I2C()
        qmc = qmc5883l.QMC5883L(i2c)

        
        # get x, y, and z for magnetometer
        x, y, z = qmc.magnetic

        angle = 0

        if x != 0:
            angle = round(math.degrees(math.atan(y/x)) * 2)
        elif x == 0:
            angle = 180

        if angle < 0:
            angle = angle + 360

        print(f"x: {x}, y: {y}, Theta: {angle}")
        time.sleep(0.5)

import board
import time
import qmc5883l
import math

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
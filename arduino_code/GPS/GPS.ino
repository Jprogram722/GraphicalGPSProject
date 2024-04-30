/*
  This is the code that will 
*/

// include the libraries
#include <SoftwareSerial.h>
#include "LiquidCrystal_I2C.h"
#include "TinyGPS++.h"
#include <QMC5883LCompass.h>
#include "Wire.h"

// set the pin numbers for the TX and RX pins
const static int TX_pin = 8, RX_pin = 7;

// setup a serial connection to the gps module
SoftwareSerial mySerial(TX_pin, RX_pin);

// const int accelerometer_addr = 0x68;

// set up a connection to the icd monitor (addr, cols, rows)
LiquidCrystal_I2C lcd(0x27, 20, 4);

// create a Tiny GPS Object
TinyGPSPlus gps;

// init variabes for the Accelorometer (16 bit integers)
// int16_t AcX,AcY,AcZ,Tmp,GyX,GyY,GyZ;

// char temp_str[7];

// char* convert_to_str(int16_t val){
//   sprintf(temp_str, "%6d", val);
//   return temp_str;
// }

// ------------- Magenetometer ---------------

QMC5883LCompass compass;

void setup()
{

  // start listening with the serial connections
  Serial.begin(9600);
  mySerial.begin(9600);

  // start the lcd screens
  
  lcd.init();
  lcd.backlight();

  // start the Accelormeter
  // docs: https://invensense.tdk.com/wp-content/uploads/2015/02/MPU-6000-Register-Map1.pdf
  // joins i2c bus as controller

  // Wire.begin();
  // Wire.beginTransmission(mag_addr);
  // // writes to the power management registar
  // Wire.write(0x6B);
  // // 0 is for starting the internal clock
  // // options 1, 2, 3 are for specific clock sets
  // Wire.write(0);
  // // end transmission for the peripheral
  // Wire.endTransmission(true);

  // magenometer
  compass.init();
  compass.setCalibrationOffsets(-151.00, 70.00, -77.00);
  compass.setCalibrationScales(0.99, 0.97, 1.05);
}

void loop()
{

  // this variable will store the raw data into main
  char raw_data;

  int angle;

  float latitude, longitude;

  // check to see if space is availible in the gps serial connection 
	while(mySerial.available() > 0)
	{

    // reads the raw GPS data
		raw_data = mySerial.read();
    // parse the data from the gps
		gps.encode(raw_data);

    // compass.read();
    // angle = compass.getAzimuth() + 42;

    // if(angle < 0){
    //   angle = angle + 360;
    // }

    // lcd.clear();
    // lcd.setCursor(0, 0);
    // lcd.print("Azimuth = ");
    // lcd.print(angle);
    // delay(1000);
    

    // print raw data
    // Serial.print(temp);
    // lat: 44.650627 lng: -63.597140

    // getting values from the arduino
    // Wire.beginTransmission(accelerometer_addr);
    // // starts reading at registar 0x3B (ACCEL_XOUT[15:8])
    // Wire.write(0x3B);
    // // when arduino restarts connection is kept active
    // Wire.endTransmission(false);
    // // get from 6 registars and stop
    // Wire.requestFrom(accelerometer_addr, 14, true);

    // // each variable reads 2 registars
    // // 3B -> 48
    // AcX = Wire.read() << 8 | Wire.read();
    // AcY = Wire.read() << 8 | Wire.read();
    // AcZ = Wire.read() << 8 | Wire.read();
    // Tmp = Wire.read() << 8 | Wire.read();
    // GyX = Wire.read() << 8 | Wire.read();
    // GyY = Wire.read() << 8 | Wire.read();
    // GyZ = Wire.read() << 8 | Wire.read();

    // Serial.print("gyro_x = ");
    // Serial.print(GyX);
    // Serial.print(" | Gryo_z = ");
    // Serial.println(GyZ);

    // checks to see if the location has updated

    if(gps.location.isUpdated()){
      // print the latitude and longitude

      latitude = gps.location.lat();
      longitude = gps.location.lng();
      compass.read();
      angle = compass.getAzimuth() + 42;

      if(angle < 0){
        angle = angle + 360;
      }

      Serial.print(latitude, 5);
      Serial.print(",");
      Serial.print(longitude, 5);
      Serial.print(",");
      Serial.println(angle);
    }
	}
} 

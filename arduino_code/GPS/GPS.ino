/*
  This is the code that will 
*/

// include the libraries
#include <SoftwareSerial.h>
#include "LiquidCrystal_I2C.h"
#include "TinyGPS++.h"

// set the pin numbers for the TX and RX pins
const static int TX_pin = 3, RX_pin = 2;

// setup a serial connection to the gps module
SoftwareSerial mySerial(TX_pin, RX_pin);

// set up a connection to the icd monitor (addr, cols, rows)
//LiquidCrystal_I2C lcd(0x27, 20, 4);

// create a Tiny GPS Object
TinyGPSPlus gps;

void setup()
{

  // start listening with the serial connections
  Serial.begin(9600);
  mySerial.begin(9600);

  // start the lcd screens
  // lcd.init();
  // lcd.backlight();
  // lcd.setCursor(0, 0);
  // lcd.clear();
  // lcd.print("Hello");

  pinMode(4, OUTPUT);
  
}

void loop()
{

  // check to see if space is availible in the gps serial connection 
	while(mySerial.available() > 0)
	{

    // reads the raw GPS data
		temp = mySerial.read();
    // parse the data from the gps
		gps.encode(temp);

    // print raw data
    // Serial.print(temp);
    // lat: 44.650627 lng: -63.597140
    
    // checks to see if the location has updated
    if(gps.location.isUpdated()){
      // print the latitude and longitude
      Serial.println(gps.location.lat());
      Serial.println(gps.location.lng());
      Serial.println("");
    }

	}
} 

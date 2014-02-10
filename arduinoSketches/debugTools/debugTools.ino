int ledPin = 3;    // LED connected to digital pin 3
 
void setup()  {
  // nothing happens in setup
  Serial.begin(9600);
  analogWrite(ledPin, 255);
}
 
void loop()  {
  //##### PROGRAM LOGIC
  
  //read in from Analog0 (which is connected to the potentiometer)
  int sensorValue = analogRead(0);
  
  //remember that our analogWrite has a min value of 0 and a max value of 255,
  //so we should map our input range to our output range
  int analogOut = map(sensorValue, 0, 1023, 0, 255);
  analogWrite(ledPin, analogOut);
  
  
  //##### DEBUGGING
  
  String output = "";
  
  int totalAnalogPins = 5;
  output += " #";
  for(int analogPin = 0; analogPin <= totalAnalogPins; analogPin++) {
    output += "a"+String(analogPin)+"i="+String(analogRead(analogPin));
    if(analogPin != totalAnalogPins)
      output += ",";
  }
  output += ",";
  for(int analogPin = 0; analogPin <= totalAnalogPins; analogPin++) {
    output += "a"+String(analogPin)+"o="+String(map(analogRead(analogPin), 0, 1023, 0, 255));
    if(analogPin != totalAnalogPins)
      output += ",";
  }
  output += ",";
  int totalDigitalPins = 13;
  for(int digitalPin = 0; digitalPin <= totalDigitalPins; digitalPin++) {
    output += "d"+String(digitalPin)+"i="+String(digitalRead(digitalPin));
    if(digitalPin != totalDigitalPins)
      output += ",";
  }
  output += ",";
  for(int digitalPin = 0; digitalPin <= totalDigitalPins; digitalPin++) {
    output += "d"+String(digitalPin)+"o="+String(digitalRead(digitalPin));
    if(digitalPin != totalDigitalPins)
      output += ",";
  }
  Serial.println(output);
  
  delay(1000); 
  
  
}

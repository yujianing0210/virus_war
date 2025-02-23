#define CLK 2  // Rotary Encoder Clock Pin
#define DT 3   // Rotary Encoder Data Pin
#define SW 4   // Rotary Encoder Button Pin

int lastCLK = HIGH; 
int lastButtonState = HIGH;

void setup() {
    Serial.begin(9600);
    pinMode(CLK, INPUT_PULLUP);
    pinMode(DT, INPUT_PULLUP);
    pinMode(SW, INPUT_PULLUP);
}

void loop() {
    int currentCLK = digitalRead(CLK);
    int currentDT = digitalRead(DT);
    int currentButton = digitalRead(SW);

    // Detect direction change
    if (currentCLK != lastCLK) {
        if (currentDT != currentCLK) {
            Serial.println("right1");  // Change bacteria direction to right
        } else {
            Serial.println("left1");   // Change bacteria direction to left
        }
    }
    lastCLK = currentCLK;

    // Detect button press (shoot bacteria)
    if (currentButton == LOW && lastButtonState == HIGH) {  
        Serial.println("shoot1");  
        delay(500);  // Prevent accidental double presses
    }
    lastButtonState = currentButton;
}

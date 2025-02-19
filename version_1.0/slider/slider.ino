const int potPin1 = A0;  // Player One's slider (left/right)
const int potPin2 = A1;  // Player Two's slider (left/right)
int lastPosition1 = 0;
int lastPosition2 = 0;
int threshold = 30;  // Minimum movement required to trigger an action

void setup() {
    Serial.begin(9600);
    lastPosition1 = analogRead(potPin1);
    lastPosition2 = analogRead(potPin2);
}

void loop() {
    int potValue1 = analogRead(potPin1);  // Read Player One's slider
    int potValue2 = analogRead(potPin2);  // Read Player Two's slider

    // Detect Player One's movement
    if (potValue1 - lastPosition1 > threshold) {
        Serial.println("right1"); // Move Player One right
    } else if (lastPosition1 - potValue1 > threshold) {
        Serial.println("left1"); // Move Player One left
    }
    lastPosition1 = potValue1;  // Update last position

    // Detect Player Two's movement
    if (potValue2 - lastPosition2 > threshold) {
        Serial.println("right2"); // Move Player Two right
    } else if (lastPosition2 - potValue2 > threshold) {
        Serial.println("left2"); // Move Player Two left
    }
    lastPosition2 = potValue2;  // Update last position

    delay(50);  // Small delay to prevent excessive messages
}


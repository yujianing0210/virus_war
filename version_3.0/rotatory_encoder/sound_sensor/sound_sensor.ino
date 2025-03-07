const int soundPin = A0;  // 声音传感器模拟口
const int threshold = 80;  // 你可以根据环境调这个阈值

void setup() {
    Serial.begin(9600);
    pinMode(soundPin, INPUT);
}

void loop() {
    int soundLevel = analogRead(soundPin);
    // Serial.println(soundLevel);

    if (soundLevel > threshold) {
        Serial.println("shoot1");  // 直接触发shoot
    }
    delay(50);
}


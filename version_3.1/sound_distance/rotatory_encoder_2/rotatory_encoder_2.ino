// 传感器引脚定义
const int trigPinLeft = 8;
const int echoPinLeft = 9;
const int trigPinRight = 6;
const int echoPinRight = 7;
const int soundSensorPin = A0;

// 阈值设置
const int coughThreshold = 50;  // 咳嗽音量
const int handDistanceThreshold = 10;  // 小于15cm认为手在遮挡

// 防抖定时
unsigned long lastCoughTime = 0;
const unsigned long coughCooldown = 500;  // 防连发

void setup() {
    Serial.begin(9600);
    
    pinMode(trigPinLeft, OUTPUT);
    pinMode(echoPinLeft, INPUT);
    
    pinMode(trigPinRight, OUTPUT);
    pinMode(echoPinRight, INPUT);
    
    pinMode(soundSensorPin, INPUT);
}

void loop() {
    // 读取距离和声音
    int leftDistance = getDistance(trigPinLeft, echoPinLeft);
    int rightDistance = getDistance(trigPinRight, echoPinRight);
    int soundLevel = analogRead(soundSensorPin);

    // 判断手势方向
    if (leftDistance < handDistanceThreshold) {
        Serial.println("left2");
    } else if (rightDistance < handDistanceThreshold) {
        Serial.println("right2");
    }

    // 判断咳嗽发射
    if (soundLevel > coughThreshold && millis() - lastCoughTime > coughCooldown) {
        Serial.println("shoot2");
        lastCoughTime = millis();
    }

    delay(50);  // 避免读取过于频繁
}

// 超声波测距函数
int getDistance(int trigPin, int echoPin) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    long duration = pulseIn(echoPin, HIGH);
    int distance = duration * 0.034 / 2;  // 距离=时间*声速/2

    return distance;
}

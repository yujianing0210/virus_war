#define CLK1 2  // 玩家1 旋转编码器 CLK (A 相)
#define DT1 3   // 玩家1 旋转编码器 DT (B 相)
#define SW1 4   // 玩家1 按钮

int lastStateCLK1; // 上次 CLK 读取值

void setup() {
    Serial.begin(9600);
    pinMode(CLK1, INPUT);
    pinMode(DT1, INPUT);
    pinMode(SW1, INPUT_PULLUP);

    lastStateCLK1 = digitalRead(CLK1);
}

void loop() {
    int currentStateCLK1 = digitalRead(CLK1);

    // 旋转编码器方向检测
    if (currentStateCLK1 != lastStateCLK1) {
        if (digitalRead(DT1) != currentStateCLK1) {
            Serial.println("right1");  // 细菌向右
        } else {
            Serial.println("left1");   // 细菌向左
        }
    }
    lastStateCLK1 = currentStateCLK1;

    // 按下按钮发射细菌
    if (digitalRead(SW1) == LOW) {
        Serial.println("shoot1");  // 发射细菌
        delay(300); // 防止误触连续触发
    }
}

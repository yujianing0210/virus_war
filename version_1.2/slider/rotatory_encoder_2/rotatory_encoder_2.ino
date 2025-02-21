#define CLK 2  
#define DT 3   
#define SW 4   

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

    // 读取旋转方向
    if (currentCLK != lastCLK) {
        if (currentDT != currentCLK) {
            Serial.println("right2");  // Player Two 右移
        } else {
            Serial.println("left2");   // Player Two 左移
        }
    }
    lastCLK = currentCLK;

    // 检测按钮按下
    if (currentButton == LOW && lastButtonState == HIGH) {  
        Serial.println("reset2");  // Player Two 触发重置
        delay(500);
    }
    lastButtonState = currentButton;
}


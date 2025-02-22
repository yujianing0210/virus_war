#define CLK 2  // 旋转编码器时钟信号 (D2)
#define DT 3   // 旋转编码器数据信号 (D3)
#define SW 4   // 旋转编码器按钮 (D4)

int lastCLK = HIGH;  // 存储上一次的 CLK 状态
int lastButtonState = HIGH; // 存储上一次按钮状态

void setup() {
    Serial.begin(9600);
    
    pinMode(CLK, INPUT_PULLUP);
    pinMode(DT, INPUT_PULLUP);
    pinMode(SW, INPUT_PULLUP);
}

void loop() {
    int currentCLK = digitalRead(CLK);  // 读取 CLK 信号
    int currentDT = digitalRead(DT);    // 读取 DT 信号
    int currentButton = digitalRead(SW); // 读取按钮状态

    // 检测旋转方向
    if (currentCLK != lastCLK) {  
        if (currentDT != currentCLK) {
            Serial.println("right1");  // 顺时针旋转，右移
        } else {
            Serial.println("left1");   // 逆时针旋转，左移
        }
    }
    lastCLK = currentCLK;  // 更新上一次的 CLK 状态

    // 检测按钮按下
    if (currentButton == LOW && lastButtonState == HIGH) {  
        Serial.println("reset");  // 发送重置指令
        delay(500);  // 防止抖动
    }
    lastButtonState = currentButton;  // 更新按钮状态
}

// svarskula.ino
// Kod för svarskula – tar emot svarsalternativ, lyssnar på piezo, skickar tillbaka valt svar

#include <esp_now.h>
#include <WiFi.h>

// Struktur för inkommande data från huvudkulan
typedef struct struct_message {
  char alternativ[4][32];
} struct_message;

struct_message incomingMessage;

uint8_t huvudkulaMAC[] = {0x24, 0x6F, 0x28, 0xAA, 0xBB, 0x00}; // MAC till huvudkulan

int piezoPin = 34; // GPIO där piezo sitter
int sensorTröskel = 200;

void onReceive(const uint8_t *mac, const uint8_t *incomingData, int len) {
  memcpy(&incomingMessage, incomingData, sizeof(incomingMessage));
  Serial.println("Mottog svarsalternativ:");
  for (int i = 0; i < 4; i++) {
    Serial.println(incomingMessage.alternativ[i]);
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  if (esp_now_init() != ESP_OK) {
    Serial.println("ESP-NOW init misslyckades");
    return;
  }

  esp_now_register_recv_cb(onReceive);

  esp_now_peer_info_t peerInfo = {};
  memcpy(peerInfo.peer_addr, huvudkulaMAC, 6);
  peerInfo.channel = 0;
  peerInfo.encrypt = false;
  esp_now_add_peer(&peerInfo);
}

void loop() {
  int sensorValue = analogRead(piezoPin);
  if (sensorValue > sensorTröskel) {
    Serial.println("Träff registrerad!");
    const char* svar = incomingMessage.alternativ[0]; // Vi antar att denna kula är kopplad till alternativ A
    esp_now_send(huvudkulaMAC, (uint8_t*)svar, strlen(svar) + 1);
    delay(1000);
  }
}

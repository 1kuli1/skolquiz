// huvudkula.ino
// Kod för huvudkulan – tar emot fråga via WiFi och sänder ut till svarskulor via ESP-NOW

#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <esp_now.h>

// Här definieras strukturen som sänds till svarskulorna
typedef struct struct_message {
  char alternativ[4][32];  // Fyra svarsalternativ
} struct_message;

struct_message outgoingMessage;

AsyncWebServer server(80); // Skapar en HTTP-server på port 80

// Här anger du MAC-adresserna till dina svarskulor
uint8_t svarskulaMAC[4][6] = {
  {0x24, 0x6F, 0x28, 0xAA, 0xBB, 0x01},
  {0x24, 0x6F, 0x28, 0xAA, 0xBB, 0x02},
  {0x24, 0x6F, 0x28, 0xAA, 0xBB, 0x03},
  {0x24, 0x6F, 0x28, 0xAA, 0xBB, 0x04}
};

void setup() {
  Serial.begin(115200);

  WiFi.softAP("huvudkula", "12345678");
  Serial.println("WiFi AP startad");

  if (esp_now_init() != ESP_OK) {
    Serial.println("ESP-NOW init misslyckades");
    return;
  }

  for (int i = 0; i < 4; i++) {
    esp_now_peer_info_t peerInfo = {};
    memcpy(peerInfo.peer_addr, svarskulaMAC[i], 6);
    peerInfo.channel = 0;
    peerInfo.encrypt = false;
    esp_now_add_peer(&peerInfo);
  }

  // Server för att ta emot frågan från appen
  server.on("/fraga", HTTP_POST, [](AsyncWebServerRequest *request){}, NULL,
    [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
      StaticJsonDocument<512> doc;
      DeserializationError error = deserializeJson(doc, data);
      if (error) {
        request->send(400, "application/json", "{"status":"invalid JSON"}");
        return;
      }

      // Spara de fyra svarsalternativen
      for (int i = 0; i < 4; i++) {
        strlcpy(outgoingMessage.alternativ[i], doc["alternativ"][i], sizeof(outgoingMessage.alternativ[i]));
      }

      // Skicka till alla svarskulor
      for (int i = 0; i < 4; i++) {
        esp_now_send(svarskulaMAC[i], (uint8_t *) &outgoingMessage, sizeof(outgoingMessage));
      }

      request->send(200, "application/json", "{"status":"fråga mottagen"}");
    });

  server.begin();
}

void loop() {
  // Inget att göra i loop just nu
}

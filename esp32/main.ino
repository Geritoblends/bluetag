#if defined(ESP32)
#include <WiFi.h>
#include <MQTT.h>

// --- CONFIGURACIÓN PRIVADA ---
const char* WIFI_SSID = "h";          // 🔹 Escribe aquí el nombre de tu red WiFi
const char* WIFI_PASS = "geronimo";    // 🔹 Escribe aquí tu contraseña de WiFi

const char* MQTT_SERVER = "test.mosquitto.org";  // 🔹 Servidor MQTT (público para pruebas)
const int MQTT_PORT = 1883;                      // 🔹 Puerto estándar
const char* MQTT_CLIENT_ID = "ESP32_client";     // 🔹 Nombre del cliente (puedes cambiarlo)
const char* MQTT_TOPIC_SEND = "esp32/bateria";   // 🔹 Tema donde el ESP32 enviará mensajes
const char* MQTT_TOPIC_RECEIVE = "esp32/sonido"; // 🔹 Tema donde el ESP32 escuchará

// --- OBJETOS Y PINES ---
WiFiClient net;
MQTTClient client;

const int LED_PIN = 2;      // 🔹 LED conectado al pin 2
const int BUTTON_PIN = 4;   // 🔹 Botón en el pin 4
const int BUZZER_PIN = 15;  // 🔹 Buzzer (opcional) en el pin 15

bool lastButtonState = HIGH;

// --- FUNCIÓN: CONECTAR AL WIFI ---
void connectWiFi() {
  Serial.print("Conectando a WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" Conectado!");
}

// --- FUNCIÓN: CONECTAR AL BROKER MQTT ---
void connectMQTT() {
  Serial.print("Conectando al broker MQTT...");
  while (!client.connect(MQTT_CLIENT_ID)) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println(" Conectado!");
  client.subscribe(MQTT_TOPIC_RECEIVE); // 🔹 Escucha mensajes en este tema
}

// --- FUNCIÓN: AL RECIBIR UN MENSAJE MQTT ---
void messageReceived(String &topic, String &payload) {
  Serial.println("Mensaje recibido: " + payload);
  
  if (payload == "led") {
    // 🔹 Prende y apaga el LED 3 veces
    for (int i = 0; i < 3; i++) {
      digitalWrite(LED_PIN, HIGH);
      delay(300);
      digitalWrite(LED_PIN, LOW);
      delay(300);
    }
  }
  else if (payload == "sonido") {
    // 🔹 Emite un pitido corto
    tone(BUZZER_PIN, 1000, 500);
  }
}

// --- SETUP (solo se ejecuta una vez) ---
void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);

  connectWiFi(); // 🔹 Conexión al WiFi

  client.begin(MQTT_SERVER, MQTT_PORT, net);
  client.onMessage(messageReceived); // 🔹 Configura la función que manejará los mensajes
  connectMQTT(); // 🔹 Conexión inicial al broker MQTT
}

// --- LOOP (se repite todo el tiempo) ---
void loop() {
  client.loop(); // 🔹 Revisa si hay mensajes nuevos

  if (!client.connected()) {
    connectMQTT(); // 🔹 Si se desconecta, intenta reconectarse
  }

  bool buttonState = digitalRead(BUTTON_PIN);
  if (buttonState == LOW && lastButtonState == HIGH) {
    Serial.println("Botón presionado -> enviando batería baja");
    client.publish(MQTT_TOPIC_SEND, "bateria baja"); // 🔹 Enviar mensaje al broker
  }
  lastButtonState = buttonState;
}
#endif

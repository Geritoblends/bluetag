import mqtt, { MqttClient } from 'mqtt';

// --- Configuration ---
const MQTT_BROKER = process.env.NEXT_PUBLIC_MQTT_BROKER || 'ws://localhost:9001';

// You should typically load these from environment variables 
// or a secure configuration file, NOT hardcoded.
const MQTT_USERNAME = 'usuariotec';
const MQTT_PASSWORD = 'Numero1234$.'; 
// --- End Configuration ---

let client: MqttClient | null = null;

export const getMQTTClient = (): MqttClient => {
  if (!client) {
    // 💡 The change is here: pass a second argument with options
    client = mqtt.connect(MQTT_BROKER, {
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
    });
    
    client.on('connect', () => {
      console.log('[v0] MQTT connected with user', MQTT_USERNAME, 'to', MQTT_BROKER);
    });

    client.on('error', (error) => {
      console.error('[v0] MQTT connection error:', error);
    });
  }
  
  return client;
};

export const emitSound = (macAddress: string) => {
  const client = getMQTTClient();
  const topic = `tags/${macAddress}/emit_sound`;
  client.publish(topic, '1');
  console.log('[v0] Emitted sound to', topic);
};

export const subscribeToDistance = (
  macAddress: string,
  callback: (distance: number) => void
) => {
  const client = getMQTTClient();
  const topic = `tags/${macAddress}/distance`;
  
  client.subscribe(topic, (err) => {
    if (err) {
      console.error('[v0] Failed to subscribe to', topic, err);
    } else {
      console.log('[v0] Subscribed to', topic);
    }
  });

  const messageHandler = (receivedTopic: string, message: Buffer) => {
    if (receivedTopic === topic) {
      const distance = parseFloat(message.toString());
      callback(distance);
    }
  };

  client.on('message', messageHandler);

  return () => {
    client.unsubscribe(topic);
    client.off('message', messageHandler);
  };
};

export const scanAvailableTags = (callback: (macAddress: string) => void) => {
  const client = getMQTTClient();
  const topic = 'availableTags';
  
  client.subscribe(topic, (err) => {
    if (err) {
      console.error('[v0] Failed to subscribe to availableTags', err);
    } else {
      console.log('[v0] Subscribed to availableTags');
    }
  });

  const messageHandler = (receivedTopic: string, message: Buffer) => {
    if (receivedTopic == 'availableTags') {
      const macAddress = message.toString();
      callback(macAddress);
    }
  };

  client.on('message', messageHandler);

  return () => {
    client.unsubscribe(topic);
    client.off('message', messageHandler);
  };
};

import React, { Component } from 'react';
import init from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';
import uuid from "react-native-uuid"

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: false,
  sync: {
  }
});

const defaultConnectOptions = {
  reconnect: true,
  cleanSession: true,
  mqttVersion: 4,
  keepAliveInterval: 60,
  timeout: 60
}

export default class MQTTConnection extends Component {
  constructor(props) {
    super();
    this.mqtt = null;
    this.QOS = 0;
    this.RETAIN = true;
  }

  connect(host, port, options = null) {
    if (options) {
      this.QOS = options.qos;
      this.RETAIN = options.retain;
    }

    let currentTime = +new Date();
    let clientID = currentTime + uuid.v1();
    clientID = clientID.slice(0, 23);
    console.log("clientID ", clientID);
    this.mqtt = new Paho.MQTT.Client(host, port, clientID);
    this.mqtt.onConnectionLost = (res) => {
      this.onMQTTLost(res);
    }
    this.mqtt.onMessageArrived = (message) => {
      console.log("message ",JSON.stringify(message))
      this.onMQTTMessageArrived(message);
    }
    this.mqtt.onMessageDelivered = (message) => {
      this.onMQTTMessageDelivered(message);
    }

    const connectOptions = options ? options : defaultConnectOptions;

    this.mqtt.connect({
      onSuccess: this.onMQTTSuccess,
      onFailure: this.onMQTTFailure,
      ...connectOptions
    })

  }

  onMQTTSuccess = () =>{
    this.onMQTTConnect();
  }

  onMQTTFailure = () =>{
    this.onMQTTLost();
  }

  subscribeChannel = (channel) => {
    console.log("MQTT Connection subscribe channel ", channel);
    if (!this.mqtt || !this.mqtt.isConnected()) {
      return;
    }
    this.mqtt.subscribe(channel);
  }

  unSubscribeChannel = (channel) => {
    console.log("MQTT Connection unsubscribe channel ", channel);
    if (!this.mqtt || !this.mqtt.isConnected()) {
      return;
    }
    this.mqtt.unsubscribe(channel);
  }

  send = (channel = null,payload) => {
    console.log("MQTT Connection subscribe channel ", channel);
    if (!this.mqtt || !this.mqtt.isConnected()) {
      return;
    }

    if (!channel || !payload) {
      return false;
    }

    console.log(`MQTT connection send publish channel : ${channel} ,payload ${payload} qos:`);
    this.mqtt.publish(channel, payload, this.QOS, this.RETAIN);
  }

  close() {
    this.mqtt && this.mqtt.disconnect();
    this.mqtt = null;
  }

}

MQTTConnection.prototype.onMQTTConnect = null;
MQTTConnection.prototype.onMQTTLost = null;
MQTTConnection.prototype.onMQTTMessageArrived = null;
MQTTConnection.prototype.onMQTTMessageDelivered = null;

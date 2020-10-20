import React, { Component } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import MQTTConnection from "./MQTTConnection";
import { Buffer } from "buffer";
global.Buffer = Buffer;

import mqtt from "mqtt/dist/mqtt";

class App extends Component {

    constructor() {
        super();
    }

    componentDidMount() {
        this.mqttConnect = new MQTTConnection;
        this.mqttConnect.onMQTTConnect = this.onMQTTConnect;
        this.mqttConnect.onMQTTLost = this.onMQTTLost;
        this.mqttConnect.onMQTTMessageArrived = this.onMQTTMessageArrived;
        this.mqttConnect.onMQTTMessageDelivered = this.onMQTTMessageDelivered;
        this.mqttConnect.connect("13.59.122.156", 1883)
    }

    onMQTTConnect = () => {
        console.log("On mqtt connect");
        this.mqttConnect.subscribeChannel('test1');
    }

    onMQTTLost = (res) => {
        console.log("On mqtt connection lost " + JSON.stringify(res));
    }

    onMQTTMessageArrived = (message) => {
        // console.log("Message arrived ", message);
        // console.log("Message payload string ", message._getPayloadString());
    }

    onMQTTMessageDelivered = (message) => {
        console.log("Message delivered ", message);
    }

    componentWillUnmount = () => {
        this.mqttConnect.close();
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>RN MQTT</Text>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
});

export default App;
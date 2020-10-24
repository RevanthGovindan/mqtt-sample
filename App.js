import React, { Component } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { Buffer } from "buffer";
global.Buffer = Buffer;
import MQTT from 'sp-react-native-mqtt';


class App extends Component {

    constructor() {
        super();
        this.client = null;
    }

    componentDidMount() {

        MQTT.createClient({
            uri: 'mqtt://13.59.122.156:1883',
            clientId: 'clientId-6FQNHncuKg',
            user: "hankerbee",
            pass: "Hb@1234()",
            auth: true
        }).then(function (client) {

            client.on('closed', function () {
                console.log('mqtt.event.closed');
            });

            client.on('error', function (msg) {
                console.log('mqtt.event.error', msg);
            });

            client.on('message', function (msg) {
                console.log('mqtt.event.message', msg);
            });

            client.on('connect', function () {
                console.log('connected');
                client.subscribe('/data', 0);
                client.publish('/data', "test", 0, false);
            });

            client.connect();
        }).catch(function (err) {
            console.log(err);
        });
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
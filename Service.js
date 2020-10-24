import mqtt from "mqtt/dist/mqtt";

const websocketUrl = "ws://broker.mqttdashboard.com:8000/mqtt";
// const websocketUrl = "ws://13.59.122.156:9001/";

// const websocketUrl = "tcp://test.mosquitto.org:1883";

const apiEndpoint = "/";
function getClient(errorHandler) {
    const client = mqtt.connect(websocketUrl, {
        clientId: "clientId-DKnxDqPnnn",
        resubscribe: true
    });
    client.on("connect", () => {
        console.log("connected connected connected")
    })
    client.stream.on("error", (err) => {
        console.log("err ",err)
        errorHandler(`Connection to ${websocketUrl} failed`);
        client.end();
    });
    return client;
}
function subscribe(client, topic, errorHandler) {
    const callBack = (err, granted) => {
        if (err) {
            errorHandler("Subscription request failed");
        }
    };
    return client.subscribe(apiEndpoint + topic, {
        qos: 2
    }, callBack);
}
function onMessage(client, callBack) {
    client.on("message", (topic, message, packet) => {
        console.log(new TextDecoder("utf-8").decode(message))
        // callBack(JSON.parse(new TextDecoder("utf-8").decode(message)));
    });
}
function unsubscribe(client, topic) {
    client.unsubscribe(apiEndpoint + topic);
}
function closeConnection(client) {
    client.end();
}
const mqttService = {
    getClient,
    subscribe,
    onMessage,
    unsubscribe,
    closeConnection,
};
export default mqttService;
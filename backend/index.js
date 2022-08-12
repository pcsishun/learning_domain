require("dotenv").config();

const express = require("express");
const mqtt = require("mqtt");
const cors = require("cors");
const timeout = require("connect-timeout");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
// app.use(timeout(15000));

const port  = process.env.PORT;


app.get("backend/", (req, res) => {
    res.send("ok");
});

app.get("backend/testing", (req, res) => {
    console.log("mqtt api")
    try{

        const client = mqtt.connect({
            host: process.env.MQTT_SERVER,
            port: process.env.MQTT_PORT,
            username: process.env.MQTT_USER,
            password: process.env.MQTT_PASSWORD
        });
        
        
        client.on('connect',  () => {
            // Subscribe any topic
            console.log("MQTT Connect");
            client.subscribe('test1',  (err) => {
                if (err) {
                    console.log(err);
                    client.publish("test1", "connectFail")
                }else{
                    client.publish("test1", "isConnect")
                }
                // client.publish("test", "hello from NodeJS")
            });
        });
        
        // Receive Message and print on terminal
        client.on('message',  (topic, message) => {
            // message is Buffer
            // console.log(message.toString());
            // console.log(topic);
            if(topic === 'test1' && message.toString() === "isConnect"){
                // const replyBack = {
                //     data:"success from nodejs"
                // }
                console.log("success from nodejs")
                res.send("success from nodejs");
            }else if(message.toString() === "connectFail"){
                // const replyBack = {
                //     data: "connection from nodejs fail"
                // }
                console.log("connectFail")
                res.send("connection from nodejs fail")
            }
            // client.publish("test", "hello from NodeJS")
        });

    }catch(err){
        console.log(err);
    }
    


    
})


app.listen(8888, () => {
    // console.log(`app listen at port ${port} ==> http://localhost:${port}`)
    console.log(`app listen at port 8888 ==> http://localhost:8888`)
})

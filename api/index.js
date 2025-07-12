require('dotenv').config();
const express =  require('express');
const whatsAppClient = require("@green-api/whatsapp-api-client");
const bodyParser = require("body-parser");

const PORT = process.env.PORT;
const GREEN_API_INSTANCE_ID = process.env.GREEN_API_INSTANCE_ID;
const GREEN_API_INSTANCE_TOKEN = process.env.GREEN_API_INSTANCE_TOKEN;
const ADMIN_NUMBER = process.env.ADMIN_NUMBER;

const app = express();
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Hello from Express with TypeScript!');
});

const restAPI = whatsAppClient.restAPI({
    idInstance: GREEN_API_INSTANCE_ID,
    apiTokenInstance: GREEN_API_INSTANCE_TOKEN,
});

// @ts-ignore
const webHookAPI = whatsAppClient.webhookAPI(app, "/webhooks");
webHookAPI.onIncomingMessageText( async (data, idInstance, idMessage, sender, typeMessage, textMessage) => {
        // const response = await restAPI.message.sendMessage(
        //     `${sender}`,
        //     null,
        //     ${}
        // );

        console.log('START=============================================')
        console.log(`data ${JSON.stringify(data)}`);
        // console.log(`idInstance ${idInstance.toString()}`);
        // console.log(`idMessage ${idMessage.toString()}`);
        console.log(`sender ${JSON.stringify(sender)}`);
        console.log(`typeMessage ${JSON.stringify(typeMessage)}`);
        console.log(`textMessage ${JSON.stringify(textMessage)}`);
        console.log('END=============================================')
    }
);

app.listen(PORT, async () => {
  try {
    console.log(`Server running on http://localhost:${PORT}`);
    
        // Send test message that triggers webhook
        const response = await restAPI.message.sendMessage(
            `${ADMIN_NUMBER}@c.us`,
            null,
            "Mutasim Bot is running"
        );
  }
  catch(e){
    console.error('error: ', e);
  }
});

module.exports = app;

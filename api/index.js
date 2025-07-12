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
        
        const senderName = data.senderData.senderName;
        const sender = data.senderData.sender;
        const typeMessage = data.messageData.typeMessage;
        if (textMessage === 'textMessage') {
            const messageText = data.messageData.textMessageData.textMessage;
            const response = await restAPI.message.sendMessage(
                `${sender}`,
                null,
                'Hello Mutasim is not available right now, how can I help you?'
                );
        }

        console.log(`MessageData`, JSON.stringify(data, undefined, 2));
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
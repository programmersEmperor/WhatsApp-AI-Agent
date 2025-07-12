require('dotenv').config();
const express =  require('express');
const whatsAppClient = require("@green-api/whatsapp-api-client");
const bodyParser = require("body-parser");
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai')

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    maxOutputTokens: 2000,
    temperature: 0.0
});


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
        try {
        
        console.log(`MessageData`, JSON.stringify(data, undefined, 2));
        
        const mySenderName = data.senderData.senderName;
        const mySender = data.senderData.sender;
        const myTypeMessage = data.messageData.typeMessage;
        if (myTypeMessage === 'textMessage') {
            const myTextMessage = data.messageData.textMessageData.textMessage;
            console.log('myTextMessage', myTextMessage)

            const aiResponse = await model.invoke('hi')

            console.log('ai response', aiResponse.content.toString())

            await restAPI.message.sendMessage(
                `${mySender}`,
                null,
                aiResponse.content.toString()
            );
        }


        }
        catch(e){
            console.error(e)
        }
    }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
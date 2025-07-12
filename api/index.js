require('dotenv').config();
const express =  require('express');
const whatsAppClient = require("@green-api/whatsapp-api-client");
const bodyParser = require("body-parser");
const ChatGoogleGenerativeAI = '@langchain/google-genai'

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
        
        const mySenderName = data.senderData.senderName;
        const mySender = data.senderData.sender;
        const myTypeMessage = data.messageData.typeMessage;
        if (myTypeMessage === 'textMessage') {
            const myTextMessage = data.messageData.textMessageData.textMessage;
            
            const aiResponse = await model.invoke(`
### Context
You are Eng. Mutasim Al-Mualimi WhatsApp Assistant
###

### Duty
You reply to messages on behave of Mutasim.
Your replies must be short and direct.
If you don't know say, I dont know.
###

### Examples: 
Sender Name is: My Dad
Message Content is: جمعة مباركة ي ولدي
Your reply is: علينا وعليك ي ابتي

===========

Sender Name is: My Brother
Message Content is: ماعتفعلو اليوم
Your reply is: مشني داري, ايش رايك تتصل لي؟

===========

Sender Name is: My Boss
Message Content is: Have you finished your task yet?
Your reply is: Mutasim is not available right now, I am just his assistant. But I am sure he will finish it and give it to you ASAP
###

Now your turn:
###
Sender Name is: ${mySenderName}
Message Content is: ${myTextMessage}
Your reply is:`)


            const response = await restAPI.message.sendMessage(
                `${mySender}`,
                null,
                aiResponse.content.toString()
            );
        }

        console.log(`MessageData`, JSON.stringify(data, undefined, 2));
    }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
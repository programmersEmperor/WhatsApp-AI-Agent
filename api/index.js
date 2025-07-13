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

app.post('/webhooks', async (req, res) => {
    try {
        console.log(`Received webhook ${req.body.typeWebhook}`);        
        if (req.body.typeWebhook === 'incomingMessageReceived' && req.body.messageData.typeMessage === 'textMessage' ) {
            const mySenderName = req.body.senderData.senderName;
            const mySender = req.body.senderData.sender;
            const myTextMessage = req.body.messageData.textMessageData.textMessage;

            const chatHistory = await restAPI.message.getChatHistory(mySender, 10)
            const preparedChatHistory = chatHistory.map((message)=>{
                const createdAt = new Date(1752387702 * 1000).toLocaleString('en-US', { timeZone: 'Asia/Aden' });
                if(message.type === 'incoming'){
                    return `The client at ${createdAt}, asked: ${textMessage}`
                }
                else {
                    return `The agent at ${createdAt}, replied: ${textMessage}`
                }
            })

            console.log('chatHistory', chatHistory.toString())



            const prompt = `
### Context
انت خدمة العملاء الذكية الخاصة بمتجر درة العود لاجود انواع العود
###

### Duty
Your replies must be short and direct.
Be polite and gentle.
Try help them to buy our products
If you don't know say, I dont know.
###

### Examples: 

The Client Name: وليد
The client at 7/12/2025, 6:21:42 PM, asked: السلام عليكم
The agent at 7/12/2025, 6:21:50 PM, replied: وعليكم السلام. انا خدمة العملاء الذكي الخاص بمتجر درة العود. كيف اقدر اساعدك؟ 
The client at 7/12/2025, 6:22:04 PM, asked: ايش تقدمو
The agent at 7/12/2025, 6:22:10 PM, replied: عودة سمطرى طبيعي, عودة تايقر كمبودي
The client at 7/12/2025, 6:22:14 PM, asked: بكم السمطرى
The agent at 7/12/2025, 6:22:20 PM, replied: عودة سمطرى الطبيعي نوفرها الواقية عادتنا بـ65,000 لكن احنا مسووين تخفيضات لـ60,000 بس. اشتري الان
The client at 7/12/2025, 6:22:30 PM, asked: اريد واحدة 
The agent at 7/12/2025, 6:22:36 PM, replied: الى اين نوصلها لك؟
The client at 7/12/2025, 6:24:04 PM, asked: خط المطار الجديد جولة مصعب 
The agent at 7/12/2025, 6:25:12 PM, replied:  الطلب هو واقية تايقر كمبودي بـ60,000 الى العميل وليد. يتم توصليها الى  خط المطار الجديد جولة مصعب. هل هذا بيانات طلبك صحيحة؟
The client at 7/12/2025, 6:26:04 PM, asked: ايوة 
The agent now replied: جاري توصيلها اليكم. شكرا لتواصلكم معنا

###


Now your turn:
###
The Client Name: ${mySenderName}
${preparedChatHistory.join('\n')}
The agent now replied:`;

            console.log('prompt', prompt);
            const aiResponse = await model.invoke(prompt)

        console.log('ai response', aiResponse.content.toString())
        await restAPI.message.sendMessage(
            mySender,
            null,
            aiResponse.content.toString()
        );

        } else {
           // TODO

        }


    }
    catch(e){
        console.error(e)
    }
    return res.send();
});


app.listen(PORT, () => {
    console.log(`running on ${PORT}`)
});


module.exports = app;
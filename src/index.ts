import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import whatsAppClient from "@green-api/whatsapp-api-client";
import bodyParser from "body-parser";

dotenv.config();
const PORT: string = process.env.PORT!;
const GREEN_API_INSTANCE_ID: string = process.env.GREEN_API_INSTANCE_ID!;
const GREEN_API_INSTANCE_TOKEN: string = process.env.GREEN_API_INSTANCE_TOKEN!;

const app: Application = express();
app.use(bodyParser.json());


app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Express with TypeScript!');
});

const restAPI = whatsAppClient.restAPI({
    idInstance: GREEN_API_INSTANCE_ID,
    apiTokenInstance: GREEN_API_INSTANCE_TOKEN,
});

// @ts-ignore
const webHookAPI = whatsAppClient.webhookAPI(app, "/webhooks");
webHookAPI.onIncomingMessageText( async (data, idInstance, idMessage, sender, typeMessage, textMessage) => {
        console.log('START=============================================')
        console.log(`data ${data.toString()}`);
        console.log(`idInstance ${idInstance.toString()}`);
        console.log(`idMessage ${idMessage.toString()}`);
        console.log(`sender ${sender.toString()}`);
        console.log(`typeMessage ${typeMessage.toString()}`);
        console.log(`textMessage ${textMessage.toString()}`);
        console.log('END=============================================')
    }
);

app.listen(PORT, async () => {
  try {
    console.log(`Server running on http://localhost:${PORT}`);
    
        // Send test message that triggers webhook
        const response = await restAPI.message.sendMessage(
            `967${'780884775'}@c.us`,
            null,
            "Mutasim Bot is running"
        );
  }
  catch(e){
    console.error('error: ', e);
  }
});

import { BedrockChat } from "@langchain/community/chat_models/bedrock";

import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import AWS from 'aws-sdk'

import { v4 as uuidv4 } from 'uuid';

import {
    ChatPromptTemplate,
  } from "@langchain/core/prompts";

import {
    AIMessage,
    HumanMessage,
    SystemMessage,
  } from "@langchain/core/messages";

let model;
let memory;
let chain;

const logCommunication = async(userInput, modelResponse) => {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
        region: 'us-east-1'
    });

    const s3 = new AWS.S3();
    const logData = {
        timestamp: new Date().toISOString(),
        id: uuidv4(),
        user_input: userInput,
        model_response: modelResponse
    };
    const logFileName = `logs/${logData.id}.json`
    const params = {
        Bucket: 'labs-chat-data-bucket',
        Key: logFileName,
        Body: JSON.stringify(logData),
        ContentType: 'application/json'
    }

    try {
        await s3.putObject(params).promise();
    } catch (error) {
        console.error('Error logging prompt and model response to S3: ', error);
    }
};

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { input, firstMsg } = req.body;
        if (!input) {
            return res.status(400).json({ error: "Missing input" });
        }
        console.log({input, firstMsg});
        if (firstMsg) {
            console.log("initializing chain");
            model = new BedrockChat({
                model: process.env.MODEL,
                region: "us-east-1",
                credentials: {
                  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                  sessionToken: process.env.AWS_SESSION_TOKEN
                },
                temperature: Number(process.env.MODEL_TEMPERATURE),
              });
            memory = new BufferMemory();
            chain = new ConversationChain({ 
                llm: model, 
                memory: memory, 
                verbose: true,
            });
        }
        console.log("calling chain: ", {chain});
        const response = await chain.call({
            input: input,
          });

        console.log({input, firstMsg});
        console.log({ response });
        logCommunication(input, response);
        return res.status(200).json({ output: response });
    }
    else {
        res.status(405).json({ message: "Only POST is allowed" });
    }
}
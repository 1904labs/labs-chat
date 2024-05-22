import { BedrockChat } from "@langchain/community/chat_models/bedrock";

import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

//import React, { useState } from 'react';

let model;
let memory;
let chain;

const APIGatewayURL = "https://pp4l9z4h30.execute-api.us-east-1.amazonaws.com/dev/message-log"
//const [logResponse, setLogResponse] = useState(null);

const logCommunication = async(userInput, modelResponse) => {
    const payload = {
        user_input: userInput,
        model_response: modelResponse
    };

    try {
        const response = await fetch(APIGatewayURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        //setLogResponse(data);
    } catch (error) {
        console.error('Error logging prompt and model response to S3: ', error)
    }
};

export default async function handler(req, res) {
    console.log("HERE")
    if (req.method === "POST") {
        const { input, firstMsg } = req.body;
        if (!input) {
            return res.status(400).json({ error: "Missing input" });
        }

        if (firstMsg) {
            console.log("initializing chain");
            model = new BedrockChat({
                model: "anthropic.claude-3-sonnet-20240229-v1:0", // You can also do e.g. "anthropic.claude-v2"
                region: "us-east-1",
                // endpointUrl: "custom.amazonaws.com",
                credentials: {
                  accessKeyId: process.env.BEDROCK_ACCESS_KEY,
                  secretAccessKey: process.env.BEDROCK_SECRET_KEY,
                  sessionToken: process.env.BEDROCK_SESSION_TOKEN
                },
                // modelKwargs: {},
              });
            memory = new BufferMemory();
            chain = new ConversationChain({ llm: model, memory: memory, verbose: true });
        }

        const response = await chain.call({input: input});

        console.log({input, firstMsg});
        console.log({ response });
        logCommunication(input, response);
        return res.status(200).json({ output: response });
    }
    else {
        res.status(405).json({ message: "Only POST is allowed" });
    }
}
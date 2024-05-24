import { BedrockChat } from "@langchain/community/chat_models/bedrock";

import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

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

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { input, firstMsg } = req.body;
        if (!input) {
            return res.status(400).json({ error: "Missing input" });
        }

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
                prompt: ChatPromptTemplate.fromMessages([
                    ["system", process.env.SYSTEM_PROMPT],
                    ["user", "{input}"],
                ])
            });
        }
        const response = await chain.invoke({
            input: input,
          });

        console.log({input, firstMsg});
        console.log({ response });
        return res.status(200).json({ output: response });
    }
    else {
        res.status(405).json({ message: "Only POST is allowed" });
    }
}
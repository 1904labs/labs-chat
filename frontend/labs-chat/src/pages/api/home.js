import { Bedrock } from "@langchain/community/llms/bedrock/web";

import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

let model;
let memory;
let chain;

export default async function handler(req, res) {
    console.log("HERE")
    if (req.method === "POST") {
        const { input, firstMsg } = req.body;
        if (!input) {
            return res.status(400).json({ error: "Missing input" });
        }

        if (firstMsg) {
            console.log("initializing chain");
            model = new Bedrock({
                model: "anthropic.claude-3-sonnet-20240229-v1:0", // You can also do e.g. "anthropic.claude-v2"
                region: "us-east-1",
                // endpointUrl: "custom.amazonaws.com",
                // credentials: {
                //   accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID!,
                //   secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY!,
                // },
                // modelKwargs: {},
              });
            memory = new BufferMemory();
            chain = new ConversationChain({ llm: model, memory: memory });
        }

        const response = await model.invoke("Human: " +input);
        console.log(response);
        // const response = await chain.predict(input);

        console.log({input, firstMsg});

        console.log({ response });
        return res.status(200).json({ output: response });
    }
    else {
        res.status(405).json({ message: "Only POST is allowed" });
    }
}
// This is a mock API that simulates the behavior of the LLM API
import { NextResponse } from "next/server";

////////////////////////////////////////////
// utility functions for mocking the API
////////////////////////////////////////////

// random range between 100 and 500
const randomSleepTime = async (min, max) =>
  Math.floor(Math.random() * max) + min;

const FAKE_DELAY = 300;
const encoder = new TextEncoder();

// this is just to simulate the API response
// we are not actually doing this anyway
// edge is required to return a streaming response
export const runtime = "edge";

function iteratorToStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

async function* makeIterator() {
  const fakeBotResponse = "This is the bot response message";
  const tokens = splitSentenceIntoTokens(fakeBotResponse);
  for (let i = 0; i < tokens.length; ++i) {
    await randomSleepTime(FAKE_DELAY, FAKE_DELAY * 2);
    const obj = { token: tokens[i] };
    const jsonObj = JSON.stringify(obj);
    yield encoder.encode(jsonObj);
  }
}

// function that splits sentence into array of
// randomly sized words from 1 - 3 words but keeps the spaces and order
const splitSentenceIntoTokens = (sentence) => {
  const words = sentence.split(" ");
  const tokens = [];
  let i = 0;
  while (i < words.length) {
    const numWords = Math.floor(Math.random() * 3) + 1;
    tokens.push(words.slice(i, i + numWords).join(" "));
    i += numWords;
  }
  return tokens;
};

export default async function POST() {
  const iterator = makeIterator();
  const stream = iteratorToStream(iterator);
  return new NextResponse(stream);
}

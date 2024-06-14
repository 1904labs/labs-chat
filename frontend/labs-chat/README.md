This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Locally

#### Prerequisites

1. AWS credentials set in `.env.local`

   - go to `go.aws.1904.io`
   - select the appropriate project (needs access to Bedrock Models configured, S3, DynamoDB)
   - Set env variables, similar to env.sample

1. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## AWS Resources

This project has several resources in AWS.

It also relies on document format within AWS

### System Prompts

Storing System Prompts within S3:
Path:

```
S3 / labs_chat_data_bucket / system_prompts / chat / filename_versionNumber
```

(Filename) - Human readable identifier. Maybe a summary or department name,

Format:

```
[filename]_[5-digit version number, i.e. 00001]
```

Contents of the json file within S3:
JSON with a text field `prompt`

```
{
    "prompt": "You are a friendly, AI assistant, who answers my questions in a businesslike manner."
}
```

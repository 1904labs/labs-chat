"use client";
import { Amplify } from "aws-amplify";
import { authConfig } from "@/app/amplify-cognito-config";

export default function AmplifyClientProvider() {
  Amplify.configure(
    {
      Auth: authConfig,
    },
    { ssr: true },
  );

  return null;
}
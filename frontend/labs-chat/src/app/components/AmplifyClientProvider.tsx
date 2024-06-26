"use client";
import { Amplify } from "aws-amplify";
import { authConfig } from "@/app/amplify-cognito-config";

const AmplifyClientProvider = () => {
  Amplify.configure(
    {
      Auth: authConfig,
    },
    { ssr: true },
  );

  return null;
};

export default AmplifyClientProvider;

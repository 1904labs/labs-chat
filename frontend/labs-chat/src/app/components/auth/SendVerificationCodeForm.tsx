"use client";

import {
  ArrowLeftCircleIcon,
  AtSymbolIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import { handleSendEmailVerificationCode } from "@/helpers/cognito-actions";
import { useFormState } from "react-dom";
import FormConfirmButton from "@components/FormConfirmButton";
import { useSearchParams } from "next/navigation";
import TextNavLink from "@components/TextNavLink";
import { FormWrapper, FormInput, FormErrorMessage } from "@components/auth/ui";

export default function SendVerificationCodeForm() {
  const searchParams = useSearchParams();
  const [response, dispatch] = useFormState(handleSendEmailVerificationCode, {
    message: "",
    errorMessage: "",
  });
  return (
    <FormWrapper dispatch={dispatch} title="Send Verification Code">
      <FormInput
        label="Email"
        type="email"
        unique_id="email"
        placeholder="Enter email"
        required
        defaultValue={searchParams.get("email") ?? ""}
        IconComponent={AtSymbolIcon}
      />
      <FormConfirmButton label="Send" />
      <FormErrorMessage message={response?.errorMessage ?? ""} />
      <TextNavLink to="/auth/confirmSignUp">
        <ArrowLeftCircleIcon className="h-6 w-6 text-blue-500" />
        <div>Back to confirm account</div>
      </TextNavLink>
    </FormWrapper>
  );
}

"use client";

import {
  AtSymbolIcon,
  KeyIcon,
  LockClosedIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import { useFormState } from "react-dom";
import { handleConfirmSignUp } from "@/helpers/cognito-actions";
import FormConfirmButton from "@components/FormConfirmButton";
import { useSearchParams } from "next/navigation";
import TextNavLink from "@components/TextNavLink";
import { FormWrapper, FormInput, FormErrorMessage } from "@components/auth/ui";

export default function ConfirmSignUpForm() {
  const searchParams = useSearchParams();
  const [errorMessage, dispatch] = useFormState(handleConfirmSignUp, null);

  return (
    <FormWrapper dispatch={dispatch} title="Confirm Sign Up">
      <FormInput
        label="Email"
        type="email"
        unique_id="email"
        placeholder="Enter email"
        required
        defaultValue={searchParams.get("email") ?? ""}
        IconComponent={AtSymbolIcon}
      />

      <FormInput
        label="Password"
        type="password"
        unique_id="password"
        placeholder="Enter password"
        required
        minLength={6}
        IconComponent={LockClosedIcon}
      />
      <FormInput
        label="Code"
        type="text"
        unique_id="code"
        placeholder="Enter code"
        required
        IconComponent={KeyIcon}
        helperText={"Check your email for the code"}
      />
      <FormConfirmButton label="Confirm" />
      <FormErrorMessage message={errorMessage} />
      <ResendCodeLink />
      <TextNavLink to="/auth/login">
        <ArrowLeftCircleIcon className="h-6 w-6 text-form-primary" />
        <div>Back to log in</div>
      </TextNavLink>
    </FormWrapper>
  );
}

function ResendCodeLink() {
  const searchParams = useSearchParams();
  const getEncodedEmail = () => {
    if (searchParams.get("email") === null) return "";

    return encodeURIComponent(searchParams.get("email") ?? "");
  };
  return (
    <TextNavLink
      to={`/auth/resendVerificationCode?email=${getEncodedEmail()}`}
      border
    >
      Need to resend the code?
    </TextNavLink>
  );
}

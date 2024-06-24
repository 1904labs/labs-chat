"use client";

import {
  AtSymbolIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useFormState } from "react-dom";
import { handleResetPassword } from "@helpers/cognito-actions";
import FormConfirmButton from "../FormConfirmButton";
import TextNavLink from "../TextNavLink";
import { FormWrapper, FormInput, FormErrorMessage } from "@components/auth/ui";

export default function SubmitResetPasswordForm() {
  const [errorMessage, dispatch] = useFormState(handleResetPassword, undefined);
  return (
    <FormWrapper dispatch={dispatch} title="Get a New Verification Code">
      <FormInput
        label="Email"
        unique_id="email"
        type="email"
        IconComponent={AtSymbolIcon}
        placeholder="Enter your email address"
        required
      />
      <FormConfirmButton label="Submit" />
      <FormErrorMessage message={errorMessage} />
      <TextNavLink to={"/auth/login"}>Back to login</TextNavLink>
    </FormWrapper>
  );
}

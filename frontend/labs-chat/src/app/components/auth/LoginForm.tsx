"use client";

import {
  AtSymbolIcon,
  KeyIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { useFormState } from "react-dom";
import { handleSignIn } from "@/helpers/cognito-actions";
import FormConfirmButton from "@components/FormConfirmButton";
import TextNavLink from "@components/TextNavLink";
import { FormWrapper, FormInput, FormErrorMessage } from "@components/auth/ui";

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(handleSignIn, undefined);
  return (
    <FormWrapper dispatch={dispatch} title="Log in to Your Account">
      <FormInput
        label="Email"
        type="email"
        unique_id="email"
        placeholder="Enter your email address"
        required
        IconComponent={AtSymbolIcon}
      />
      <FormInput
        label="Password"
        type="password"
        unique_id="password"
        placeholder="Enter your password"
        minLength={6}
        required
        IconComponent={KeyIcon}
      />
      <FormConfirmButton label="Log in" />
      <div className="h-6" />
      <TextNavLink to="/auth/signUp" border>
        Create an Account
      </TextNavLink>
      <TextNavLink to="/auth/resetPassword/submit" border>
        Forgot Password?
      </TextNavLink>
      <TextNavLink
        to="/auth/confirmSignUp"
        LeadingIcon={QuestionMarkCircleIcon}
      >
        <div>Need to confirm a code?</div>
      </TextNavLink>
      <FormErrorMessage message={errorMessage} />
    </FormWrapper>
  );
}

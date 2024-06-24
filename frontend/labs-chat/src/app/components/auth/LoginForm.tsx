"use client";

import { AtSymbolIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useFormState } from "react-dom";
import { handleSignIn } from "@/helpers/cognito-actions";
import FormConfirmButton from "@components/FormConfirmButton";
import TextNavLink from "@components/TextNavLink";
import { FormWrapper, FormInput, FormErrorMessage } from "@components/auth/ui";

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(handleSignIn, undefined);
  return (
    <FormWrapper dispatch={dispatch} title="Log In">
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
      <div className="flex h-8 items-end space-x-1" />
      <TextNavLink to="/auth/signUp" border>
        {"Don't have an account? "} Sign up.
      </TextNavLink>
      <TextNavLink to="/auth/resetPassword/submit" border>
        Forgot Password?
      </TextNavLink>
      <TextNavLink to="/auth/confirmSignUp" border>
        Need to confirm a code?
      </TextNavLink>
      <FormErrorMessage message={errorMessage} />
    </FormWrapper>
  );
}

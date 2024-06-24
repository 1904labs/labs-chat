"use client";
import React from "react";

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import { useFormState } from "react-dom";
import { handleSignUp } from "@helpers/cognito-actions";
import FormConfirmButton from "@components/FormConfirmButton";
import TextNavLink from "@components/TextNavLink";
import { FormWrapper, FormInput, FormErrorMessage } from "@components/auth/ui";

export default function SignUpForm() {
  const [errorMessage, dispatch] = useFormState(handleSignUp, undefined);

  return (
    <FormWrapper dispatch={dispatch} title="Sign Up">
      <FormInput
        label="Name"
        unique_id="name"
        type="text"
        IconComponent={UserCircleIcon}
        minLength={4}
        placeholder="Enter your name"
        required
      />
      <FormInput
        label="Email"
        unique_id="email"
        type="email"
        IconComponent={AtSymbolIcon}
        placeholder="Enter your email address"
        required
      />
      <FormInput
        label="Password"
        unique_id="password"
        type="password"
        IconComponent={KeyIcon}
        placeholder="Enter password"
        required
        minLength={6}
      />
      <FormConfirmButton label="Create account" />
      <div className="flex justify-center">
        <TextNavLink to="/auth/login">
          <ArrowLeftCircleIcon className="h-6 w-6 text-form-primary" />
          <div>Back to log in</div>
        </TextNavLink>
      </div>
      <FormErrorMessage message={errorMessage} />
    </FormWrapper>
  );
}

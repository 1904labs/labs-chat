"use client";
import { AtSymbolIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useFormState } from "react-dom";
import { handleConfirmResetPassword } from "@helpers/cognito-actions";
import FormConfirmButton from "@components/FormConfirmButton";
import { FormWrapper, FormInput, FormErrorMessage } from "@components/auth/ui";

export default function ConfirmResetPasswordForm() {
  const [errorMessage, dispatch] = useFormState(
    handleConfirmResetPassword,
    undefined,
  );
  return (
    <FormWrapper dispatch={dispatch} title="Reset Password">
      <FormInput
        label="Email"
        type="email"
        unique_id="email"
        placeholder="Enter email"
        required
        IconComponent={AtSymbolIcon}
      />
      <FormInput
        label="New Password"
        type="password"
        unique_id="password"
        placeholder="Enter password"
        required
        IconComponent={KeyIcon}
      />
      <FormInput
        label="Confirm New Password"
        type="password"
        unique_id="password_confirm"
        placeholder="Enter password"
        required
        IconComponent={KeyIcon}
      />
      <FormInput
        label="Code"
        type="text"
        unique_id="code"
        placeholder="Enter code"
        required
      />
      <p className="text-xs text-slate-500">
        {"Enter the code you received in your email"}
      </p>
      <FormConfirmButton label="Reset Password" />
      <FormErrorMessage message={errorMessage} />
    </FormWrapper>
  );
}

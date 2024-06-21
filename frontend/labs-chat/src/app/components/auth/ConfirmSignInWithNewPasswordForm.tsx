"use client";
import { KeyIcon } from "@heroicons/react/24/outline";
import { useFormState } from "react-dom";
import { handleSignInWithNewPassword } from "@helpers/cognito-actions";
import FormConfirmButton from "@components/FormConfirmButton";
import { FormWrapper, FormInput, FormErrorMessage } from "@components/auth/ui";

export default function ConfirmSignInWithNewPasswordForm() {
  const [errorMessage, dispatch] = useFormState(
    handleSignInWithNewPassword,
    undefined,
  );
  return (
    <FormWrapper dispatch={dispatch} title="Set New Password">
      <FormInput
        label="New password"
        type="password"
        unique_id="new_password"
        placeholder="Enter new password"
        required
        IconComponent={KeyIcon}
      />
      <FormInput
        label="Confirm new password"
        type="password"
        unique_id="new_password_confirm"
        placeholder="Enter new password"
        required
        IconComponent={KeyIcon}
      />
      <FormConfirmButton label="Set New Password" />
      <FormErrorMessage message={errorMessage} />
    </FormWrapper>
  );
}

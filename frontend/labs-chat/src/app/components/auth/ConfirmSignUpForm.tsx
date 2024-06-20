"use client";

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  LockClosedIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import { useFormState } from "react-dom";
import { handleConfirmSignUp } from "@/helpers/cognito-actions";
import FormConfirmButton from "@components/FormConfirmButton";
import { useSearchParams } from "next/navigation";
import TextNavLink from "@components/TextNavLink";
import FormErrorMessage from "@components/auth/ui/FormErrorMessage";
import FormWrapper from "@components/auth/ui/FormWrapper";

export default function ConfirmSignUpForm() {
  const searchParams = useSearchParams();
  const [errorMessage, dispatch] = useFormState(handleConfirmSignUp, null);

  return (
    <FormWrapper dispatch={dispatch} title="Confirm Sign Up">
      <p className="text-xs text-slate-500">{"Check your email for the code"}</p>
      <div>
        <label
          className="mb-3 mt-5 block text-xs font-medium text-gray-900"
          htmlFor="email"
        >
          Email
        </label>
        <div className="relative">
          <input
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            id="email"
            type="email"
            name="email"
            defaultValue={searchParams.get("email") ?? ""}
            placeholder="Enter your email address"
            required
          />
          <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>
      <div>
        <label
          className="mb-3 mt-5 block text-xs font-medium text-gray-900"
          htmlFor="password"
        >
          Password
        </label>
        <div className="relative">
          <input
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            required
          />
          <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>
      <div className="mt-4">
        <label
          className="mb-3 mt-5 block text-xs font-medium text-gray-900"
          htmlFor="code"
        >
          Code
        </label>
        <div className="relative">
          <input
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            id="code"
            type="text"
            name="code"
            placeholder="Enter code"
            required
            minLength={6}
          />
          <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      </div>
      <FormConfirmButton label="Confirm" />
      <FormErrorMessage message={errorMessage} />
      <ResendCodeLink />
      <TextNavLink to="/auth/login">
        <ArrowLeftCircleIcon className="h-6 w-6 text-blue-500" />
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

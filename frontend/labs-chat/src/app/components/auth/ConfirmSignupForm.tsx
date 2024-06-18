"use client";

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useFormState } from "react-dom";
import { handleConfirmSignUp } from "@/helpers/cognito-actions";
import FormConfirmButton from "@components/FormConfirmButton";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ConfirmSignUpForm() {
  const searchParams = useSearchParams();
  const [errorMessage, dispatch] = useFormState(handleConfirmSignUp, null);

  return (
    <form action={dispatch} className="w-full max-w-80 space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-8 pt-8">
        <h1 className={`mb-3 text-2xl`}>Please confirm your account.</h1>
        <div className="w-full">
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
        </div>
        <FormConfirmButton label="Confirm" />
        <div className="flex h-16 items-end space-x-1">
          <div className="flex items-end" aria-live="polite" aria-atomic="true">
            {errorMessage && (
              <div className="flex space-x-3">
                <ExclamationCircleIcon className="h-14 w-14 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>

        <ResendCodeLink />
      </div>
    </form>
  );
}

function ResendCodeLink() {
  const searchParams = useSearchParams();
  const getEncodedEmail = () => {
    if (searchParams.get("email") === null) return "";

    return encodeURIComponent(searchParams.get("email") ?? "");
  };
  return (
    <div className="flex justify-center">
      <Link
        href={`/auth/resendVerificationCode?email=${getEncodedEmail()}`}
        className="mt-2 cursor-pointer text-blue-500"
      >
        Need to resend the code? Click here.
      </Link>
    </div>
  );
}

"use client";

import {
  AtSymbolIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useFormState, useFormStatus } from "react-dom";
import { handleResetPassword } from "@helpers/cognito-actions";

export default function SubmitResetPasswordFrom() {
  const [errorMessage, dispatch] = useFormState(handleResetPassword, undefined);
  return (
    <form action={dispatch} className="space-y-3 max-w-lg">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`mb-3 text-2xl`}>
          Please enter your email to get confirmation code.
        </h1>
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
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <SendConfirmationCodeButton />
        </div>
        <div className="flex h-8 items-end space-x-1">
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

function SendConfirmationCodeButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="mt-4 w-full max-w-80 flex rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
      disabled={pending}
    >
      <div className="flex-1">Send Code</div> <ArrowRightIcon className="ml-auto h-6 w-6 text-gray-50" />
    </button>
  );
}

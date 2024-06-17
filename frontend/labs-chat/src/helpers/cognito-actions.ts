import { redirect } from "next/navigation";
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  resendSignUpCode,
  autoSignIn,
  updateUserAttribute,
  type UpdateUserAttributeOutput,
  confirmUserAttribute,
  resetPassword,
  confirmResetPassword,
  confirmSignIn,
} from "aws-amplify/auth";
import { getErrorMessage } from "@/helpers/get-error-mesage";

export async function handleSignUp(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: String(formData.get("email")),
      password: String(formData.get("password")),
      options: {
        userAttributes: {
          email: String(formData.get("email")),
          name: String(formData.get("name")),
        },
        // optional
        autoSignIn: true,
      },
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect("/auth/confirm-signup");
}

export async function handleSendEmailVerificationCode(
  prevState: { message: string; errorMessage: string },
  formData: FormData,
) {
  let currentState;
  try {
    await resendSignUpCode({
      username: String(formData.get("email")),
    });
    currentState = {
      ...prevState,
      message: "Code sent successfully",
    };
  } catch (error) {
    currentState = {
      ...prevState,
      errorMessage: getErrorMessage(error),
    };
  }

  return currentState;
}

export async function handleConfirmSignUp(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: String(formData.get("email")),
      confirmationCode: String(formData.get("code")),
    });
    await autoSignIn();
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect("/auth/login");
}

export async function handleSignIn(
  prevState: string | undefined,
  formData: FormData,
) {
  let redirectLink = "/";
  try {
    const userEmail = String(formData.get("email"));
    const data = await signIn({
      username: userEmail,
      password: String(formData.get("password")),
    });
    const { nextStep } = data;
    console.log(`nextStep: ${JSON.stringify(data, null, 2)}`);
    if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
      redirectLink = "/auth/confirmSignIn";
    }
    if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
      await resendSignUpCode({
        username: userEmail,
      });
      redirectLink = "/auth/confirmSignUp";
    }
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect(redirectLink);
}

export async function handleSignOut() {
  try {
    await signOut();
  } catch (error) {
    console.log(getErrorMessage(error));
  }
  redirect("/auth/login");
}

export async function handleUpdateUserAttribute(
  prevState: string,
  formData: FormData,
) {
  let attributeKey = "name";
  let attributeValue;
  let currentAttributeValue;

  if (formData.get("email")) {
    attributeKey = "email";
    attributeValue = formData.get("email");
    currentAttributeValue = formData.get("current_email");
  } else {
    attributeValue = formData.get("name");
    currentAttributeValue = formData.get("current_name");
  }

  if (attributeValue === currentAttributeValue) {
    return "";
  }

  try {
    const output = await updateUserAttribute({
      userAttribute: {
        attributeKey: String(attributeKey),
        value: String(attributeValue),
      },
    });
    return handleUpdateUserAttributeNextSteps(output);
  } catch (error) {
    console.log(error);
    return "error";
  }
}

function handleUpdateUserAttributeNextSteps(output: UpdateUserAttributeOutput) {
  const { nextStep } = output;

  switch (nextStep.updateAttributeStep) {
    case "CONFIRM_ATTRIBUTE_WITH_CODE":
      const codeDeliveryDetails = nextStep.codeDeliveryDetails;
      return `Confirmation code was sent to ${codeDeliveryDetails?.deliveryMedium}.`;
    case "DONE":
      return "success";
  }
}

export async function handleSignInWithNewPassword(
  prevState: "success" | "error" | undefined,
  formData: FormData,
) {
  const newPassword = String(formData.get("new_password"));
  const newPasswordConfirm = String(formData.get("new_password_confirm"));

  if (newPasswordConfirm !== newPassword) {
    return "Passwords do not match.";
  }

  try {
    const { isSignedIn, nextStep } = await confirmSignIn({
      challengeResponse: newPassword,
      options: {},
    });
  } catch (error) {
    console.log(error);
    return getErrorMessage(error);
  }

  redirect("/");
}

export async function handleConfirmUserAttribute(
  prevState: "success" | "error" | undefined,
  formData: FormData,
) {
  const code = formData.get("code");

  if (!code) {
    return;
  }

  try {
    await confirmUserAttribute({
      userAttributeKey: "email",
      confirmationCode: String(code),
    });
  } catch (error) {
    console.log(error);
    return "error";
  }

  return "success";
}

export async function handleResetPassword(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    if (!formData.get("email")) {
      throw new Error("No email provided");
    }
    const username = String(formData.get("email"));
    await resetPassword({ username });
    console.log(`Reset password email sent to ${username}`);
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect("/auth/resetPassword/confirm");
}

export async function handleConfirmResetPassword(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await confirmResetPassword({
      username: String(formData.get("email")),
      confirmationCode: String(formData.get("code")),
      newPassword: String(formData.get("password")),
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect("/auth/login");
}

import { Authenticator, AuthenticatorProps } from "@aws-amplify/ui-react";
import { AuthUser } from "aws-amplify/auth";

function getUserInitials(name: string) {
  // This method will return the initials of the user
  // or the first two letters of the name if the user has only one name
  if (!name) {
    return "";
  }
  const [firstName, lastName] = name.split(" ");
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2);
}

const UserMessage = ({ speaker = "user", message = "", date = "" }) => {
  return (
    <Authenticator>
      {({ signOut, user }) => {
        return (
          <div className={`items flex flex-col items-end justify-end`}>
            <div
              className={`flex w-8/12 rounded-lg bg-white p-4 shadow-lg drop-shadow-md xl:w-1/3 2xl:w-5/12`}
            >
              <div className="w-1/12">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full bg-1904labs-blue-500 p-1 font-light text-white`}
                >
                  {getUserInitials(user?.signInDetails?.loginId || "Chat User")}
                </div>
              </div>
              <div className="ml-5">
                <p className="text-lg font-bold">
                  {user?.signInDetails?.loginId || "Chat User"}
                </p>
                <p className="text-sm">{message}</p>
              </div>
            </div>
            <p className="pt-2 text-sm text-1904labs-grey-300">{date}</p>
          </div>
        );
      }}
    </Authenticator>
  );
};

export default UserMessage;

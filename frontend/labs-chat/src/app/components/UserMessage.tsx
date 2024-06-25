import React from "react";
import { User } from "../types";

interface UserMessageProps {
  message: string;
  date: string;
  user: User | null;
}

const UserMessage = ({
  message = "",
  date = "",
  user = null,
}: UserMessageProps) => {
  function getName(user: User | null): string {
    // This method will return the name of the user if it exists in the userAttributes
    if (!user || !user.userAttributes) {
      return "Chat User";
    }
    return (
      user.userAttributes["name"] || user.userAttributes["email"] || "Chat User"
    );
  }

  function getUserInitials(name): string {
    // This method will return the initials of the user
    // or the first two letters of the name if the user has only one name
    //  (e.g. "John Smith" -> "JS"), (e.g. "John" -> "Jo"), (e.g. "JSmith@1904labs" -> "JS")

    // if the user has no name, return an empty string
    if (!name) {
      return "";
    }

    const [firstName, lastName] = name.split(" ");
    return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2);
  }

  const username = getName(user);
  return (
    <div className={`items flex flex-col items-end justify-end`}>
      <div
        className={`flex w-8/12 rounded-lg bg-white p-4 shadow-lg drop-shadow-md xl:w-1/3 2xl:w-5/12`}
      >
        <div className="w-1/12">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full bg-1904labs-blue-500 p-1 font-light text-white`}
          >
            {getUserInitials(username)}
          </div>
        </div>
        <div className="ml-5">
          <p className="text-lg font-bold">{username}</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
      <p className="pt-2 text-sm text-1904labs-grey-300">{date}</p>
    </div>
  );
};

export default UserMessage;

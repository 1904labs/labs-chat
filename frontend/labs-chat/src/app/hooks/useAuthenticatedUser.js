import { useCallback, useEffect, useState } from "react";

const useAuthenticatedUser = () => {
  const [userAttributes, setUserAttributes] = useState({});

  useEffect(() => {
    fetchUserAttributes().then((userAttributes) => {
      setUserAttributes(userAttributes);
    });
  }, []);

  const fetchUserAttributes = useCallback(async () => {
    try {
      const response = await fetch("/api/userAttributes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }, [userAttributes]);

  return { userAttributes };
};

export default useAuthenticatedUser;

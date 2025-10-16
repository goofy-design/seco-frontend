import { useEffect, useState } from "react";

const useUser = () => {
  const [user, setUser] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser);
    setIsLoggedIn(!!storedUser);
  }, []);

  const updateUser = (newUser: string | null) => {
    if (newUser) {
      localStorage.setItem("user", newUser);
    } else {
      localStorage.removeItem("user");
    }
    setUser(newUser);
    setIsLoggedIn(!!newUser);
  };

  return { user, isLoggedIn, updateUser };
};

export default useUser;

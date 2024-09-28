import React from "react";
import { useAppSelector } from "../../hooks/hook";

const Homepage = () => {
  const { user } = useAppSelector((state) => state.user);
console.log(user);

  return <div>This is home page</div>;
};

export default Homepage;

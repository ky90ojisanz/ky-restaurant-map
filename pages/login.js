import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import LogInButton from "../app/components/LogInButton";

const LoginPage = () => {
  return (
    <div>
      <LogInButton />
      {/* <button onClick={handleClick}>Discordでログイン</button> */}
    </div>
  );
};

export default LoginPage;

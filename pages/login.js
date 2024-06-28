import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import LogInButton from "../app/components/LogInButton";

const LoginPage = () => {
  const handleClick = async () => {
    // Move the useSession hook call to a React function component or a custom React Hook function.
    // const { data: session } = useSession();
    const res = await fetch(`https://discordapp.com/api/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
    console.log("res", res);
  };

  return (
    <div>
      <LogInButton />
      {/* <button onClick={handleClick}>Discordでログイン</button> */}
    </div>
  );
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // ログインロジックをここに実装
  //   handleLogin;
  // };

  // const handleLogin = async () => {
  //   // ログイン処理
  //   // ログイン成功後、にリダイレクト
  //   router.push("/app/page.js");
  // };

  // return (
  //   <form onSubmit={handleSubmit}>
  //     <div>
  //       <label htmlFor="username">ユーザー名:</label>
  //       <input
  //         type="text"
  //         id="username"
  //         value={username}
  //         onChange={(e) => setUsername(e.target.value)}
  //       />
  //     </div>
  //     <div>
  //       <label htmlFor="password">パスワード:</label>
  //       <input
  //         type="password"
  //         id="password"
  //         value={password}
  //         onChange={(e) => setPassword(e.target.value)}
  //       />
  //     </div>
  //     <button type="submit">ログイン</button>
  //   </form>
  // );
};

export default LoginPage;

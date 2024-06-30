import { useSession, signIn, signOut } from "next-auth/react";

export default function LogInButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut({ callbackUrl: "/login" })}>
          ログアウト
        </button>
      </div>
    );
  }
  return (
    <div>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}

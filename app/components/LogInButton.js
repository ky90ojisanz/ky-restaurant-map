import { useSession, signIn, signOut } from "next-auth/react";
import styles from "./LoginButton.module.css";

export default function LogInButton() {
  const { data: session } = useSession();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>ＫＹのレストランマップ</h1>
      </div>
      <div className={styles.mainContent}>
        {session ? (
          <div className={styles.mainContent}>
            <span className={styles.blinkingText}>ようこそ</span>、
            {session.user.name} さん！
            <br />
            <button
              className={styles.button}
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              ログアウト
            </button>
          </div>
        ) : (
          <div>
            <p>
              <span className={styles.blinkingText}>
                ゲストさん、こんにちは。
              </span>
              ログインしてください。
            </p>
            <button className={styles.button} onClick={() => signIn()}>
              ログイン
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

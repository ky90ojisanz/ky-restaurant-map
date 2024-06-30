import { useRouter } from "next/router";

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div>
      <h1>認証エラー</h1>
      <p>エラーが発生しました: {error}</p>
      <button onClick={() => router.push("/login")}>
        ログインページに戻る
      </button>
    </div>
  );
}

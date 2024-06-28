"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const requireAuth = (WrappedComponent) => {
  const ComponentWithAuth = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return; // セッションの読み込み中は何もしない

      if (!session && status !== "loading") {
        router.push("/login"); // ログインしていない場合、ログインページにリダイレクト
      }
    }, [session, status, router]);

    if (!session) return null; // ログインしていない場合、何も表示しない

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default requireAuth;

// next.config.js
export default {
  env: {
    HOTPEPPER_API_KEY: process.env.HOTPEPPER_API_KEY, // サーバーサイドでのみ使用
  },
  publicRuntimeConfig: {
    // クライアントサイドで使用する環境変数
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
};

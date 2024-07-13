This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 環境構築手順

- BitWardenのパスワード保管庫にアクセスし、下記からログインする
  - [BitWarden Login](https://vault.bitwarden.com/#/login)
    - ログインユーザ・パスワード: Discordの開発チャンネルにピン止めしているものを参照すること
  - ここにGitHub、Googleのログイン情報を保存している。以後のサービスログイン情報はここのものを利用する
- Googleドライブに存在する「.env.local」ファイルをダウンロードする
  - ファイル名が変更されている場合は手動で更新する
- Gitをインストールする
  - [Gitダウンロード](https://git-scm.com/downloads) から最新版をダウンロードする
  - バージョンは2.45.2で確認済み
- GitHubにサインインし、ソースをCloneする
  - https://github.com/ky90ojisanz/ky-restaurant-map にアクセスする
  - 緑色の「<> Code」ボタンを押下し、「HTTPS」タブのURLをコピーする
    - https://github.com/ky90ojisanz/ky-restaurant-map.git
  - Gitを起動し、インストールしたい任意のフォルダにクローンする
    - コマンドは「git clone https://github.com/ky90ojisanz/ky-restaurant-map.git」
- ダウンロードした「.env.local」ファイルを上記のフォルダのrootに保存する
- Node.jsをインストールする（インストールされていない場合）
  - Node.jsがインストールされているかどうかはコマンドプロンプトで「node -v」と入力し、バージョン情報表示されているかで判断する
    - インストールされていない場合は「'node' は、内部コマンドまたは外部コマンド、操作可能なプログラムまたはバッチ ファイルとして認識されていません。」と表示される
  - バージョンはv20.15.0で確認済み
  - ダウンロードしたインストーラを起動し、「Tools for Native Modules」だけチェックを入れてインストールする（入れなくてもいいかもしれないが未検証）
    - chocolateyが不要ならいったんはいらないかも
  - コマンドプロンプトでNode.jsをインストールしたフォルダの場所で「node -v」「npm -v」と入力し、どちらもバージョン情報が表示されることを確認する
- インストールしたフォルダでコマンド「npm i」コマンドを起動し、エラーが出ずに終了することを確認する

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


# Cocoro.Agent

## 概要 (Overview)
Cocoro.Agentは、AIを活用して育児をサポートする最新のペアレンタルアシスタントアプリです。赤ちゃんの状態をリアルタイムで分析し、保護者に寄り添った具体的なアドバイスやヒントを提供します。

## 主な機能 (Features)
- **AIによる状態分析**: デバイスのカメラで撮影した赤ちゃんの写真から、気分や活動状況をAIが分析します。
- **パーソナライズされた提案**: 分析結果に基づき、赤ちゃんのニーズに合わせた具体的なアドバイスや、あやすためのヒント（関連Webサイトや動画付き）を提供します。
- **分析履歴の保存**: 過去の分析結果と写真を自動で保存し、いつでも振り返ることができます。
- **コミュニティ機能**: 他の保護者と経験や知識を共有できるフォーラム機能。
- **インサイト生成**: 親の育児方針に合わせて、パーソナライズされた育児のヒントを生成します。

## 必要なもの (Prerequisites)
- [Node.js](https://nodejs.org/) (v18以降推奨)
- [Firebase](https://firebase.google.com/) アカウント
- [Google AI Studio](https://aistudio.google.com/app/apikey) で取得したGemini APIキー

## ローカル環境でのセットアップと起動方法 (Setup and Local Development)

### 1. 環境変数の設定
プロジェクトのルートディレクトリにある`.env.example`ファイルをコピーして、`.env`という名前のファイルを作成します。そして、ファイル内の各項目をご自身のキー情報に書き換えてください。

```bash
# .env.example をコピーして .env ファイルを作成
cp .env.example .env
```

`.env`ファイルの中身：
```bash
# Gemini API Key
# Google AI Studio (https://aistudio.google.com/app/apikey) から取得してください
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Firebase Configuration
# Firebaseコンソールのプロジェクト設定から取得してください
# (Project settings > General > Your apps > Web app > Firebase SDK snippet > Config)
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_PROJECT_ID.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_PROJECT_ID.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
```

### 2. 依存パッケージのインストール
ターミナルで以下のコマンドを実行し、必要なライブラリをインストールします。
```bash
npm install
```

### 3. Firebaseの初期設定
Cocoro.Agentは、画像の保存にFirebase Storageを、分析履歴の保存にFirestoreを使用します。正しく動作させるために、Firebase側で2つの初期設定が必要です。

#### a. セキュリティルールの設定
1.  [Firebaseコンソール](https://console.firebase.google.com/)を開きます。
2.  **Firestore Database**:
    -   サイドメニューから「ビルド」>「Firestore Database」を選択します。
    -   「ルール」タブを開き、以下のルールに書き換えて「公開」をクリックします。
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if true; // 開発用の設定です。本番環境では認証ルールを強化してください。
        }
      }
    }
    ```
3.  **Storage**:
    -   サイドメニューから「ビルド」>「Storage」を選択します。
    -   「ルール」タブを開き、以下のルールに書き換えて「公開」をクリックします。
    ```
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        match /{allPaths=**} {
          allow read, write: if true; // 開発用の設定です。本番環境では認証ルールを強化してください。
        }
      }
    }
    ```
    **警告**: 上記のルールは開発用です。誰でもデータの読み書きができてしまうため、本番でアプリを公開する際は、必ず[Firebaseセキュリティルール](https://firebase.google.com/docs/rules)のドキュメントを参考に、認証されたユーザーのみがアクセスできるように設定を強化してください。

#### b. StorageのCORS設定
カメラで撮影した画像をブラウザからFirebase Storageに直接アップロードするためには、CORS（Cross-Origin Resource Sharing）の設定が必要です。
この設定は、ご自身のPCのターミナルから**一度だけ**行う必要があります。

1.  **Google Cloud CLIをインストール**します。（[インストールガイド](https://cloud.google.com/sdk/docs/install?hl=ja)）
2.  PCの分かりやすい場所（例：デスクトップ）に`cors.json`というファイル名で以下の内容を保存します。
    ```json
    [
      {
        "origin": ["*"],
        "method": ["GET", "POST", "PUT", "HEAD"],
        "responseHeader": [
          "Content-Type",
          "Access-Control-Allow-Origin"
        ],
        "maxAgeSeconds": 3600
      }
    ]
    ```
3.  ターミナルを開き、以下のコマンドを順番に実行します。`YOUR_PROJECT_ID`の部分は、ご自身のFirebaseプロジェクトIDに置き換えてください。
    ```bash
    # Googleアカウントでログイン
    gcloud auth login

    # 操作するプロジェクトを設定
    gcloud config set project YOUR_PROJECT_ID

    # cors.jsonを保存したディレクトリに移動 (例: デスクトップ)
    cd Desktop

    # CORS設定を適用
    gsutil cors set cors.json gs://YOUR_PROJECT_ID.appspot.com
    ```

### 4. アプリケーションの起動
ターミナルで以下のコマンドを実行します。
```bash
npm run dev
```

起動したら、ブラウザで http://localhost:9002 にアクセスしてください。Cocoro.Agentが表示されます。

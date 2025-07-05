
# 📊 Sentiment Highlighter Extension

**Sentiment Highlighter** is a Chrome extension that uses a backend AI model to highlight website comments based on their sentiment — positive, neutral, or negative. It visually annotates comments with background colors and provides an overall sentiment summary and star rating.

> ✅ Built with ONNX Runtime, Express.js, and Chrome Manifest V3.

---

## 🧠 Features

- ✨ Highlights comments in real-time on **YouTube**, **Facebook**, and **WhatsApp Web**
- 💬 Uses a powerful ONNX machine learning model for sentiment analysis
- 📦 Batch API support — all comments are processed in a single request
- 🔐 Session-based rate limiting (10 analysis batches per user/session)
- 🌟 Calculates and displays an intuitive **star rating**
- 🚀 Fast and lightweight Chrome extension powered by a Node.js backend

---

## 📸 Screenshots

<details>
<summary>Click to expand</summary>

<!-- Replace these with real image URLs -->
![Popup](https://github.com/MoodyElashry/Comment_Reviewer/blob/main/Screenshot%202025-07-05%20180923.png?raw=true)


</details>

---

## 🛠 How It Works

1. Click the extension icon to open the popup.
2. Click **"Highlight Comments"**.
3. The extension:
   - Scans visible comments.
   - Sends them to the backend in a single batch.
   - Highlights them by sentiment.
   - Updates the popup with a summary and star rating.

---

## 🧩 Supported Platforms

- **YouTube**
- **Facebook**
- **WhatsApp Web**
- And any site with `<p>`, `<div>`, or `<span>` content

---

## ⚙️ Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/MoodyElashry/Comment_Reviewer.git
   cd Comment_Reviewer
   ```

2. Install and start the backend server:

   ```bash
   cd backend
   npm install
   node main.js
   ```

3. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension` folder

4. Visit any supported site and click the extension icon!

---

## 🛡️ Rate Limiting

To prevent abuse, each session is limited to **10 sentiment analysis batches**. Each batch can include any number of comments. The session is tracked via signed cookies.

---

## 📦 Tech Stack

- **Frontend**: Chrome Extension (Manifest V3, JS, HTML, CSS)
- **Backend**: Node.js + Express
- **Model Runtime**: [onnxruntime-node](https://www.npmjs.com/package/onnxruntime-node)
- **ML Model**: Pretrained sentiment classifier exported to ONNX
- **Security**: Signed, HTTP-only session cookies

---

## 🔒 Privacy

- No tracking, no analytics, no third-party data sharing.
- All data is processed locally and temporarily on your own machine.
- Comments are only sent to your locally running model server.

---

## 🚧 Future Ideas

- 🌍 Support more languages
- 📈 Graph-based sentiment dashboard
- ⏱ Automatic page re-scan
- 🧠 Smarter rate limits with optional login

---

## 👨‍💻 Author

Made with ❤️ by [@MoodyElashry](https://github.com/MoodyElashry) And [@Abdallah-Mamoon](https://github.com/Abdallah-Mamoon)

---

## 📃 License

This project is licensed under the MIT License.

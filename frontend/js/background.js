chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "analyze_comments") {
    (async () => {
      try {
        const response = await fetch("http://localhost:3000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comments: message.comments })
        });

        const data = await response.json();
        sendResponse({ success: true, data });
      } catch (err) {
        console.error("❌ Background fetch failed:", err);
        sendResponse({ success: false, error: err.message });
      }
    })();

    // 👇 This is critical: it tells Chrome to wait for sendResponse
    return true;
  }
});

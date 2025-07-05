document.getElementById("runHighlight").addEventListener("click", async () => {
  console.log("📌 Button clicked - running highlightSentiments");

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      let site = window.location.hostname;
      let selectors = {
        "www.youtube.com": "ytd-comment-thread-renderer #content-text",
        "www.facebook.com": "div[data-ad-preview='message']",
        "web.whatsapp.com": "span.selectable-text.copyable-text"
      };
      let selector = selectors[site] || "p, div, span";

      let elems = Array.from(document.querySelectorAll(selector));
      elems = elems.filter(el => el.innerText && el.innerText.trim().length > 15);

      const comments = elems.map(el => el.innerText.trim());
      return { comments };
    }
  }, async (results) => {
    if (chrome.runtime.lastError) {
      console.error("❌ Script injection error:", chrome.runtime.lastError.message);
      return;
    }

    const { comments } = results[0].result;
    if (!comments || comments.length === 0) {
      alert("No comments found.");
      return;
    }

    chrome.runtime.sendMessage(
      { type: "analyze_comments", comments },
      (response) => {
        if (!response || !response.success) {
          alert("❌ Error: " + (response?.error || "Unknown error"));
          return;
        }

        const data = response.data;

        if (data.error) {
          alert("⚠️ " + data.error);
          return;
        }

        const predictions = data.predictions;
        const stats = { positive: 0, neutral: 0, negative: 0, total: 0 };

        // Apply highlights
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (predictions) => {
            let site = window.location.hostname;
            let selectors = {
              "www.youtube.com": "ytd-comment-thread-renderer #content-text",
              "www.facebook.com": "div[data-ad-preview='message']",
              "web.whatsapp.com": "span.selectable-text.copyable-text"
            };
            let selector = selectors[site] || "p, div, span";

            let elems = Array.from(document.querySelectorAll(selector));
            elems = elems.filter(el => el.innerText && el.innerText.trim().length > 15);

            predictions.forEach((pred, i) => {
              const el = elems[i];
              if (!el) return;

              if (pred.sentiment === "positive") {
               el.style.backgroundColor = "#2e7d32";  // dark green
                  el.style.color = "#ffffff";           // white text
}                     else if (pred.sentiment === "neutral") {
  el.style.backgroundColor = "#616161"; // gray
  el.style.color = "#ffffff";
} else if (pred.sentiment === "negative") {
  el.style.backgroundColor = "#c62828"; // dark red
  el.style.color = "#ffffff";
}
            });
          },
          args: [predictions]
        });

        predictions.forEach(pred => {
          stats.total++;
          if (pred.sentiment === "positive") stats.positive++;
          else if (pred.sentiment === "neutral") stats.neutral++;
          else if (pred.sentiment === "negative") stats.negative++;
        });

        updateUI(stats);
      }
    );
  });
});

function updateUI(stats) {
  const { positive, neutral, negative, total } = stats;
  const pct = (val) => total ? ((val / total) * 100).toFixed(1) + "%" : "0%";

  document.getElementById("positive").innerText = pct(positive);
  document.getElementById("neutral").innerText = pct(neutral);
  document.getElementById("negative").innerText = pct(negative);

  // ⭐️ Star rating logic
  let starCount = 1;
  const posRatio = total ? (positive / total) : 0;

  if (posRatio >= 0.8) starCount = 5;
  else if (posRatio >= 0.6) starCount = 4;
  else if (posRatio >= 0.4) starCount = 3;
  else if (posRatio >= 0.2) starCount = 2;

  const stars = "⭐️".repeat(starCount) + "☆".repeat(5 - starCount);
  document.getElementById("stars").innerText = stars;
}

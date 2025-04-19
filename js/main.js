// Theme toggle logic
const toggleButton = document.getElementById("theme-toggle");

if (toggleButton) {
  if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "dark");
  }
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    toggleButton.textContent = "Toggle Light Mode";
  } else {
    toggleButton.textContent = "Toggle Dark Mode";
  }

  toggleButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    toggleButton.textContent = isDark ? "Toggle Light Mode" : "Toggle Dark Mode";
  });
} else {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
}

// Expandable cards
const expandableCards = document.querySelectorAll(".expandable-card");

expandableCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("expanded");
  });
});

// DOMContentLoaded to handle chat toggle
window.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("chat-toggle");
  const chatBox = document.getElementById("chat-box");
  const wasChatOpen = localStorage.getItem("chatOpen") === "true";
  if (wasChatOpen) {
    chatBox.classList.remove("hidden");
  }

  if (toggleBtn && chatBox) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = chatBox.classList.contains("hidden");
      if (isHidden) {
        chatBox.classList.remove("hidden");
        localStorage.setItem("chatOpen", "true");
      } else {
        chatBox.classList.add("hidden");
        localStorage.setItem("chatOpen", "false");
      }
    });
  }

  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

  chatHistory.forEach((msg) => {
    const messageBubble = document.createElement("div");
    messageBubble.textContent = (msg.role === "user" ? "You" : "AI") + msg.content;
    chatMessages.appendChild(messageBubble);
  });

  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const today = new Date().toISOString().slice(0, 10); // e.g. "2025-04-14"
      let usage = JSON.parse(localStorage.getItem("dailyGPTUsage")) || {
        count: 0,
        date: today
      };

      // Reset count if it's a new day
      if (usage.date !== today) {
        usage = { count: 0, date: today };
      }

      if (usage.count >= 30) {
        alert("You've hit the daily limit of 30 messages. Try again tomorrow!");
        return;
      }

      // Allow request → increment count
      usage.count++;
      localStorage.setItem("dailyGPTUsage", JSON.stringify(usage));
      console.log("Form submitted!");

      const userMessage = chatInput.value.trim();
      if (!userMessage) return;

      const userBubble = document.createElement("div");
      userBubble.textContent = "You: " + userMessage;
      chatMessages.appendChild(userBubble);

      let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
      chatHistory.push({ role: "user", content: userMessage });
      if (chatHistory.length > 5) chatHistory = chatHistory.slice(-5);
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

      chatInput.value = "";

      try {
        document.getElementById("typing-indicator").style.display = "block";
        
        const res = await fetch("/api/chatgpt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message: userMessage })
        });

        const data = await res.json();

        const botBubble = document.createElement("div");
        botBubble.textContent = "AI: " + data.reply;
        chatMessages.appendChild(botBubble);
        document.getElementById("typing-indicator").style.display = "none";

        chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
        chatHistory.push({ role: "assistant", content: data.reply });
        if (chatHistory.length > 5) chatHistory = chatHistory.slice(-5);
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

        chatMessages.scrollTop = chatMessages.scrollHeight;
      } catch (err) {
        console.error("GPT request failed:", err);
        const errorBubble = document.createElement("div");
        errorBubble.textContent = "⚠️ Error talking to GPT.";
        chatMessages.appendChild(errorBubble);
      }
    });
  }
  // Toggle contact details when contact card is clicked
  const contactCard = document.querySelector(".contact-card");
  const contactDetails = document.querySelector(".contact-details");

  if (contactCard && contactDetails) {
    contactCard.addEventListener("click", () => {
      contactDetails.classList.toggle("hidden");
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.shiftKey && e.key.toLowerCase() === "e") {
      const egg = document.getElementById("easter-egg");
      if (egg) {
        egg.classList.toggle("hidden");
      }
    }
  });
});

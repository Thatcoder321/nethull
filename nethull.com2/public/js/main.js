document.addEventListener("DOMContentLoaded", () => {
    const viewButtons = document.querySelectorAll(".view-project-btn");
    const modal = document.getElementById("project-modal");
    const modalContent = document.getElementById("expanded-content");
    const closeButton = document.querySelector(".close-button");
  
    // Example content per project
    const projectData = {
      chatbot: {
        title: "Chatbot in Python",
        description: "A GPT-powered chatbot with theme switching and memory.",
        details: "This was a chatbot built fully in python and pygame with many AI models to choose from, I used the OpenAI API for the models, you can also change between themes!"
      },

      phone: {
        title: "Python Phone",
        description: "A phone you can interact with, all in python",
        details: "I made a phone in python and pygame that you can interact with, you can set timers, talk to AI's get notifications, change the wallpaper, see the weather for the current day and next 7 days in the weather app, and more, everything is in seperate apps that you can click on to open"
      }
      
    };
  
    viewButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".project-card");
        const projectId = card.getAttribute("data-id");
  
        if (projectData[projectId]) {
          const { title, description, details } = projectData[projectId];
          modalContent.innerHTML = `
            <h2>${title}</h2>
            <p><strong>${description}</strong></p>
            <p>${details}</p>
          `;
          modal.classList.add("show"); // when opening
            classList.add("hidden"); // when clicking outside
        }
      });
    });
  
    closeButton.addEventListener("click", () => {
      modal.classList.remove("show");
      modalContent.innerHTML = "";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("show");
          modalContent.innerHTML = "";
        }
      });
});
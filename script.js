/**
 * A Little Something for Misbah 💌
 * Client-side script handling:
 * - Direct Formspree submission via fetch + FormData
 * - Anonymous toggle behavior (clearing & disabling name field)
 * - Word counter & clean live validation
 * - State transitions (loading, error alerts, success screen)
 * - Subtle animations and scroll cues
 */

// Formspree configuration endpoint
const FORMSPREE_ENDPOINT = "https://formspree.io/f/meaavzpb";

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const form = document.getElementById("birthday-letter-form");
  const formContainer = document.getElementById("form-container");
  const successContainer = document.getElementById("success-container");
  const nameInput = document.getElementById("sender-name");
  const messageInput = document.getElementById("letter-message");
  const anonCheckbox = document.getElementById("anonymous-checkbox");
  const submitBtn = document.getElementById("submit-btn");
  const messageError = document.getElementById("message-error");
  const formAlert = document.getElementById("form-alert");
  const charCounter = document.getElementById("char-counter");
  const ctaScrollBtn = document.getElementById("cta-scroll-btn");
  const returnTopBtn = document.getElementById("return-top-btn");
  const writeAnotherBtn = document.getElementById("write-another-btn");

  let isSubmitting = false;

  // 1. Smooth scroll to form on CTA click
  if (ctaScrollBtn) {
    ctaScrollBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById("letter-form-section");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // Focus the message or name field after scroll
        setTimeout(() => {
          if (!anonCheckbox.checked) {
            nameInput.focus();
          } else {
            messageInput.focus();
          }
        }, 500);
      }
    });
  }

  // 2. Anonymous Checkbox Toggle
  if (anonCheckbox) {
    anonCheckbox.addEventListener("change", () => {
      if (anonCheckbox.checked) {
        nameInput.value = "";
        nameInput.disabled = true;
        nameInput.classList.remove("has-error");
        nameInput.placeholder = "Anonymous sender (will not be revealed)";
      } else {
        nameInput.disabled = false;
        nameInput.placeholder = "Who is this little letter from?";
      }
    });
  }

  // 3. Word & Character Counter
  if (messageInput && charCounter) {
    const updateWordCount = () => {
      const text = messageInput.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      charCounter.textContent = `${words} ${words === 1 ? 'word' : 'words'}`;
      
      // Clear error as user types
      if (text.length > 0) {
        messageError.classList.remove("visible");
        messageError.textContent = "";
        messageInput.classList.remove("has-error");
      }
    };

    messageInput.addEventListener("input", updateWordCount);
  }

  // Helper to show/hide alert messages
  function showAlert(msg, isError = true) {
    if (!formAlert) return;
    formAlert.textContent = msg;
    formAlert.hidden = false;
    formAlert.className = `form-alert-banner ${isError ? 'error' : 'success'}`;
  }

  function clearAlert() {
    if (!formAlert) return;
    formAlert.hidden = true;
    formAlert.textContent = "";
  }

  // 4. Form Validation & Submission
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAlert();

      if (isSubmitting) return;

      const messageValue = messageInput.value.trim();

      // Validation: Message is required
      if (!messageValue) {
        messageError.textContent = "Please write a little something before sending ♡";
        messageError.classList.add("visible");
        messageInput.classList.add("has-error");
        messageInput.focus();
        return;
      }

      // Enter loading state
      isSubmitting = true;
      submitBtn.disabled = true;
      submitBtn.classList.add("is-submitting");
      const btnTextSpan = submitBtn.querySelector(".btn-text");
      const originalText = btnTextSpan ? btnTextSpan.innerHTML : submitBtn.innerHTML;
      if (btnTextSpan) {
        btnTextSpan.innerHTML = "Sealing your letter…";
      }

      // Prepare submission data
      const formData = new FormData();
      const isAnon = anonCheckbox.checked;
      const senderName = isAnon ? "Anonymous Friend" : (nameInput.value.trim() || "A Friend");

      formData.append("name", senderName);
      formData.append("message", messageValue);
      formData.append("anonymous", isAnon ? "Yes" : "No");
      formData.append("_subject", `Birthday Letter for Misbah from ${senderName} 💌`);

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          body: formData,
          headers: {
            "Accept": "application/json"
          }
        });

        if (response.ok) {
          // Success: reset form and reveal success stationery
          form.reset();
          if (anonCheckbox) anonCheckbox.checked = false;
          if (nameInput) {
            nameInput.disabled = false;
            nameInput.placeholder = "Who is this little letter from?";
          }
          if (charCounter) charCounter.textContent = "0 words";

          // Transition to success screen
          if (formContainer && successContainer) {
            formContainer.hidden = true;
            successContainer.hidden = false;

            // Scroll so the success screen is nicely centered
            successContainer.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else {
          // Formspree API error
          let errorMessage = "Unable to send your letter right now. Please try again in a moment.";
          try {
            const data = await response.json();
            if (data && data.errors && data.errors.length > 0) {
              errorMessage = data.errors.map(err => err.message).join(", ");
            }
          } catch (_) {
            // fallback to default error message
          }
          showAlert(errorMessage, true);
        }
      } catch (networkError) {
        showAlert("A network error occurred. Please check your connection and try again.", true);
      } finally {
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.classList.remove("is-submitting");
        if (btnTextSpan) {
          btnTextSpan.innerHTML = originalText;
        }
      }
    });
  }

  // 5. Success screen action buttons
  if (returnTopBtn) {
    returnTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (writeAnotherBtn) {
    writeAnotherBtn.addEventListener("click", () => {
      if (formContainer && successContainer) {
        successContainer.hidden = true;
        formContainer.hidden = false;
        messageInput.focus();
        formContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // 6. Editorial scroll reveal for sections
  const sections = document.querySelectorAll(".invitation-card, .stationery-wrapper");
  sections.forEach(sec => sec.classList.add("reveal-on-scroll"));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  sections.forEach(sec => revealObserver.observe(sec));
});

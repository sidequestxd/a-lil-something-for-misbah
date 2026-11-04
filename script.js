/**
 * A Little Something for Misbah 💌
 * Client-side script handling:
 * - Direct Formspree submission via fetch + FormData
 * - Anonymous toggle behavior (clearing & disabling name field)
 * - Word counter & clean live validation
 * - State transitions (loading, error alerts, success screen)
 * - Subtle animations and scroll cues
 * - Gentle floating pink & white petals background
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
            successContainer.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else {
          let errorMessage = "Unable to send your letter right now. Please try again in a moment.";
          try {
            const data = await response.json();
            if (data && data.errors && data.errors.length > 0) {
              errorMessage = data.errors.map(err => err.message).join(", ");
            }
          } catch (_) {}
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

  // -------------------------------------------------------------------------
  // 7. FLOATING PETALS ANIMATION (Subtle pink & white blossoms)
  // -------------------------------------------------------------------------
  const canvas = document.getElementById("petals-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Elegant shades of soft white, blush, rose quartz, and dusty petal
    const petalColors = [
      { fill: "rgba(255, 255, 255, 0.8)", stroke: "rgba(244, 221, 227, 0.65)" },
      { fill: "rgba(255, 248, 250, 0.85)", stroke: "rgba(235, 195, 206, 0.6)" },
      { fill: "rgba(244, 221, 227, 0.75)", stroke: "rgba(217, 167, 178, 0.65)" },
      { fill: "rgba(249, 238, 240, 0.8)", stroke: "rgba(224, 178, 190, 0.55)" },
      { fill: "rgba(235, 192, 205, 0.7)", stroke: "rgba(183, 131, 145, 0.55)" }
    ];

    // Petal count: light, airy & unhurried density
    const totalPetals = window.innerWidth < 600 ? 11 : 18;
    const petals = [];

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        // Center-focused spawn distribution:
        // Petals spawn primarily through the central reading area (20% to 80% of width)
        const centerSpan = width * 0.65;
        const centerLeft = (width - centerSpan) / 2;
        this.x = centerLeft + Math.random() * centerSpan;
        
        this.y = init ? Math.random() * height : -25 - Math.random() * 45;
        this.size = 10 + Math.random() * 8;
        this.speedY = 0.5 + Math.random() * 0.55;
        
        // Perfectly symmetrical horizontal gentle sway centered around zero (no bias to left or right)
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.012;
        this.swing = Math.random() * Math.PI * 2;
        this.swingSpeed = 0.01 + Math.random() * 0.014;
        this.swingAmplitude = 0.65 + Math.random() * 0.6;
        this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
        this.opacity = 0.55 + Math.random() * 0.35;
        // Variety of petal types for an organic mix:
        // 0: Rose Petal (broad, teardrop, heart-notched top)
        // 1: Sakura / Cherry Blossom (slender with notched tip)
        // 2: Curved Falling Leaflet (tapered & elongated)
        // 3: Soft Heart Petal (mini romantic silhouette)
        this.type = Math.floor(Math.random() * 4);
      }

      update() {
        this.swing += this.swingSpeed;
        this.x += this.speedX + Math.sin(this.swing) * this.swingAmplitude;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 25 || this.x < -30 || this.x > width + 30) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        ctx.fillStyle = this.color.fill;
        ctx.strokeStyle = this.color.stroke;
        ctx.lineWidth = 0.7;

        const s = this.size;

        if (this.type === 0) {
          // Type 0: Classic Wide Rose Petal (cupped with notched crown)
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-s * 0.7, s * 0.1, -s * 0.7, s * 0.9, -s * 0.2, s * 1.25);
          ctx.quadraticCurveTo(0, s * 1.15, s * 0.2, s * 1.25);
          ctx.bezierCurveTo(s * 0.7, s * 0.9, s * 0.7, s * 0.1, 0, 0);
          ctx.fill();
          ctx.stroke();

          // Delicate vein
          ctx.beginPath();
          ctx.moveTo(0, s * 0.15);
          ctx.lineTo(0, s * 1.0);
          ctx.lineWidth = 0.5;
          ctx.stroke();

        } else if (this.type === 1) {
          // Type 1: Delicate Sakura / Cherry Blossom Petal (pointed base, distinct notched tip)
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-s * 0.5, s * 0.35, -s * 0.6, s * 0.9, -s * 0.15, s * 1.2);
          ctx.lineTo(0, s * 1.08); // center notch
          ctx.lineTo(s * 0.15, s * 1.2);
          ctx.bezierCurveTo(s * 0.6, s * 0.9, s * 0.5, s * 0.35, 0, 0);
          ctx.fill();
          ctx.stroke();

        } else if (this.type === 2) {
          // Type 2: Slender Curved Jasmine / Wildflower Petal (asymmetrical drift)
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-s * 0.35, s * 0.4, -s * 0.45, s * 0.85, -s * 0.05, s * 1.35);
          ctx.bezierCurveTo(s * 0.35, s * 1.1, s * 0.4, s * 0.3, 0, 0);
          ctx.fill();
          ctx.stroke();

          // Subtle side curve vein
          ctx.beginPath();
          ctx.moveTo(0, s * 0.2);
          ctx.quadraticCurveTo(-s * 0.05, s * 0.7, 0, s * 1.1);
          ctx.lineWidth = 0.5;
          ctx.stroke();

        } else {
          // Type 3: Romantic Mini Heart / Sweetheart Petal
          const hs = s * 0.55;
          ctx.beginPath();
          ctx.moveTo(0, hs * 0.4);
          ctx.bezierCurveTo(-hs * 0.1, 0, -hs * 0.9, 0, -hs * 0.9, hs * 0.7);
          ctx.bezierCurveTo(-hs * 0.9, hs * 1.3, -hs * 0.3, hs * 1.7, 0, hs * 2.2);
          ctx.bezierCurveTo(hs * 0.3, hs * 1.7, hs * 0.9, hs * 1.3, hs * 0.9, hs * 0.7);
          ctx.bezierCurveTo(hs * 0.9, 0, hs * 0.1, 0, 0, hs * 0.4);
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < totalPetals; i++) {
      petals.push(new Petal());
    }

    function animatePetals() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < petals.length; i++) {
        petals[i].update();
        petals[i].draw();
      }
      requestAnimationFrame(animatePetals);
    }

    animatePetals();
  }

  // -------------------------------------------------------------------------
  // 8. GREEN VINE VEIL PARALLAX SCROLL ANIMATION
  // -------------------------------------------------------------------------
  const vineTrack = document.getElementById("green-vine-track");
  if (vineTrack) {
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
          const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

          // Subtle organic parallax sway & translation as the user scrolls
          // Translates up to -18% vertically to unveil lower clusters
          // Adds a gentle sway wave on scroll
          const translateY = -(progress * 18);
          const swayRotate = Math.sin(progress * Math.PI * 3) * 1.5;
          const swayX = Math.sin(progress * Math.PI * 2) * 5;

          vineTrack.style.transform = `translate3d(${swayX}px, ${translateY}%, 0) rotate(${swayRotate}deg)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

});

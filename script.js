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
  // -------------------------------------------------------------------------
  // 7. FLOATING PETALS & SAGE LEAFLETS ANIMATION
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

    // Delicate floral petal colors
    const petalColors = [
      { fill: "rgba(255, 255, 255, 0.8)", stroke: "rgba(244, 221, 227, 0.65)" },
      { fill: "rgba(255, 248, 250, 0.85)", stroke: "rgba(235, 195, 206, 0.6)" },
      { fill: "rgba(244, 221, 227, 0.75)", stroke: "rgba(217, 167, 178, 0.65)" },
      { fill: "rgba(249, 238, 240, 0.8)", stroke: "rgba(224, 178, 190, 0.55)" },
      { fill: "rgba(235, 192, 205, 0.7)", stroke: "rgba(183, 131, 145, 0.55)" }
    ];

    // Elegant botanical leaf colors (Sage, olive & tender spring green)
    const leafColors = [
      { fill: "rgba(122, 156, 86, 0.75)", stroke: "rgba(68, 92, 44, 0.65)" },
      { fill: "rgba(142, 174, 102, 0.78)", stroke: "rgba(78, 104, 52, 0.6)" },
      { fill: "rgba(102, 134, 72, 0.72)", stroke: "rgba(55, 78, 36, 0.7)" },
      { fill: "rgba(164, 192, 126, 0.75)", stroke: "rgba(88, 116, 62, 0.6)" }
    ];

    // Balanced density: total 20 items (mix of pink/white petals + green leaflets)
    const totalItems = window.innerWidth < 600 ? 14 : 22;
    const floatingElements = [];

    class FloatingItem {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        const centerSpan = width * 0.7;
        const centerLeft = (width - centerSpan) / 2;
        this.x = centerLeft + Math.random() * centerSpan;
        
        this.y = init ? Math.random() * height : -25 - Math.random() * 45;
        this.size = 9 + Math.random() * 8;
        this.speedY = 0.45 + Math.random() * 0.5;
        this.speedX = (Math.random() - 0.5) * 0.28;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.014;
        this.swing = Math.random() * Math.PI * 2;
        this.swingSpeed = 0.01 + Math.random() * 0.014;
        this.swingAmplitude = 0.65 + Math.random() * 0.55;
        
        // 70% Petals, 30% Green Leaflets for a meaningful botanical blend
        this.isLeaf = Math.random() < 0.32;
        
        if (this.isLeaf) {
          this.color = leafColors[Math.floor(Math.random() * leafColors.length)];
          this.leafType = Math.floor(Math.random() * 2); // 0: single leaflet, 1: twin mini-leaf
          this.size = 8 + Math.random() * 6; // small, delicate leaves
        } else {
          this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
          this.type = Math.floor(Math.random() * 4); // 4 petal shapes
        }
        
        this.opacity = 0.55 + Math.random() * 0.35;
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
        ctx.lineWidth = 0.65;

        const s = this.size;

        if (this.isLeaf) {
          if (this.leafType === 0) {
            // Elegant single teardrop-elliptical green leaf with center vein
            ctx.beginPath();
            ctx.moveTo(0, -s * 0.85);
            ctx.quadraticCurveTo(s * 0.42, 0, 0, s * 0.85);
            ctx.quadraticCurveTo(-s * 0.42, 0, 0, -s * 0.85);
            ctx.fill();
            ctx.stroke();

            // Central vein line
            ctx.beginPath();
            ctx.moveTo(0, -s * 0.7);
            ctx.lineTo(0, s * 0.7);
            ctx.lineWidth = 0.45;
            ctx.stroke();
          } else {
            // Twin mini-leaflet sprig
            ctx.beginPath();
            ctx.moveTo(-s * 0.1, -s * 0.7);
            ctx.quadraticCurveTo(s * 0.35, -s * 0.2, -s * 0.05, s * 0.5);
            ctx.quadraticCurveTo(-s * 0.35, -s * 0.2, -s * 0.1, -s * 0.7);
            ctx.fill();
            ctx.stroke();

            // Small side leaf
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(s * 0.55, s * 0.2, s * 0.2, s * 0.65);
            ctx.quadraticCurveTo(0, s * 0.4, 0, 0);
            ctx.fill();
            ctx.stroke();
          }
        } else {
          // Petal shapes
          if (this.type === 0) {
            // Rose Petal
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-s * 0.7, s * 0.1, -s * 0.7, s * 0.9, -s * 0.2, s * 1.25);
            ctx.quadraticCurveTo(0, s * 1.15, s * 0.2, s * 1.25);
            ctx.bezierCurveTo(s * 0.7, s * 0.9, s * 0.7, s * 0.1, 0, 0);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, s * 0.15);
            ctx.lineTo(0, s * 1.0);
            ctx.lineWidth = 0.45;
            ctx.stroke();
          } else if (this.type === 1) {
            // Sakura / Cherry Blossom Petal with notched tip
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-s * 0.5, s * 0.35, -s * 0.6, s * 0.9, -s * 0.15, s * 1.2);
            ctx.lineTo(0, s * 1.08);
            ctx.lineTo(s * 0.15, s * 1.2);
            ctx.bezierCurveTo(s * 0.6, s * 0.9, s * 0.5, s * 0.35, 0, 0);
            ctx.fill();
            ctx.stroke();
          } else if (this.type === 2) {
            // Curved Wildflower Petal
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-s * 0.35, s * 0.4, -s * 0.45, s * 0.85, -s * 0.05, s * 1.35);
            ctx.bezierCurveTo(s * 0.35, s * 1.1, s * 0.4, s * 0.3, 0, 0);
            ctx.fill();
            ctx.stroke();
          } else {
            // Sweetheart Petal
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
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < totalItems; i++) {
      floatingElements.push(new FloatingItem());
    }

    function animateFloatingItems() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < floatingElements.length; i++) {
        floatingElements[i].update();
        floatingElements[i].draw();
      }
      requestAnimationFrame(animateFloatingItems);
    }

    animateFloatingItems();
  }

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // 8. BUTTERY 60FPS PIXEL-INTERPOLATED VINE PARALLAX SCROLL
  // -------------------------------------------------------------------------
  const vineTrack = document.getElementById("green-vine-track");
  if (vineTrack) {
    let currentY = 0;
    let targetY = 0;
    let isTicking = false;
    
    // Pixel-based movement range:
    // Moves across a generous 180px window for distinct, fluid travel
    const maxTravelPixels = 180;
    const ease = 0.055; // Silky fluid damping (smooth floating momentum)

    function onScrollUpdate() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;
      
      targetY = progress * maxTravelPixels;

      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(renderParallax);
      }
    }

    function renderParallax() {
      const diff = targetY - currentY;
      
      // Update with smooth sub-pixel ease
      currentY += diff * ease;

      // Sub-pixel harmonic lateral sway and subtle breathing rotation
      const progress = currentY / maxTravelPixels;
      const swayX = Math.sin(progress * Math.PI * 2) * 6.5;
      const swayRotate = Math.sin(progress * Math.PI * 2.5) * 1.4;

      // translate3d in explicit sub-pixel precision for butter-smooth rendering
      vineTrack.style.transform = `translate3d(${swayX.toFixed(3)}px, ${(-currentY).toFixed(3)}px, 0) rotate(${swayRotate.toFixed(3)}deg)`;

      // Continue animating until settled within sub-pixel threshold
      if (Math.abs(diff) > 0.08) {
        requestAnimationFrame(renderParallax);
      } else {
        currentY = targetY;
        vineTrack.style.transform = `translate3d(${swayX.toFixed(3)}px, ${(-targetY).toFixed(3)}px, 0) rotate(${swayRotate.toFixed(3)}deg)`;
        isTicking = false;
      }
    }

    window.addEventListener("scroll", onScrollUpdate, { passive: true });
    // Initial paint setup
    onScrollUpdate();
  }
});

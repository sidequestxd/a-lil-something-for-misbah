const fs = require('fs');
const scriptPath = 'd:/Games/a-lil-something-for-misbah/script.js';
let script = fs.readFileSync(scriptPath, 'utf8');

const petalsLogic = `
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
      { fill: "rgba(255, 255, 255, 0.75)", stroke: "rgba(244, 221, 227, 0.6)" },
      { fill: "rgba(255, 248, 250, 0.8)", stroke: "rgba(235, 195, 206, 0.55)" },
      { fill: "rgba(244, 221, 227, 0.7)", stroke: "rgba(217, 167, 178, 0.6)" },
      { fill: "rgba(249, 238, 240, 0.78)", stroke: "rgba(224, 178, 190, 0.5)" },
      { fill: "rgba(229, 180, 195, 0.65)", stroke: "rgba(183, 131, 145, 0.5)" }
    ];

    // Petal count: balanced - not overwhelming, but unmistakably floating
    const totalPetals = window.innerWidth < 600 ? 22 : 36;
    const petals = [];

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : -20 - Math.random() * 40;
        this.size = 11 + Math.random() * 10;
        this.speedY = 0.55 + Math.random() * 0.9;
        this.speedX = (Math.random() - 0.45) * 0.8;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.swing = Math.random() * Math.PI * 2;
        this.swingSpeed = 0.012 + Math.random() * 0.018;
        this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
        this.opacity = 0.65 + Math.random() * 0.35;
      }

      update() {
        this.swing += this.swingSpeed;
        this.x += this.speedX + Math.sin(this.swing) * 0.75;
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

        // Draw organic curved petal shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size / 2, this.size, 0, this.size * 1.3);
        ctx.bezierCurveTo(this.size / 2, this.size, this.size / 2, -this.size / 2, 0, 0);
        ctx.fillStyle = this.color.fill;
        ctx.fill();

        ctx.strokeStyle = this.color.stroke;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // Delicate mid-rib crease for 3D realism
        ctx.beginPath();
        ctx.moveTo(0, this.size * 0.15);
        ctx.lineTo(0, this.size * 1.05);
        ctx.strokeStyle = this.color.stroke;
        ctx.lineWidth = 0.6;
        ctx.stroke();

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
`;

if (!script.includes('FLOATING PETALS ANIMATION')) {
  // Insert right before the last closing });
  const lastIndex = script.lastIndexOf('});');
  if (lastIndex !== -1) {
    script = script.substring(0, lastIndex) + petalsLogic + '\n});\n';
    fs.writeFileSync(scriptPath, script, 'utf8');
    console.log('Petals logic successfully added to script.js');
  }
} else {
  console.log('Petals logic already present');
}
`;

fs.writeFileSync('d:/Games/a-lil-something-for-misbah/add_petals_logic.js', petalsInjectionCode, 'utf8');


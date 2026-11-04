# A Little Something for Misbah 💌

A bespoke, boutique romantic editorial birthday letter collection website created for Misbah. Friends can visit from their phones (Instagram, WhatsApp) or desktops and leave heartfelt birthday letters, nostalgic memories, inside jokes, and appreciation notes. 

All messages are submitted securely and privately through **Formspree** straight into your inbox.

---

## ✨ Design & Aesthetic

- **Design Philosophy**: High-end romantic editorial stationery — avoiding generic templates, neon pinks, and childish aesthetics.
- **Palette**:
  - Warm Ivory (`#FFFAF7`) & Soft Petal (`#F9EEF0`) for paper texture and backgrounds.
  - Deep Burgundy (`#633D4A`) & Dark Wine (`#482934`) for editorial headings and primary action seals.
  - Dusty Rose (`#D9A7B2`) & Muted Mauve (`#B78391`) for delicate borders, accents, and prompts.
  - Soft Charcoal (`#393034`) for legible, comfortable typography.
- **Typography**:
  - Serif: *Cormorant Garamond* (headings, quotes, stationery titles)
  - Sans-serif: *Inter* (body text, clean input fields)
  - Delicate Script: *Alex Brush* (editorial accents & hand-penned details)
- **Stationery Details**:
  - Custom wax seal badge (`M`).
  - Tactile paper fold and lined letter styling.
  - Interactive envelope opening with letter reveal and petal animations upon submission.
  - Anonymous submission toggle that automatically clears and locks the name input.
  - Word counter and validation states.

---

## 📁 Project Structure

```text
/
├── index.html        # Semantic HTML5 markup (Hero, Invitation, Stationery Form, Success View)
├── style.css         # Boutique romantic editorial stylesheet (Mobile-first, 9:16 optimized)
├── script.js         # Vanilla JavaScript (Formspree fetch, live validation, UI state transitions)
└── README.md         # Documentation & deployment guide
```

---

## 🛠️ Configuration & Formspree Setup

The form is pre-configured with your Formspree endpoint in [`script.js`](file:///d:/Games/a-lil-something-for-misbah/script.js):

```javascript
const FORMSPREE_ENDPOINT = "https://formspree.io/f/meaavzpb";
```

### Form Fields Submitted
When a guest submits a letter, Formspree receives:
- `name`: The sender's name (or `"Anonymous Friend"` if anonymous toggle is checked).
- `message`: The full letter / message text.
- `anonymous`: `"Yes"` or `"No"`.
- `_subject`: `Birthday Letter for Misbah from [Sender Name] 💌`.

---

## 🧪 Testing the Form

1. Start a local server:
   ```powershell
   python -m http.server 8000
   ```
2. Open [`http://localhost:8000`](http://localhost:8000) in your mobile or desktop browser.
3. Test validation: Click **"Send your letter ♡"** without typing a message. A notice will prompt you to write something first.
4. Test anonymous toggle: Check **"I'd like to keep this message anonymous."** — note that the name field disables and indicates anonymous delivery.
5. Send a test message: Click **"Send your letter ♡"**. The button transitions into *"Sealing your letter…"*, followed by the envelope opening animation and the confirmation screen.
6. Verify receipt in your [Formspree Dashboard](https://formspree.io).

---

## 🚀 Deploying with GitHub Pages

Deploying takes under two minutes directly from GitHub:

1. **Initialize Git repository**:
   ```bash
   git init
   git add .
   git commit -m "feat: A Little Something for Misbah editorial website"
   ```
2. **Push to GitHub**:
   - Create a repository on GitHub (e.g., `misbah-birthday` or `a-lil-something-for-misbah`).
   - Run:
     ```bash
     git remote add origin https://github.com/<your-username>/<your-repo-name>.git
     git branch -M main
     git push -u origin main
     ```
3. **Turn on GitHub Pages**:
   - Go to your repository on GitHub.
   - Click **Settings** &rarr; **Pages** (under the "Code and automation" menu on the left).
   - Under **Build and deployment** &rarr; **Branch**, choose `main` and `/ (root)`.
   - Click **Save**.
4. GitHub Pages will generate your live link (e.g., `https://<your-username>.github.io/<your-repo-name>/`).
5. Share this link on Instagram stories or WhatsApp with Misbah's friends!

---

*Made with love for Misbah ♡*

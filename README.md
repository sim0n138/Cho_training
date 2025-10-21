# 🏋️ Cho Training

**Ultra-Minimal Personal Training & Wellbeing Tracker**

Single HTML file. Zero dependencies. 103 lines. 3.8KB.

---

## 🔥 ULTRA-MINIMAL ARCHITECTURE

This is the **absolute minimal** version of Cho Training.

### What it is:
- ✅ **1 file**: `index.html` (everything inside)
- ✅ **103 lines** of code
- ✅ **3.8KB** total size
- ✅ **0 dependencies**
- ✅ **0 build process**
- ✅ **0 node_modules**
- ✅ Works everywhere

### What it does:
- 📝 Log workouts (date, exercises, mood, energy, notes)
- 📊 View statistics (total logs, exercises, avg mood)
- 🗑️ Delete logs
- 💾 Auto-save to localStorage
- 📱 Responsive design

---

## 🚀 Usage

### Option 1: Open directly
```bash
# Just open in browser
open index.html
```

### Option 2: Local server
```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Option 3: Deploy anywhere
- Drop `index.html` to any static host
- Vercel, Netlify, GitHub Pages
- Or email it to someone!

---

## 📊 Architecture

**Before (v2.0):**
- 13 files
- 633 lines
- 80KB bundle (gzipped)
- React + TypeScript + Tailwind + Vite + Zustand
- npm install, npm build, complex deployment

**After (v3.0 ULTRA):**
- **1 file**
- **103 lines**
- **3.8KB total**
- Pure HTML + CSS + Vanilla JS
- Double-click to open

**Reduction:** -92% files, -84% lines, -95% size

---

## 🎯 Features

### Core Functionality
- ✅ Add training logs
- ✅ View all logs (sorted by date)
- ✅ Statistics dashboard
- ✅ Delete logs
- ✅ Persistent storage (localStorage)

### UI/UX
- ⚡ Instant load (<10ms)
- 📱 Mobile-friendly
- ⌨️ Keyboard accessible
- 🎨 Clean minimal design
- 🖱️ Hover effects

### Technical
- 💾 localStorage persistence
- 📊 Real-time statistics
- 🔢 Range inputs for mood/energy
- 📝 Optional notes field
- ⚠️ Confirmation dialogs

---

## 📖 Code Structure

All code in `index.html`:

```
<style>        <!-- 25 lines of CSS -->
<body>         <!-- 30 lines of HTML -->
<script>       <!-- 48 lines of JavaScript -->
```

**JavaScript functions:**
- `get()` - Load logs from localStorage
- `set()` - Save logs to localStorage
- `render()` - Update UI with current data
- `del(id)` - Delete log by ID
- Form submit handler

**CSS classes:**
- `.stats` - Statistics grid
- `.card` - Log item container
- `.meta` - Metadata text
- `.del` - Delete button

---

## 🔍 Evolution

### v1.0 (Original)
- Multiple files, services, tests
- 60+ files, 340+ exercises database
- React, Context API, i18n, charts

### v2.0 (Minimalist)
- TypeScript, Tailwind, Zustand
- 13 files, modern architecture
- Removed unnecessary features

### v3.0 (ULTRA - Current)
- **1 file, pure vanilla**
- Maximum simplicity
- Zero overhead

See [`ULTRA_MINIMAL_OPTIONS.md`](ULTRA_MINIMAL_OPTIONS.md) for design decisions.

See [`CRITICAL_ANALYSIS.md`](CRITICAL_ANALYSIS.md) for detailed code review.

---

## 📁 Project Files

```
.
├── index.html                    # The entire app
├── README.md                     # This file
├── LICENSE                       # MIT License
├── ULTRA_MINIMAL_OPTIONS.md      # Architecture decisions
├── CRITICAL_ANALYSIS.md          # Code review
└── docs/                         # Historical documentation
```

---

## 🛠️ Customization

Edit `index.html` directly:

**Change colors:**
```css
button{background:#000;color:#fff}  /* Line 16 */
```

**Modify storage key:**
```javascript
const k='cho-logs'  /* Line 56 */
```

**Adjust statistics:**
```javascript
avgMood=total?((data.reduce...  /* Line 62 */
```

---

## 💾 Data Format

localStorage key: `cho-logs`

```json
[
  {
    "id": 1729540800000,
    "d": "2024-10-21",
    "ex": "Running, Yoga",
    "m": "8",
    "e": "7",
    "n": "Great workout!"
  }
]
```

Fields:
- `id` - Timestamp
- `d` - Date
- `ex` - Exercises (comma-separated)
- `m` - Mood (1-10)
- `e` - Energy (1-10)
- `n` - Notes (optional)

---

## 📈 Metrics

| Metric | Value |
|--------|-------|
| **Files** | 1 |
| **Lines** | 103 |
| **Size** | 3.8KB |
| **Dependencies** | 0 |
| **Build time** | 0ms |
| **Load time** | <10ms |
| **Supported browsers** | All modern |

---

## 🎓 Learning

This project demonstrates:
- ✅ Vanilla JS without frameworks
- ✅ localStorage API
- ✅ FormData API
- ✅ Template literals for rendering
- ✅ Array methods (map, filter, reduce)
- ✅ Event handling
- ✅ Responsive CSS Grid
- ✅ Minimal viable product (MVP)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 🌟 Philosophy

**Less is more.**

The best code is no code. The second best is minimal code that solves the problem.

This app:
- ❌ No framework overhead
- ❌ No build complexity
- ❌ No npm packages
- ❌ No deployment pipeline
- ✅ Just works

---

<div align="center">

**Made with ❤️ for simplicity**

[⬆ Back to top](#-cho-training)

</div>

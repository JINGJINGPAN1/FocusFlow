# FocusFlow App - Rubric Review

Checklist against the Potential Rubric.

---

## ✅ Met Requirements

### Design document (50 pts)

- **Project description** ✅ `docs/design-document.md` contains complete project description and core features
- **User Personas** ✅ 3 Personas (Sarah / Mark / Lisa)
- **User stories** ✅ 11 user stories (As a… I want… So that… + acceptance criteria)
- **Design mockups** ✅ ASCII wireframes for Tasks / Focus / Stats

### Functionality & Requirements (15 pts)

- **#project approved requirements** ✅ Task management + Focus Session + Stats, consistent with design doc

### Usability & Instructions (5 + 5 pts)

- **Usable** ✅ Navigation, forms, lists, stats
- **Instructions** ✅ README, QUICKSTART with install and usage instructions
- **Useful** ✅ Practical for real scenarios (students, remote workers, freelancers)

### ESLint (5 pts)

- **Config** ✅ `.eslintrc.json` exists
- **No errors** ✅ Fixed unused variables etc., `npm run lint` passes with no errors (only console warnings remain)

### Code Organization (5 pts)

- **Per-page separation** ✅ SPA, views in `index.html`, logic in `public/js/` modules
- **Database separate** ✅ `src/server/db/database.js`
- **CSS modular** ✅ `public/css/modules/` multiple files
- **No extra files** ✅ No `routes/users.js`, no default React favicon

### JS Modularity (15 pts)

- **Modular** ✅ `src/server/db/database.js` connector, `routes/tasks.js`, `routes/sessions.js`, `public/js/api.js`, `tasks.js`, `focus.js`, `stats.js`, `main.js`
- **ESM** ✅ All use `import`/`export`, no `require`

### Frontend Rendering (15 pts)

- **Client-side rendering** ✅ Vanilla JS only, no server-side template engine
- **Vanilla JS only** ✅ No React/Vue or other frameworks

### Forms (15 pts)

- **At least 1 form** ✅ `<form id="taskForm">` in `index.html` (Add Task modal), with input + submit button

### MongoDB Collections & CRUD (15 pts)

- **At least 2 Collections** ✅ `tasks`, `sessions`
- **CRUD** ✅ Both have GET/POST/PUT/DELETE (see `routes/tasks.js`, `routes/sessions.js`)
- **No Mongoose** ✅ Uses native `mongodb` driver

### Node + Express (5 pts)

- ✅ `package.json` includes express, `src/server/index.js` uses Express

### Prettier (5 pts)

- ✅ `.prettierrc` exists, `npm run format` works

### Standard Components (5 pts)

- ✅ Buttons are `<button>`, no div/span used as buttons

### CSS by Module (5 pts)

- ✅ `public/css/main.css` imports multiple modules via `@import`: variables, base, navigation, tasks, focus, stats, modal

### README (10 pts)

- **Author** ⚠️ Currently `[Your Name]`, replace with your name
- **Class Link** ⚠️ Currently `[Your Class Link]`, replace with course link
- **Project Objective** ✅
- **Screenshot** ⚠️ See "TODO" below
- **Instructions to build** ✅ Install, .env, start steps complete

### Credentials Not Exposed (10 pts)

- ✅ Uses `process.env` (.env), `.gitignore` includes `.env`
- ✅ README uses examples only (e.g. `username:password`), no real passwords

### package.json (5 pts)

- ✅ Exists and lists express, mongodb, dotenv, cors, eslint, prettier, etc.

### MIT License (5 pts)

- ✅ Root has `LICENSE` file with MIT content

### No Unused Code (5 pts)

- ✅ No `routes/users.js`, no default React favicon, no obvious dead code

### Backend No CJS (10 pts)

- ✅ All ESM (`import`/`export`), no `require`/`module.exports`

### Mongoose / Template Engine Prohibited (-20 if violated)

- ✅ Not using Mongoose
- ✅ Not using pug, jade, EJS, handlebars, etc.

---

## ⚠️ Items You Must Complete / Confirm

| Requirement                        | Pts | Status & Notes                                                                                          |
| ---------------------------------- | --- | ------------------------------------------------------------------------------------------------------- |
| **Deploy to public**               | 5   | Deploy to Heroku / Railway / Render, ensure publicly accessible                                         |
| **Google Form**                    | 5   | Confirm thumbnail and link on submission                                                                |
| **Short video demo**               | 10  | Record and narrate app usage                                                                            |
| **Code freeze & materials timing** | 5   | Code frozen 24h before class; video, slides, deploy done before class                                   |
| **README author & class link**     | -   | Replace `[Your Name]`, `[Your Class Link]` with actual values                                           |
| **Screenshot**                     | -   | README references `docs/screenshot.png` but file not in repo; add a screenshot at `docs/screenshot.png` |

---

## Changes Made (for Rubric Compliance)

1. **ESLint 0 errors**
   - `src/server/index.js`: Renamed unused `next` to `_next` in error handler middleware.
   - `public/js/focus.js`: Removed unused `isPaused`; used `currentTaskName` for display; removed unused `totalTimeEl` from `updateProgress`; exported `deleteSession` to fix "defined but never used".
   - `npm run lint` now has only 26 `no-console` warnings, no errors.

---

## Summary

- **Design doc, features, code structure, ESM, MongoDB dual-collection CRUD, forms, Node+Express, Prettier, standard tags, CSS modules, README structure, credential safety, package.json, MIT, no CJS, no Mongoose/template engines** all meet requirements.
- **Still needed**: Fill in README author and class link, add `docs/screenshot.png`, deploy, record video, submit on time, and confirm thumbnail and link in Google Form.

By current rubric estimate, after completing the items above and submitting all materials, you can receive full points except for deploy/video/timing/Form items, which depend on your course submission process.

# Portfolio Project Documentation

## Overview
This project is a clean, monochromatic brutalist portfolio for a UI/UX designer. It consists of a static frontend powered by HTML, CSS, and vanilla JavaScript, paired with a lightweight client-side CMS (Content Management System) using `localStorage`.

## Architecture & Directory Structure
- `index.html`: The main public-facing portfolio website.
- `admin.html`: The private CMS dashboard for managing portfolio projects.
- `css/style.css`: The global stylesheet containing the brutalist aesthetic, animations, and light/dark themes.
- `js/main.js`: Client-side interactivity, theme management, and project rendering.
- `js/admin.js`: CMS logic for creating, editing, and storing projects.

## Public Facing Site (`index.html` & `main.js`)
### Key Features & Flow
- **Splash Screen**: An automatic loading screen (`#splashScreen`) blocks the view initially and transitions out using CSS animations and JS timing.
- **Theme Toggling**: A floating button allows the user to switch between light and dark modes (defaults to light mode). The preference is saved in `localStorage` under the key `theme`.
- **Custom Cursor**: On devices with fine pointers, a morphing glass-cursor follows the mouse and dynamically resizes and alters border-radius when hovering over interactive elements.
- **Navigation**: A top navbar with an overlay effect that tracks the user's scroll position via the IntersectionObserver API, highlighting the active section in the menu.
- **Dynamic Projects**: The featured projects section (`#projectsGrid`) is not hardcoded. `main.js` reads the `portfolioProjects` array from `localStorage` and injects the HTML cards into the DOM.

## Client-Side CMS (`admin.html` & `admin.js`)
### Authentication
- A simple prompt-based password gate restricts access to the CMS. The dashboard verifies the password before rendering the content.

### Content Management Flow
- **Data Storage**: Projects are stored as a JSON string in the browser's `localStorage` under the key `portfolioProjects`.
- **CRUD Operations**:
  - **Create & Update**: The admin form accepts project details (Title, Description, Link, Software Tags) and an optional banner image.
  - **Image Compression**: When a banner image is uploaded, it is drawn to a `<canvas>` and automatically compressed as an optimized JPEG before being stored as a base64 string.
  - **Delete & Edit**: Projects can be selected for modification or removed entirely from the dashboard.
- **Backup & Restore System**:
  - **Export**: Generates a `.json` file containing the `localStorage` data array, triggering a direct download.
  - **Import**: Allows restoring the `localStorage` state by uploading a previously exported `.json` file.

## Data Flow Summary
1. The site owner visits `admin.html`, bypasses the prompt, and adds a project.
2. The image is compressed to base64, and the project object is saved to `localStorage('portfolioProjects')`.
3. A visitor loads `index.html`.
4. `main.js` reads `localStorage('portfolioProjects')` and injects the dynamic HTML into the `#projectsGrid` container.

---

## Changelog
* **[2026-06-06]**: Initial documentation baseline established based on project summary. Project moved to new folder (`d:\works\pweb\portfolio`) and pushed to Git.
* **[2026-06-06]**: Changed admin dashboard password to `benrais123`.
* **[2026-06-06]**: UI Bug Fixes: Removed drop shadow from project cards on hover and updated contact email link text to read "Send me an Email" instead of displaying the literal address.
* **[2026-06-06]**: Converted the email text link into a primary button labeled "Email".
* **[2026-06-12]**: Updated default theme to light mode instead of dark mode across the application.

# OSIS Election Overlay System

A lightweight, web-based broadcast overlay system for student council elections (Pemilihan OSIS). This system features a real-time Control Panel and a Scrapbook-style Overlay designed for OBS/streaming software.

## 🚀 Quick Start

### 1. Requirements
- A modern web browser (Chrome, Edge, or Firefox).
- **Recommended**: [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for VS Code.

### 2. Running the Project
The system uses `localStorage` to sync data between the Control Panel and the Overlay. For this to work, **both pages must be served from the same origin** (same domain and port).

1. Open this folder in VS Code.
2. Click **Go Live** at the bottom right (if using Live Server).
3. Open the following pages in your browser:
    - **Control Panel**: `http://localhost:5500/control.html`
    - **Overlay**: `http://localhost:5500/overlay.html`
    - **Results Page**: `http://localhost:5500/results.html`
    - **Timer Page**: `http://localhost:5500/timer.html`

## 📺 OBS Integration

To use these as broadcast overlays:

1. Open **OBS Studio**.
2. Add a new **Browser Source** to your Scene.
3. For the **URL**, enter the local server URL: `http://localhost:5500/overlay.html`.
4. Set the **Width** to `1920` and **Height** to `1080`.
5. Check the option: **"Shutdown source when not visible"** (optional).
6. To update data, keep the **Control Panel** open in your browser (or see "Pro Tip" below). Any changes you make will instantly reflect in the OBS Browser Source.

> [!TIP]
> **Pro Tip: Syncing Control Panel in OBS**
> If you find that changes in Chrome don't show up in OBS, it's because they use separate browser profiles. To fix this:
> 1. In OBS, go to **View** > **Docks** > **Custom Browser Docks**.
> 2. Name it "OSIS Control" and set the URL to `http://localhost:5500/control.html`.
> 3. Click **Apply** and dock the panel anywhere in OBS.
> 4. Now, the Control Panel and your Overlays will share the exact same storage and session!

## 🛠️ Features

- **Real-time Sync**: Update votes, names, and titles instantly.
- **Countdown Timer**: Dedicated timer page controlled by the panel for presentations or voting deadlines.
- **Scrapbook Aesthetic**: Polaroid photos, tape textures, and hand-drawn star elements (now integrated into custom background assets).
- **Dynamic Math**: Automatically calculates percentages and progress based on vote counts.
- **Demo Mode**: Includes a "Demo" button in the Control Panel to quickly populate example data.

## 📂 Project Structure

- `control.html/js/css`: The management interface with new timer controls.
- `overlay.html/js/css`: The main broadcast overlay.
- `results.html/js/css`: A dedicated results summary page.
- `timer.html/js/css`: A full-screen timer/countdown page for presentations.
- `assets/`: Contains images like locker-room backgrounds and candidate photos.

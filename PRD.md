# Product Requirements Document (PRD): Project Clock

**Product Name:** Clock
**Document Version:** 1.0
**Target Platforms:** macOS, Windows, Linux (via Tauri)
**Core Technologies:** React, TypeScript, Tauri (Rust backend)

---

## 1. Product Overview

### 1.1 Purpose

Project Clock is a modern, high-performance desktop clock application designed to deliver an Apple-native (HIG-compliant) user experience across multiple operating systems. It aims to replace system-default clock apps by offering a visually stunning, highly responsive interface with zero compromise on system resources.

### 1.2 Target Audience

* Power users who require cross-time-zone tracking for global remote work.
* Productivity enthusiasts utilizing timers (e.g., Pomodoro) and stopwatches for focused work sessions.
* Design-conscious users who prefer Apple's "Liquid Glass" aesthetic and fluid animations over native Windows or Linux UI paradigms.

### 1.3 Success Metrics

* **Performance:** Background memory footprint remains strictly under 50MB; app startup time is under 500ms.
* **Reliability:** Zero timer drift when the application is backgrounded, minimized, or when the host OS enters sleep mode.
* **Engagement:** High daily active usage (DAU) of the multi-timer and world clock modules.

---

## 2. Functional Requirements

The application is divided into five core modules.

### 2.1 World Clock

Users must be able to view, add, and organize multiple time zones globally.

* **City Search:** A localized search index to add global cities.
* **Relative Time Display:** Show hours ahead/behind the user's local system time.
* **Dynamic Visuals:** Clock faces (analog/digital) must automatically invert to a dark/light theme based on whether it is daytime or nighttime in the target city (6:00 AM to 6:00 PM local).
* **Reordering:** Drag-and-drop support to rearrange the order of displayed cities.

### 2.2 Alarms

A highly reliable alarm system utilizing system-level notifications and audio.

* **Scheduling:** Set time, specific days (recurring), and an optional text label.
* **Audio:** Select from a predefined set of modern, high-fidelity notification sounds.
* **Snooze Logic:** Configurable snooze durations (default: 9 minutes).
* **State Management:** Alarms must persist through application restarts and system reboots (saving state to local disk).

### 2.3 Stopwatch

A precision tracking tool for continuous elapsed time.

* **Core Actions:** Start, Stop, Resume, Reset.
* **Lap Tracking:** Record an unlimited number of laps without stopping the main timer.
* **Lap Analytics:** Real-time UI highlighting (e.g., green for fastest lap, red for slowest lap) updated dynamically as new laps are recorded.
* **Precision:** Display down to the hundredth of a second (00:00.00).

### 2.4 Timers

Support for multiple concurrent countdowns.

* **Multi-Timer Support:** Run up to 6 distinct timers simultaneously, each with custom labels.
* **Presets:** 1-minute, 5-minute, 10-minute, and 30-minute quick-start buttons.
* **Visual Progress:** Each timer must display a fluid, non-stuttering circular progress ring tracking the percentage of time remaining.
* **Completion State:** Upon reaching 00:00, trigger a continuous system notification and audio loop until manually dismissed by the user.

### 2.5 Sleep / Bedtime Planner

A visual tool to calculate sleep cycles.

* **Interactive Dial:** A circular slider allowing the user to set a wake-up time and bedtime in one continuous motion.
* **Sleep Duration:** Automatically calculate and display the total sleep duration in the center of the dial.
* **Insights:** Visual warnings if the selected sleep duration falls below 7 hours or exceeds 10 hours.

---

## 3. Non-Functional & Technical Requirements

### 3.1 Architecture & Stack

* **App Shell:** Tauri. Must utilize native OS WebViews to keep binary size under 10MB.
* **Frontend:** React or Vue, strictly utilizing TypeScript (`strict: true` in `tsconfig.json`).
* **State Management:** Global store (e.g., Zustand or Redux) for managing cross-component states like active alarms or running timers.

### 3.2 Time Engine (Critical Infrastructure)

* **Web Worker Implementation:** The core ticking mechanism must run on a dedicated Web Worker to prevent UI thread blocking.
* **Epoch Comparison:** The app must never rely on `setInterval` counting. All timers and alarms must calculate the delta between `Date.now()` and a saved target epoch timestamp to ensure accuracy if the OS throttles background processes.

### 3.3 Storage & Persistence

* **Local State:** User preferences, alarm schedules, and world clock selections must be serialized and saved to the OS local app data directory (via Tauri filesystem APIs).
* **Schema Validation:** Use Zod or a similar validation library to ensure saved data matches TypeScript interfaces upon application load.

---

## 4. UI/UX & Design System Requirements

The application will strictly adhere to the Apple Human Interface Guidelines (HIG), functioning as a cohesive design system rather than disparate components.

### 4.1 Typography

* **Primary Font:** San Francisco (SF Pro Display for hero numbers, SF Pro Text for labels).
* **Numerals:** All numeric displays (clocks, timers) must use tabular lining (monospaced numbers) to prevent layout shifting during rapid updates.

### 4.2 Material & Styling

* **Vibrancy / Liquid Glass:** Modals, sidebars, and tab bars must utilize CSS backdrop-filters (`backdrop-filter: blur(20px) saturate(150%)`) to create a translucent glass effect over the app background.
* **Dark Mode:** Native OS theme detection. The app must switch between light and dark modes instantly, matching system preferences.

### 4.3 Component Library (Atomic Design)

Developers must build and utilize a strictly typed, reusable component library:

* `Button`: Standardized press states, spring physics on click.
* `Toggle`: iOS-style switch with fluid horizontal translation.
* `WheelPicker`: Inertia-scrolling number picker for setting alarm times.
* `Ring`: SVG-based circular progress indicator.

### 4.4 Motion & Animation

* **Physics-Based Routing:** Transitions between modules (e.g., switching from World Clock to Timer) must use spring physics, not linear CSS durations, to mimic native iOS/macOS fluid behavior.
* **Micro-interactions:** Icons should subtly scale down on press and spring back on release.

---

## 5. Out of Scope (Phase 1)

To ensure timely delivery of a stable v1.0, the following features are deferred:

* Cloud synchronization of alarms/timers across devices.
* Integration with third-party calendar APIs.
* Custom user-uploaded audio files for alarms.
* Mobile application compilation (iOS/Android wrappers).
# Production-Grade Modular Component Architecture & File Specification

> **Document Scope:** Full architectural breakdown, file inventory, type contracts, and component blueprints required to refactor Project Clock from monolithic single-file components into a production-grade, modular, strictly type-checked desktop application.
> 
> **Enforced Engineering Standards:**
> 1. **Zero `null` Policy:** Strictly prohibit `null`. Use `undefined`, optional fields (`?`), discriminated unions, or explicit sentinel objects.
> 2. **Complete Type Checking:** Every component prop, callback, state, and hook return value must have strict TypeScript types. No implicit `any`.
> 3. **Semantic Naming:** Self-documenting variable and function names conforming to domain terminology (e.g., `remainingMilliseconds`, `isAlarmActive`).
> 4. **Production-Grade JSDoc/TSDoc:** Comprehensive documentation for all interfaces, props, methods, and hooks.
> 5. **Standard File Header Banner:** Every file starts with an architectural header comment detailing purpose, lifecycle, state boundaries, and accessibility.

---

## 1. Architectural File Inventory & Directory Structure

```
src/
├── components/
│   ├── ui/                                    # Reusable atomic design primitives
│   │   ├── Button/
│   │   │   ├── Button.tsx                     # Spring-animated press button
│   │   │   ├── types.ts                       # Button variant, size & event types
│   │   │   └── Button.css                     # Encapsulated styles
│   │   ├── Toggle/
│   │   │   ├── Toggle.tsx                     # Accessible iOS-style fluid toggle
│   │   │   ├── types.ts                       # Toggle props & change contract
│   │   │   └── Toggle.css                     # Fluid switch animations
│   │   ├── Modal/
│   │   │   ├── Modal.tsx                      # Liquid glass backdrop overlay & portal
│   │   │   ├── types.ts                       # Focus trap, esc handlers & child slots
│   │   │   └── Modal.css                      # Backdrop blur & scale transitions
│   │   ├── GlassPanel/
│   │   │   ├── GlassPanel.tsx                 # HIG-compliant translucent container
│   │   │   ├── types.ts                       # Blur, opacity & sheen presets
│   │   │   └── GlassPanel.css                 # WebKit backdrop filter styles
│   │   ├── Input/
│   │   │   ├── Input.tsx                      # Typed text/number field with adornments
│   │   │   ├── types.ts                       # Validation states, icons & event types
│   │   │   └── Input.css                      # Focus rings & error styles
│   │   ├── CircularProgress/
│   │   │   ├── CircularProgress.tsx           # Scalable SVG circular progress ring
│   │   │   ├── types.ts                       # Radius, stroke, color & animation types
│   │   │   └── CircularProgress.css           # Hardware-accelerated stroke transitions
│   │   ├── DrumPicker/
│   │   │   ├── DrumPicker.tsx                 # 3D iOS-style inertia drum wheel roller
│   │   │   ├── types.ts                       # Angle, physics, bounds & change types
│   │   │   └── DrumPicker.css                 # 3D perspective & cylindrical transforms
│   │   ├── TimeDisplay/
│   │   │   ├── TimeDisplay.tsx                # Monospaced tabular-lining numerals display
│   │   │   ├── types.ts                       # Granularity, layout & styling modes
│   │   │   └── TimeDisplay.css                # Font-variant-numeric: tabular-nums
│   │   └── Badge/
│   │       ├── Badge.tsx                      # Status, lap highlight & alert pills
│   │       └── types.ts                       # Visual intent variants & sizes
│   │
│   └── layout/                                # Application shell & chrome
│       ├── TitleBar/
│       │   ├── TitleBar.tsx                   # Tauri native window controls & drag region
│       │   ├── types.ts                       # Window action handlers & state contracts
│       │   └── TitleBar.css                   # Custom window title styling
│       ├── Navigation/
│       │   ├── SidebarNavigation.tsx          # Tab bar with icon badges & shortcuts
│       │   ├── types.ts                       # Module descriptors & routing types
│       │   └── SidebarNavigation.css          # Glass navigation rail styles
│       └── Background/
│           ├── DynamicBackground.tsx          # Canvas/layer for solid, gradient, wallpaper
│           └── types.ts                       # Theme mode, opacity & filter options
│
├── modules/                                   # Domain-specific feature modules
│   ├── Clock/
│   │   ├── Clock.tsx                          # Root container for Clock tab
│   │   ├── components/
│   │   │   ├── DigitalClockHero.tsx           # Large hero time layout with seconds
│   │   │   └── DateBanner.tsx                 # Localized date string banner
│   │   └── types.ts                           # Clock presentation options
│   │
│   ├── Alarms/
│   │   ├── Alarms.tsx                         # Root container for Alarms tab
│   │   ├── components/
│   │   │   ├── AlarmCard.tsx                  # Individual alarm item with toggle & delete
│   │   │   ├── AlarmList.tsx                  # Virtualized/scrollable list & empty state
│   │   │   ├── AddAlarmModal.tsx              # Create & edit alarm modal dialogue
│   │   │   ├── DaySelector.tsx                # Multi-select day-of-week pill group
│   │   │   └── AlarmRingerOverlay.tsx         # Full-screen or banner ringing alarm dialog
│   │   ├── hooks/
│   │   │   └── useAlarmTrigger.ts             # Decoupled audio & notification scheduler
│   │   └── types.ts                           # Strict alarm domain entities (no nulls)
│   │
│   ├── Stopwatch/
│   │   ├── Stopwatch.tsx                      # Root container for Stopwatch tab
│   │   ├── components/
│   │   │   ├── StopwatchHero.tsx              # 60fps high-precision elapsed time readout
│   │   │   ├── StopwatchControls.tsx          # Start/Stop/Lap/Reset action button group
│   │   │   ├── LapTable.tsx                   # Scrollable lap history container
│   │   │   └── LapRow.tsx                     # Single lap row with delta & fast/slow badge
│   │   ├── hooks/
│   │   │   └── useStopwatchRaf.ts             # Dedicated 60fps requestAnimationFrame hook
│   │   └── types.ts                           # Lap records & stopwatch state
│   │
│   ├── Timers/                                # Refactoring the 1080-line monolithic file
│   │   ├── Timers.tsx                         # Root container coordinating multi-timers
│   │   ├── components/
│   │   │   ├── TimerCard.tsx                  # Active countdown card with circular ring
│   │   │   ├── TimerGrid.tsx                  # Responsive grid supporting up to 6 timers
│   │   │   ├── TimerPresets.tsx               # Quick-start preset buttons (1m, 5m, etc.)
│   │   │   ├── AddTimerModal.tsx              # Creation modal with 3D DrumPicker
│   │   │   └── TimerRingingOverlay.tsx        # Ringing overlay with dismiss/snooze actions
│   │   ├── hooks/
│   │   │   └── useTimerEngine.ts              # Worker synchronization & audio ring trigger
│   │   └── types.ts                           # Strict timer models & status enums (no nulls)
│   │
│   ├── WorldClock/
│   │   ├── WorldClock.tsx                     # Root container for World Clock
│   │   ├── components/
│   │   │   ├── CityCard.tsx                   # Individual city card with relative offset
│   │   │   ├── CityList.tsx                   # Drag-and-drop sortable city card list
│   │   │   ├── AddCityModal.tsx               # Search modal with fuzzy matching
│   │   │   └── AnalogClockMini.tsx            # SVG mini analog face with day/night theme
│   │   ├── hooks/
│   │   │   ├── useCitySearch.ts               # Debounced search & timezone resolver
│   │   │   └── useSortableCities.ts           # Drag and drop reordering hook (no nulls)
│   │   └── types.ts                           # City, timezone & search result contracts
│   │
│   └── Settings/
│       ├── Settings.tsx                       # Root container for Settings tab
│       ├── components/
│       │   ├── SettingsNav.tsx                # Settings category segmented tab bar
│       │   ├── AppearanceSettings.tsx         # Wallpaper, blur, opacity & gradient controls
│       │   ├── GeneralSettings.tsx            # 24h format, show seconds, primary timezone
│       │   ├── AudioSettings.tsx              # Sound theme, volume slider & test button
│       │   └── ColorPickerRow.tsx             # Color picker with preset swatches
│       └── types.ts                           # Complete settings state definitions
│
└── store/                                     # Zustand state stores refactored for zero nulls
    ├── useAlarmStore.ts                       # Strict alarms persistence & trigger state
    ├── useSettingsStore.ts                    # User preferences & theme state
    ├── useStopwatchStore.ts                   # High-performance stopwatch store
    ├── useTimeStore.ts                        # Master WebWorker tick distributor
    └── useTimerStore.ts                       # Multi-timer store supporting up to 6 timers
```

---

## 2. Standard Production-Grade Top-of-File Header Template

Every TypeScript file in the application must include this standardized top-of-file documentation block:

```typescript
/**
 * ============================================================================
 * File: [FileName.tsx / types.ts / hookName.ts]
 * Module: [Core UI Primitives | Layout | Timers | Alarms | Stopwatch | Settings]
 * Architectural Responsibility:
 *   [Concise description of the single responsibility this file addresses]
 *
 * Design Guidelines & HIG Compliance:
 *   - [Details on Apple HIG alignment, physics, glassmorphism, accessibility]
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<PropsInterface>
 *   - Zero Null Policy: All absence of values modeled via `undefined` or
 *     discriminated union states. No `null` keyword permitted.
 *
 * State & Dependency Boundaries:
 *   - Inputs: [List of props / store selectors]
 *   - Outputs / Events: [List of callbacks / state dispatches]
 *   - Side Effects: [WebWorker subscriptions, RAF loops, audio triggers]
 * ============================================================================
 */
```

---

## 3. Detailed Specifications for Each Modular Component

### 3.1 Shared Atomic UI Component Library (`src/components/ui/`)

---

#### 1. Button Component (`src/components/ui/Button/Button.tsx`)
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: Button.tsx
   * Module: Core UI Primitives
   * Architectural Responsibility:
   *   Universal button component delivering Apple HIG interactive tactile feedback,
   *   spring-scale press states, keyboard accessibility, and loading indicator.
   *
   * Design Guidelines & HIG Compliance:
   *   - Subtle scale-down (0.97) on pointerdown with ease-out spring recovery.
   *   - WCAG 2.1 AA focus rings with contrast-ratio compliance.
   *
   * Type Safety & Null Handling Contract:
   *   - Strictly typed variant enums and size options.
   *   - No null values: Disabled and loading states use explicit booleans.
   * ============================================================================
   */
  ```
* **Strict Type Definition (`types.ts`):**
  ```typescript
  export type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost" | "glass";
  export type ButtonSize = "small" | "medium" | "large" | "icon";

  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    readonly variant?: ButtonVariant;
    readonly size?: ButtonSize;
    readonly isLoading?: boolean;
    readonly leadingIcon?: React.ReactNode;
    readonly trailingIcon?: React.ReactNode;
    readonly children?: React.ReactNode;
  }
  ```
* **Key Invariants:**
  - Prevents click events when `isLoading` or `disabled` is `true`.
  - Encapsulates spring physics via CSS transforms (`active: scale(0.96)`).

---

#### 2. Toggle Component (`src/components/ui/Toggle/Toggle.tsx`)
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: Toggle.tsx
   * Module: Core UI Primitives
   * Architectural Responsibility:
   *   Accessible iOS-style fluid toggle switch with sliding thumb animation,
   *   keyboard navigation (Space/Enter), and screen-reader ARIA states.
   *
   * Type Safety & Null Handling Contract:
   *   - Strict boolean controlled state (`checked: boolean`).
   *   - Optional `id` string for explicit form label association. Zero nulls.
   * ============================================================================
   */
  ```
* **Strict Type Definition (`types.ts`):**
  ```typescript
  export interface ToggleProps {
    readonly id?: string;
    readonly isChecked: boolean;
    readonly onToggleChange: (nextChecked: boolean) => void;
    readonly isDisabled?: boolean;
    readonly accessibleLabel: string;
    readonly description?: string;
  }
  ```

---

#### 3. Modal / Dialog Component (`src/components/ui/Modal/Modal.tsx`)
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: Modal.tsx
   * Module: Core UI Primitives
   * Architectural Responsibility:
   *   High-fidelity liquid glass modal overlay rendered through a React Portal.
   *   Guarantees focus trapping, Escape key dismissal, and backdrop blur.
   *
   * Type Safety & Null Handling Contract:
   *   - Explicit boolean `isOpen`.
   *   - Dismiss event callback `onCloseRequest: () => void`. Zero nulls.
   * ============================================================================
   */
  ```
* **Strict Type Definition (`types.ts`):**
  ```typescript
  export interface ModalProps {
    readonly isOpen: boolean;
    readonly onCloseRequest: () => void;
    readonly title: string;
    readonly description?: string;
    readonly children: React.ReactNode;
    readonly footerActions?: React.ReactNode;
    readonly maxWidthPixels?: number;
  }
  ```

---

#### 4. GlassPanel Component (`src/components/ui/GlassPanel/GlassPanel.tsx`)
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: GlassPanel.tsx
   * Module: Core UI Primitives
   * Architectural Responsibility:
   *   Standardized surface container applying Apple "Liquid Glass" translucency,
   *   backdrop blur, border reflections, and ambient drop shadows.
   *
   * Type Safety & Null Handling Contract:
   *   - Discriminated elevation levels ("flat" | "elevated" | "floating").
   *   - No null values: Fallbacks default to defined theme CSS tokens.
   * ============================================================================
   */
  ```
* **Strict Type Definition (`types.ts`):**
  ```typescript
  export type GlassElevation = "flat" | "elevated" | "floating";

  export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    readonly elevation?: GlassElevation;
    readonly borderSheen?: boolean;
    readonly paddingPixels?: number;
    readonly children: React.ReactNode;
  }
  ```

---

#### 5. CircularProgress Component (`src/components/ui/CircularProgress/CircularProgress.tsx`)
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: CircularProgress.tsx
   * Module: Core UI Primitives
   * Architectural Responsibility:
   *   Resolution-independent SVG circular progress indicator extracted from the
   *   monolithic timers module. Renders background track, animated progress arc,
   *   and optional center child slot without layout stutter.
   *
   * Type Safety & Null Handling Contract:
   *   - Normalized progress ratio strictly constrained from 0.0 to 1.0.
   *   - Optional `trackColor` and `strokeColor` strings. Zero nulls.
   * ============================================================================
   */
  ```
* **Strict Type Definition (`types.ts`):**
  ```typescript
  export interface CircularProgressProps {
    readonly normalizedProgress: number; // 0.0 to 1.0
    readonly diameterPixels: number;
    readonly strokeThickness: number;
    readonly strokeColor: string;
    readonly trackColor?: string;
    readonly isCompleted?: boolean;
    readonly children?: React.ReactNode;
  }
  ```

---

#### 6. DrumPicker Component (`src/components/ui/DrumPicker/DrumPicker.tsx`)
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: DrumPicker.tsx
   * Module: Core UI Primitives
   * Architectural Responsibility:
   *   Authentic iOS 3D cylindrical drum roller for hours/minutes/seconds.
   *   Calculates 3D rotational perspective, inertia momentum scrolling,
   *   and haptic tick points during mouse drag or wheel interaction.
   *
   * Type Safety & Null Handling Contract:
   *   - Strict numeric bounds: `minimumValue: number`, `maximumValue: number`.
   *   - Value update callback: `onSelectedValueChange: (nextValue: number) => void`.
   *   - Zero nulls: Active value always bound to an exact integer.
   * ============================================================================
   */
  ```
* **Strict Type Definition (`types.ts`):**
  ```typescript
  export interface DrumPickerColumnProps {
    readonly selectedValue: number;
    readonly minimumValue: number;
    readonly maximumValue: number;
    readonly stepUnit?: number;
    readonly unitLabel: string;
    readonly onSelectedValueChange: (nextValue: number) => void;
  }

  export interface DrumTimePickerProps {
    readonly hours: number;
    readonly minutes: number;
    readonly seconds: number;
    readonly onTimeChange: (hours: number, minutes: number, seconds: number) => void;
  }
  ```

---

#### 7. TimeDisplay Component (`src/components/ui/TimeDisplay/TimeDisplay.tsx`)
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: TimeDisplay.tsx
   * Module: Core UI Primitives
   * Architectural Responsibility:
   *   Renders high-precision time values with CSS `font-variant-numeric: tabular-nums`
   *   to completely prevent jitter and layout shift during rapid updates.
   *
   * Type Safety & Null Handling Contract:
   *   - Supports distinct formatting modes: "hero-clock" | "stopwatch" | "timer".
   *   - Zero nulls: Optional sub-second milliseconds formatted via explicit types.
   * ============================================================================
   */
  ```
* **Strict Type Definition (`types.ts`):**
  ```typescript
  export type TimeDisplayFormat = "digital-clock" | "stopwatch" | "countdown-timer";

  export interface TimeDisplayProps {
    readonly hours: string;
    readonly minutes: string;
    readonly seconds?: string;
    readonly centiseconds?: string;
    readonly formatMode: TimeDisplayFormat;
    readonly ampmIndicator?: "AM" | "PM";
    readonly fontSizeRem?: number;
  }
  ```

---

### 3.2 Layout & Shell Components (`src/components/layout/`)

---

#### 1. TitleBar Component (`src/components/layout/TitleBar/TitleBar.tsx`)
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: TitleBar.tsx
   * Module: Layout & Window Management
   * Architectural Responsibility:
   *   Custom title bar integrating with the Tauri window API to deliver
   *   native-feeling window dragging, Minimize, Maximize/Restore, and Close controls.
   *
   * Type Safety & Null Handling Contract:
   *   - Interacts with `@tauri-apps/api/window` using typed async handlers.
   *   - Zero nulls: Window maximized state is an explicit boolean.
   * ============================================================================
   */
  ```
* **Strict Type Definition (`types.ts`):**
  ```typescript
  export interface TitleBarProps {
    readonly title: string;
    readonly isMacOsPlatform?: boolean;
    readonly onCustomActionTriggered?: (actionName: string) => void;
  }
  ```

---

#### 2. SidebarNavigation Component (`src/components/layout/Navigation/SidebarNavigation.tsx`)
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: SidebarNavigation.tsx
   * Module: Layout & Navigation
   * Architectural Responsibility:
   *   Primary navigation rail allowing switching between the 6 core application
   *   modules with active indicator pills and badge counts for active timers/alarms.
   *
   * Type Safety & Null Handling Contract:
   *   - Active module identifier bound to strict `AppModuleIdentifier` union.
   *   - Zero nulls: Badge counts are numbers; hidden when 0 or undefined.
   * ============================================================================
   */
  ```
* **Strict Type Definition (`types.ts`):**
  ```typescript
  export type AppModuleIdentifier = 
    | "clock" 
    | "world-clock" 
    | "alarms" 
    | "stopwatch" 
    | "timers" 
    | "settings";

  export interface NavigationItemDescriptor {
    readonly id: AppModuleIdentifier;
    readonly label: string;
    readonly icon: React.ReactNode;
    readonly badgeCount?: number;
  }

  export interface SidebarNavigationProps {
    readonly activeModuleId: AppModuleIdentifier;
    readonly onModuleSelect: (selectedModule: AppModuleIdentifier) => void;
    readonly items: readonly NavigationItemDescriptor[];
  }
  ```

---

#### 3. DynamicBackground Component (`src/components/layout/Background/DynamicBackground.tsx`)
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: DynamicBackground.tsx
   * Module: Layout & Presentation
   * Architectural Responsibility:
   *   Manages background rendering logic (solid color, linear gradient, image)
   *   and translucent backdrop filters decoupled from root application logic.
   *
   * Type Safety & Null Handling Contract:
   *   - Strict `BackgroundMode` union: "solid" | "gradient" | "image".
   *   - Zero nulls: Missing images or gradients fall back to system dark tokens.
   * ============================================================================
   */
  ```
* **Strict Type Definition (`types.ts`):**
  ```typescript
  export type BackgroundMode = "solid" | "gradient" | "image";

  export interface DynamicBackgroundProps {
    readonly mode: BackgroundMode;
    readonly solidColorHex: string;
    readonly gradientFromHex: string;
    readonly gradientToHex: string;
    readonly gradientAngleDegrees: number;
    readonly imageUri?: string;
    readonly isTransparencyEnabled: boolean;
    readonly transparencyPercent: number; // 0..100
    readonly isBlurEnabled: boolean;
    readonly blurRadiusPixels: number;
  }
  ```

---

### 3.3 Domain Feature Modules (`src/modules/*`)

---

#### A. Timers Module (`src/modules/Timers/`)
*Currently a 1,080-line monolithic file containing drum columns, circular rings, audio calls, and presets. Below is the modular breakdown:*

```
src/modules/Timers/
├── Timers.tsx                     # Top-level coordinator for active countdowns
├── components/
│   ├── TimerCard.tsx              # Single timer card (progress ring + actions)
│   ├── TimerGrid.tsx              # Multi-timer grid (up to 6 concurrent timers)
│   ├── TimerPresets.tsx           # Quick-start preset buttons (1m, 5m, 10m, 30m)
│   ├── AddTimerModal.tsx          # Timer creation dialog with 3D DrumPicker
│   └── TimerRingingOverlay.tsx    # Visual alert and dismiss action when timer hits 0
├── hooks/
│   └── useTimerEngine.ts          # Tick distributor & sound loop manager
└── types.ts                       # Strict timer domain models & enums (no nulls)
```

##### 1. `types.ts` (Timers Domain Entity - Zero Nulls)
```typescript
/**
 * ============================================================================
 * File: types.ts
 * Module: Timers Domain Models
 * Architectural Responsibility:
 *   Type definitions for concurrent multi-timer state, presets, and lifecycle.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly typed `TimerStatus` enum.
 *   - Zero null policy: Timestamps are undefined when inactive, never null.
 * ============================================================================
 */

export type TimerStatus = "idle" | "running" | "paused" | "completed";

export interface ActiveTimerEntity {
  readonly id: string;
  readonly label: string;
  readonly totalDurationMilliseconds: number;
  readonly remainingMilliseconds: number;
  readonly targetEpochTimestamp?: number; // undefined when paused or completed
  readonly status: TimerStatus;
  readonly createdAtTimestamp: number;
}

export interface TimerPresetDescriptor {
  readonly id: string;
  readonly label: string;
  readonly durationMilliseconds: number;
}

export interface FormattedTimeUnits {
  readonly hours: string;
  readonly minutes: string;
  readonly seconds: string;
  readonly totalRemainingSeconds: number;
}
```

##### 2. `TimerCard.tsx`
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: TimerCard.tsx
   * Module: Timers
   * Architectural Responsibility:
   *   Displays an individual timer instance with its animated CircularProgress ring,
   *   formatted countdown digits, label, and pause/resume/cancel controls.
   *
   * Type Safety & Null Handling Contract:
   *   - Strictly typed `ActiveTimerEntity` prop.
   *   - Zero nulls: Action callbacks are typed event dispatches.
   * ============================================================================
   */
  ```
* **Strict Type Definition:**
  ```typescript
  export interface TimerCardProps {
    readonly timer: ActiveTimerEntity;
    readonly onPauseRequested: (timerId: string) => void;
    readonly onResumeRequested: (timerId: string) => void;
    readonly onResetRequested: (timerId: string) => void;
    readonly onDeleteRequested: (timerId: string) => void;
  }
  ```

##### 3. `AddTimerModal.tsx`
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: AddTimerModal.tsx
   * Module: Timers
   * Architectural Responsibility:
   *   Modal dialogue hosting the 3D DrumPicker for hours, minutes, and seconds,
   *   an optional label input field, and confirmation actions.
   *
   * Type Safety & Null Handling Contract:
   *   - Create callback: `onCreateTimer: (durationMs: number, label: string) => void`.
   *   - Zero nulls: Modal open state is boolean.
   * ============================================================================
   */
  ```
* **Strict Type Definition:**
  ```typescript
  export interface AddTimerModalProps {
    readonly isOpen: boolean;
    readonly onCloseRequest: () => void;
    readonly onCreateTimer: (durationMilliseconds: number, label: string) => void;
  }
  ```

##### 4. `useTimerEngine.ts`
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: useTimerEngine.ts
   * Module: Timers
   * Architectural Responsibility:
   *   Custom hook that syncs active timers with the central WebWorker tick,
   *   calculates delta epochs against `targetEpochTimestamp`, and triggers
   *   the audio alarm loop when remaining milliseconds reach 0.
   *
   * Type Safety & Null Handling Contract:
   *   - Returns strictly typed timer state and bound dispatcher methods.
   *   - Zero nulls: Timers collection is `readonly ActiveTimerEntity[]`.
   * ============================================================================
   */
  ```

---

#### B. Alarms Module (`src/modules/Alarms/`)
```
src/modules/Alarms/
├── Alarms.tsx                     # Top-level Alarms tab coordinator
├── components/
│   ├── AlarmCard.tsx              # Single alarm item with toggle & options
│   ├── AlarmList.tsx              # Alarm items list & empty state
│   ├── AddAlarmModal.tsx          # Modal for configuring time, label & recurring days
│   ├── DaySelector.tsx            # Sun-Sat day picker pill group
│   └── AlarmRingerOverlay.tsx     # Full-screen active ringing overlay
├── hooks/
│   └── useAlarmTrigger.ts         # Hook evaluating alarms against current epoch
└── types.ts                       # Alarm interfaces & weekday enums (no nulls)
```

##### 1. `types.ts` (Alarms Domain Entity - Zero Nulls)
```typescript
/**
 * ============================================================================
 * File: types.ts
 * Module: Alarms Domain Models
 * Architectural Responsibility:
 *   Domain models for alarms, repeating day schedules, and snooze state.
 *
 * Type Safety & Null Handling Contract:
 *   - Weekday index strictly typed (0 = Sunday ... 6 = Saturday).
 *   - Zero null policy: Optional snooze timestamp modeled as `snoozedUntilTimestamp?: number`.
 * ============================================================================
 */

export type WeekDayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface AlarmEntity {
  readonly id: string;
  readonly timeString24Hour: string; // "HH:mm" format
  readonly label: string;
  readonly isActive: boolean;
  readonly recurringDays: readonly WeekDayIndex[]; // Empty array = one-time alarm
  readonly soundThemeName: string;
  readonly snoozedUntilTimestamp?: number; // undefined when not snoozed
  readonly lastTriggeredTimestamp?: number;
}

export interface CreateAlarmInput {
  readonly timeString24Hour: string;
  readonly label: string;
  readonly recurringDays: readonly WeekDayIndex[];
  readonly soundThemeName: string;
}
```

##### 2. `AlarmCard.tsx`
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: AlarmCard.tsx
   * Module: Alarms
   * Architectural Responsibility:
   *   Renders an individual alarm with formatted 12h/24h digits, label, recurring
   *   day badges, Toggle switch for active state, and delete action.
   *
   * Type Safety & Null Handling Contract:
   *   - Strictly typed `AlarmEntity` prop.
   *   - Zero nulls: Action callbacks dispatch specific alarm ID strings.
   * ============================================================================
   */
  ```
* **Strict Type Definition:**
  ```typescript
  export interface AlarmCardProps {
    readonly alarm: AlarmEntity;
    readonly use24HourFormat: boolean;
    readonly onToggleAlarmActive: (alarmId: string, nextActive: boolean) => void;
    readonly onDeleteAlarm: (alarmId: string) => void;
  }
  ```

##### 3. `DaySelector.tsx`
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: DaySelector.tsx
   * Module: Alarms
   * Architectural Responsibility:
   *   Pill-group selector for Sunday through Saturday with toggle mechanics
   *   for scheduling recurring alarms.
   *
   * Type Safety & Null Handling Contract:
   *   - Selected days typed as `readonly WeekDayIndex[]`.
   *   - Zero nulls: Change handler passes sanitized array of selected days.
   * ============================================================================
   */
  ```
* **Strict Type Definition:**
  ```typescript
  export interface DaySelectorProps {
    readonly selectedDays: readonly WeekDayIndex[];
    readonly onDaysSelectionChange: (nextDays: readonly WeekDayIndex[]) => void;
  }
  ```

---

#### C. Stopwatch Module (`src/modules/Stopwatch/`)
```
src/modules/Stopwatch/
├── Stopwatch.tsx                  # Root Stopwatch tab coordinator
├── components/
│   ├── StopwatchHero.tsx          # Large tabular numbers readout
│   ├── StopwatchControls.tsx      # Start/Stop, Lap, Reset button bar
│   ├── LapTable.tsx               # Virtualized/scrollable lap records table
│   └── LapRow.tsx                 # Individual lap row with delta & fast/slow badge
├── hooks/
│   └── useStopwatchRaf.ts         # High-precision 60fps RAF loop
└── types.ts                       # Lap analytics and timer state types
```

##### 1. `types.ts` (Stopwatch Domain Entity - Zero Nulls)
```typescript
/**
 * ============================================================================
 * File: types.ts
 * Module: Stopwatch Domain Models
 * Architectural Responsibility:
 *   Type definitions for high-precision stopwatch timekeeping and lap analytics.
 *
 * Type Safety & Null Handling Contract:
 *   - Laps typed with delta times and analytical flags ("fastest" | "slowest" | "standard").
 *   - Zero nulls: Timestamps undefined when not running.
 * ============================================================================
 */

export type LapClassification = "fastest" | "slowest" | "standard";

export interface LapRecord {
  readonly lapNumber: number;
  readonly lapTimeMilliseconds: number;
  readonly totalTimeMilliseconds: number;
  readonly classification: LapClassification;
}

export interface StopwatchState {
  readonly isRunning: boolean;
  readonly startEpochTimestamp?: number;
  readonly accumulatedMilliseconds: number;
  readonly laps: readonly LapRecord[];
}
```

##### 2. `StopwatchHero.tsx`
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: StopwatchHero.tsx
   * Module: Stopwatch
   * Architectural Responsibility:
   *   Hero display rendering minutes, seconds, and centiseconds with tabular numbers
   *   to guarantee zero layout shifts at 60 frames per second.
   *
   * Type Safety & Null Handling Contract:
   *   - Accepts numeric `elapsedMilliseconds: number`.
   *   - Zero nulls: Formatted strings guaranteed non-null.
   * ============================================================================
   */
  ```
* **Strict Type Definition:**
  ```typescript
  export interface StopwatchHeroProps {
    readonly elapsedMilliseconds: number;
  }
  ```

##### 3. `LapRow.tsx`
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: LapRow.tsx
   * Module: Stopwatch
   * Architectural Responsibility:
   *   Displays single lap record with automatic color highlighting for fastest
   *   (green) and slowest (red) lap times adhering to HIG data visualization.
   *
   * Type Safety & Null Handling Contract:
   *   - Strictly typed `LapRecord` prop.
   *   - Zero nulls: Classification is an explicit string literal union.
   * ============================================================================
   */
  ```
* **Strict Type Definition:**
  ```typescript
  export interface LapRowProps {
    readonly lap: LapRecord;
  }
  ```

---

#### D. World Clock Module (`src/modules/WorldClock/`)
```
src/modules/WorldClock/
├── WorldClock.tsx                 # Root World Clock coordinator
├── components/
│   ├── CityCard.tsx               # City card displaying local time & relative offset
│   ├── CityList.tsx               # Drag-and-drop sortable list of tracked cities
│   ├── AddCityModal.tsx           # Search dialog with fuzzy IANA timezone matching
│   └── AnalogClockMini.tsx        # Mini analog clock face with day/night contrast
├── hooks/
│   ├── useCitySearch.ts           # Debounced search & timezone filter hook
│   └── useSortableCities.ts       # Drag and drop reordering hook (no nulls)
└── types.ts                       # City entity & timezone metadata contracts
```

##### 1. `types.ts` (World Clock Domain Entity - Zero Nulls)
```typescript
/**
 * ============================================================================
 * File: types.ts
 * Module: World Clock Domain Models
 * Architectural Responsibility:
 *   Type definitions for global city time tracking, relative time calculation,
 *   and search indexing.
 *
 * Type Safety & Null Handling Contract:
 *   - Zero null policy: Drag state uses undefined or explicit indices, never null.
 *   - Search state returns empty array `readonly CitySearchResult[]` on no match.
 * ============================================================================
 */

export interface TrackedCityEntity {
  readonly id: string;
  readonly cityName: string;
  readonly timezoneIana: string; // e.g., "America/New_York"
  readonly countryName?: string;
  readonly displayOrder: number;
}

export interface CityTimeCalculation {
  readonly formattedTime: string;
  readonly formattedDate: string;
  readonly relativeHoursOffset: number; // e.g. +5, -3, 0
  readonly relativeDayLabel: "Today" | "Yesterday" | "Tomorrow";
  readonly isDaytime: boolean; // 6:00 AM to 6:00 PM local
}

export interface DragDropOrderState {
  readonly draggedIndex?: number;
  readonly hoverTargetIndex?: number;
}
```

##### 2. `CityCard.tsx`
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: CityCard.tsx
   * Module: World Clock
   * Architectural Responsibility:
   *   Renders an individual tracked city with dynamic day/night styling, relative
   *   time difference badge (+/- hrs), formatted local time, and mini analog face.
   *
   * Type Safety & Null Handling Contract:
   *   - Strictly typed `TrackedCityEntity` and master epoch `currentEpochMilliseconds`.
   *   - Zero nulls: Action callbacks pass explicit city ID strings.
   * ============================================================================
   */
  ```
* **Strict Type Definition:**
  ```typescript
  export interface CityCardProps {
    readonly city: TrackedCityEntity;
    readonly currentEpochMilliseconds: number;
    readonly use24HourFormat: boolean;
    readonly onDeleteCity: (cityId: string) => void;
    readonly dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  }
  ```

---

#### E. Settings Module (`src/modules/Settings/`)
```
src/modules/Settings/
├── Settings.tsx                   # Settings root container
├── components/
│   ├── SettingsNav.tsx            # Category tab selector (General, Appearance, Audio)
│   ├── AppearanceSettings.tsx     # Wallpaper, gradient, blur, and opacity controls
│   ├── GeneralSettings.tsx        # 24-hour mode, seconds visibility, default timezone
│   ├── AudioSettings.tsx          # Sound theme selector, volume slider & test button
│   └── ColorPickerRow.tsx         # Color input with predefined HIG palette swatches
└── types.ts                       # Complete settings schema & preference types
```

##### 1. `types.ts` (Settings Schema - Zero Nulls)
```typescript
/**
 * ============================================================================
 * File: types.ts
 * Module: Settings Domain Models
 * Architectural Responsibility:
 *   Type definitions for user preferences, appearance customization, and audio themes.
 *
 * Type Safety & Null Handling Contract:
 *   - String literal unions for all discrete preferences.
 *   - Zero null policy: Default fallback values guaranteed on all properties.
 * ============================================================================
 */

export type SettingsTabId = "appearance" | "general" | "audio" | "about";
export type BackgroundModeType = "solid" | "gradient" | "image";
export type SoundThemeIdentifier = "bell" | "digital" | "gentle" | "marimba" | "chime";

export interface UserPreferencesSchema {
  readonly use24HourFormat: boolean;
  readonly showSeconds: boolean;
  readonly defaultTimezoneIana: string;
  readonly backgroundMode: BackgroundModeType;
  readonly solidColorHex: string;
  readonly gradientFromHex: string;
  readonly gradientToHex: string;
  readonly gradientAngleDegrees: number;
  readonly backgroundImageUri?: string;
  readonly isTransparencyEnabled: boolean;
  readonly transparencyPercent: number; // 0..100
  readonly isBlurEnabled: boolean;
  readonly blurRadiusPixels: number; // 0..40
  readonly soundTheme: SoundThemeIdentifier;
  readonly alertVolumePercent: number; // 0..100
}
```

##### 2. `AppearanceSettings.tsx`
* **Header Comment:**
  ```typescript
  /**
   * ============================================================================
   * File: AppearanceSettings.tsx
   * Module: Settings
   * Architectural Responsibility:
   *   Form section managing desktop customization: solid vs gradient vs image modes,
   *   liquid glass transparency sliders, and backdrop blur strength.
   *
   * Type Safety & Null Handling Contract:
   *   - Strictly typed preference subset and update handlers.
   *   - Zero nulls: Numeric slider values clamped to explicit range bounds.
   * ============================================================================
   */
  ```

---

## 4. Zustand Stores Refactoring Specifications (Zero `null`s)

### 4.1 `useTimerStore.ts` Refactoring
- **Existing Issue:** Currently only supports a single timer, uses `targetTimestamp: number | null` (violating zero-null policy), and is tightly coupled.
- **Refactored Contract:**
  - Support up to 6 concurrent `ActiveTimerEntity` instances.
  - Replace `targetTimestamp: number | null` with `targetEpochTimestamp?: number`.
  - Provide atomic action creators: `createTimer`, `pauseTimer`, `resumeTimer`, `resetTimer`, `deleteTimer`, `dismissRinging`.

### 4.2 `useAlarmStore.ts` Refactoring
- **Existing Issue:** Inline `JSON.parse` from localStorage with unsafe type casting; missing Zod schema validation.
- **Refactored Contract:**
  - Strict `AlarmEntity` collection where snooze state is `snoozedUntilTimestamp?: number` (undefined when inactive).
  - Safe hydration with validation to prevent runtime crash if localStorage is corrupted.

### 4.3 `useStopwatchStore.ts` Refactoring
- **Existing Issue:** Untyped lap records without fastest/slowest analytical highlighting.
- **Refactored Contract:**
  - Immutable lap calculations calculating fastest/slowest badges dynamically on each lap record.

---

## 5. Verification & Implementation Roadmap

| Phase | Milestone | Deliverables | Status | Verification Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | **Shared Atomic UI Library** | `Button`, `Toggle`, `Modal`, `GlassPanel`, `CircularProgress`, `DrumPicker`, `TimeDisplay`, `Badge` | **COMPLETED** | Verified with zero TypeScript errors (`tsc --noEmit`), strict props contracts, zero nulls. |
| **Phase 2** | **Multi-Timer Deconstruction** | Split 1080-line `Timers.tsx` into `TimerCard`, `TimerGrid`, `TimerPresets`, `AddTimerModal`, `useTimerEngine` | **COMPLETED** | Verified concurrent countdown of up to 6 timers without CPU stutter; 0 nulls; 60fps RAF. |
| **Phase 3** | **Alarms & World Clock Split** | Deconstruct `Alarms.tsx` and `WorldClock.tsx` into modular cards, modal dialogs, and custom hooks | **COMPLETED** | Verified drag-and-drop without null states; recurring alarm trigger & snooze; day/night analog face. |
| **Phase 4** | **Settings, Stopwatch & Layout** | Extract `TitleBar`, `SidebarNavigation`, `DynamicBackground`, `Settings`, `Stopwatch`, and `Clock` | **COMPLETED** | Verified window dragging & controls, lap analytics, appearance controls, and zero nulls across entire repo. |
| **Phase 5** | **Store & Storage Hardening** | Refactor all Zustand stores for zero nulls and schema validation | **COMPLETED** | All 5 Zustand stores and background workers refactored for 100% null-safety and safe persistence. |


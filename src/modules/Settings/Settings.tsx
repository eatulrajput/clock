import React from "react";
import { useSettingsStore, BgMode } from "../../store/useSettingsStore";
import { RotateCcw } from "lucide-react";

/* ───────────── reusable setting row components ──────────── */

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  noBorder?: boolean;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, description, checked, onChange, noBorder }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 0",
    borderBottom: noBorder ? "none" : "1px solid var(--glass-border)",
  }}>
    <div>
      <div style={{ fontSize: "1.05rem", fontWeight: 500 }}>{label}</div>
      {description && (
        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
          {description}
        </div>
      )}
    </div>
    <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer", position: "relative" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ opacity: 0, position: "absolute", zIndex: -1 }}
      />
      <div style={{
        width: "50px",
        height: "30px",
        borderRadius: "15px",
        background: checked ? "var(--accent-color)" : "rgba(128,128,128,0.3)",
        transition: "background 0.3s",
        position: "relative",
      }}>
        <div style={{
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          background: "#FFF",
          position: "absolute",
          top: "2px",
          left: checked ? "22px" : "2px",
          transition: "left 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }} />
      </div>
    </label>
  </div>
);

interface SliderRowProps {
  label: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  noBorder?: boolean;
}

const SliderRow: React.FC<SliderRowProps> = ({ label, description, value, min, max, step = 1, unit = "", onChange, noBorder }) => (
  <div style={{
    padding: "16px 0",
    borderBottom: noBorder ? "none" : "1px solid var(--glass-border)",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
      <div>
        <div style={{ fontSize: "1.05rem", fontWeight: 500 }}>{label}</div>
        {description && (
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            {description}
          </div>
        )}
      </div>
      <span style={{
        fontSize: "1rem",
        fontWeight: 600,
        color: "var(--accent-color)",
        fontVariantNumeric: "tabular-nums",
        minWidth: "50px",
        textAlign: "right",
      }}>
        {value}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        width: "100%",
        accentColor: "var(--accent-color)",
        height: "6px",
        cursor: "pointer",
      }}
    />
  </div>
);

/* ────────────── color picker row ────────────── */

interface ColorRowProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  noBorder?: boolean;
}

const ColorRow: React.FC<ColorRowProps> = ({ label, value, onChange, noBorder }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 0",
    borderBottom: noBorder ? "none" : "1px solid var(--glass-border)",
  }}>
    <div style={{ fontSize: "1.05rem", fontWeight: 500 }}>{label}</div>
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span style={{
        fontSize: "0.85rem",
        color: "var(--text-secondary)",
        fontFamily: "monospace",
        textTransform: "uppercase",
      }}>
        {value}
      </span>
      <label style={{ cursor: "pointer", position: "relative" }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            opacity: 0,
            position: "absolute",
            width: "100%",
            height: "100%",
            cursor: "pointer",
          }}
        />
        <div style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: value,
          border: "2px solid var(--glass-border)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          transition: "transform 0.15s",
        }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </label>
    </div>
  </div>
);

/* ────────────── segment picker row ────────────── */

interface SegmentRowProps {
  label: string;
  description?: string;
  options: { value: string; label: string }[];
  selected: string;
  onChange: (val: string) => void;
}

const SegmentRow: React.FC<SegmentRowProps> = ({ label, description, options, selected, onChange }) => (
  <div style={{
    padding: "16px 0",
    borderBottom: "1px solid var(--glass-border)",
  }}>
    <div style={{ marginBottom: "12px" }}>
      <div style={{ fontSize: "1.05rem", fontWeight: 500 }}>{label}</div>
      {description && (
        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
          {description}
        </div>
      )}
    </div>
    <div style={{
      display: "flex",
      background: "rgba(128,128,128,0.12)",
      borderRadius: "10px",
      padding: "3px",
    }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1,
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
            background: selected === opt.value ? "var(--accent-color)" : "transparent",
            color: selected === opt.value ? "#FFF" : "var(--text-secondary)",
            boxShadow: selected === opt.value ? "0 2px 8px rgba(10,132,255,0.3)" : "none",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div style={{ marginBottom: "32px" }}>
    <h3 style={{
      fontSize: "0.8rem",
      fontWeight: 600,
      color: "var(--text-secondary)",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      marginBottom: "8px",
      paddingLeft: "4px",
    }}>
      {title}
    </h3>
    <div className="glass-panel" style={{ padding: "4px 20px" }}>
      {children}
    </div>
  </div>
);

/* ────────────── gradient preview strip ────────────── */

const GradientPreview: React.FC<{ from: string; to: string; angle: number }> = ({ from, to, angle }) => (
  <div style={{
    height: "40px",
    borderRadius: "10px",
    background: `linear-gradient(${angle}deg, ${from}, ${to})`,
    border: "1px solid var(--glass-border)",
    marginTop: "8px",
    marginBottom: "4px",
  }} />
);

/* ───────────────────── main Settings view ───────────────── */

export const Settings: React.FC = () => {
  const {
    use24Hour, snoozeDuration, alarmVolume, showSeconds,
    setUse24Hour, setSnoozeDuration, setAlarmVolume, setShowSeconds,

    transparencyEnabled, transparencyAmount, bgMode, bgColor, bgImageUrl, gradientFrom, gradientTo, gradientAngle,
    blurEnabled, blurAmount,
    setTransparencyEnabled, setTransparencyAmount, setBgMode, setBgColor, setBgImageUrl, setGradientFrom, setGradientTo,
    setGradientAngle, setBlurEnabled, setBlurAmount,

    resetAll,
  } = useSettingsStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", paddingRight: "8px" }}>
      <h2 className="text-title">Settings</h2>

      {/* Appearance */}
      <Section title="Appearance">
        <ToggleRow
          label="Transparent Background"
          description="Allow the desktop to show through the app window"
          checked={transparencyEnabled}
          onChange={setTransparencyEnabled}
        />

        {transparencyEnabled && (
          <SliderRow
            label="Transparency"
            description="Adjust how see-through the background is"
            value={transparencyAmount}
            min={0}
            max={100}
            unit="%"
            onChange={setTransparencyAmount}
          />
        )}

        <SegmentRow
          label="Background Mode"
          description="Choose solid color or gradient background"
          options={[
            { value: "solid", label: "Solid" },
            { value: "gradient", label: "Gradient" },
            { value: "image", label: "Image" },
          ]}
          selected={bgMode}
          onChange={(val) => setBgMode(val as BgMode)}
        />

        {bgMode === "solid" && (
          <ColorRow
            label="Background Color"
            value={bgColor}
            onChange={setBgColor}
          />
        )}
        
        {bgMode === "image" && (
          <div style={{ padding: "16px 0", borderBottom: "1px solid var(--glass-border)" }}>
            <div style={{ fontSize: "1.05rem", fontWeight: 500, marginBottom: "8px" }}>Image URL</div>
            <input
              type="text"
              value={bgImageUrl}
              onChange={(e) => setBgImageUrl(e.target.value)}
              placeholder="https://example.com/wallpaper.jpg"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid var(--glass-border)",
                background: "rgba(0,0,0,0.1)",
                color: "var(--text-primary)",
                fontFamily: "inherit"
              }}
            />
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "8px" }}>
              Leave the OS background behind, or place an image here for a true inner-app blur effect.
            </div>
          </div>
        )}

        {bgMode === "gradient" && (
          <>
            <ColorRow
              label="Gradient Start"
              value={gradientFrom}
              onChange={setGradientFrom}
            />
            <ColorRow
              label="Gradient End"
              value={gradientTo}
              onChange={setGradientTo}
            />
            <SliderRow
              label="Gradient Angle"
              value={gradientAngle}
              min={0}
              max={360}
              unit="°"
              onChange={setGradientAngle}
            />
            <GradientPreview from={gradientFrom} to={gradientTo} angle={gradientAngle} />
          </>
        )}

        <ToggleRow
          label="Backdrop Filter"
          description="Apply backdrop filter effect to the window background"
          checked={blurEnabled}
          onChange={setBlurEnabled}
        />

        {blurEnabled && (
          <SliderRow
            label="Filter Amount"
            value={blurAmount}
            min={0}
            max={2000}
            unit="px"
            onChange={setBlurAmount}
            noBorder
          />
        )}
      </Section>

      {/* General */}
      <Section title="General">
        <ToggleRow
          label="24-Hour Time"
          description="Use 24-hour format across all modules"
          checked={use24Hour}
          onChange={setUse24Hour}
        />
        <ToggleRow
          label="Show Seconds"
          description="Display seconds in World Clock"
          checked={showSeconds}
          onChange={setShowSeconds}
          noBorder
        />
      </Section>

      {/* Alarms */}
      <Section title="Alarms">
        <SliderRow
          label="Snooze Duration"
          description="How long before a snoozed alarm rings again"
          value={snoozeDuration}
          min={1}
          max={30}
          unit=" min"
          onChange={setSnoozeDuration}
        />
        <SliderRow
          label="Alarm Volume"
          value={alarmVolume}
          min={0}
          max={100}
          unit="%"
          onChange={setAlarmVolume}
          noBorder
        />
      </Section>

      {/* About */}
      <Section title="About">
        <div style={{ padding: "16px 0", borderBottom: "1px solid var(--glass-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "1.05rem", fontWeight: 500 }}>Version</span>
            <span style={{ color: "var(--text-secondary)" }}>0.1.0</span>
          </div>
        </div>
        <div style={{ padding: "16px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "1.05rem", fontWeight: 500 }}>Built with</span>
            <span style={{ color: "var(--text-secondary)" }}>Tauri + React</span>
          </div>
        </div>
      </Section>

      {/* Reset */}
      <button
        onClick={resetAll}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "14px 24px",
          borderRadius: "12px",
          border: "none",
          background: "rgba(255, 59, 48, 0.1)",
          color: "#FF3B30",
          fontSize: "0.95rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
          marginBottom: "24px",
          alignSelf: "center",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255, 59, 48, 0.2)")}
        onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255, 59, 48, 0.1)")}
      >
        <RotateCcw size={16} />
        Reset All Settings
      </button>
    </div>
  );
};

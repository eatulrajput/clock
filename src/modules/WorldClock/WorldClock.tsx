import React, { useState, useEffect, useMemo } from "react";
import { useTimeStore } from "../../store/useTimeStore";
import { Plus, GripVertical, X, Search } from "lucide-react";

interface City {
  id: string;
  name: string;
  timezone: string;
}

const getLocalTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

// Fetch all IANA timezones supported by the environment.
const allTimezones = (() => {
  try {
    return (Intl as any).supportedValuesOf("timeZone") as string[];
  } catch (e) {
    return [getLocalTimezone(), "America/New_York", "Europe/London", "Asia/Tokyo", "Australia/Sydney"];
  }
})();

// Format "America/New_York" -> "New York"
const formatTimezoneName = (tz: string) => {
  const parts = tz.split("/");
  return parts[parts.length - 1].replace(/_/g, " ");
};

const DEFAULT_CITIES: City[] = [
  { id: "local", name: "Local Time", timezone: getLocalTimezone() },
  { id: "ny", name: "New York", timezone: "America/New_York" },
  { id: "tokyo", name: "Tokyo", timezone: "Asia/Tokyo" },
];

export const WorldClock: React.FC = () => {
  const now = useTimeStore((state) => state.now);
  const [cities, setCities] = useState<City[]>(() => {
    const saved = localStorage.getItem("clock_cities");
    return saved ? JSON.parse(saved) : DEFAULT_CITIES;
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // Save on change
  useEffect(() => {
    localStorage.setItem("clock_cities", JSON.stringify(cities));
  }, [cities]);

  // Search Results Memoization
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return allTimezones
      .filter((tz) => tz.toLowerCase().includes(q) || formatTimezoneName(tz).toLowerCase().includes(q))
      .slice(0, 15) // Limit to top 15 results
      .map(tz => ({
        id: tz,
        name: formatTimezoneName(tz),
        timezone: tz
      }));
  }, [searchQuery]);

  const addCity = (city: City) => {
    if (cities.find(c => c.id === city.id)) return;
    setCities([...cities, city]);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const removeCity = (id: string) => {
    setCities(cities.filter((c) => c.id !== id));
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
    // Required for some webkit/gecko environments to register the drag
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Necessary to allow dropping
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx !== null && draggedIdx !== index) {
      const newCities = [...cities];
      const draggedItem = newCities[draggedIdx];
      newCities.splice(draggedIdx, 1);
      newCities.splice(index, 0, draggedItem);
      setCities(newCities);
    }
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", height: "100%", overflowY: "auto", paddingRight: "12px", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10, paddingBottom: "12px" }}>
        <h2 className="text-title" style={{ marginBottom: 0 }}>World Clock</h2>
        <button 
          onClick={() => setIsSearchOpen(true)}
          style={{ background: "transparent", border: "none", color: "var(--accent-color)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", borderRadius: "50%" }}>
          <Plus size={28} />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "40px" }}>
        {cities.map((city, index) => {
          const date = new Date(now);
          const timeString = date.toLocaleTimeString("en-US", {
            timeZone: city.timezone,
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          
          const hourInCity = parseInt(date.toLocaleTimeString("en-US", { timeZone: city.timezone, hour: "numeric", hour12: false }), 10);
          const isDaytime = hourInCity >= 6 && hourInCity < 18;
          
          // Determine visual drop indicator
          const isDragTarget = dragOverIdx === index && draggedIdx !== index;
          const dropPosition = isDragTarget ? (draggedIdx !== null && draggedIdx > index ? "top" : "bottom") : null;
          
          return (
            <div 
              key={city.id} 
              className="glass-panel" 
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                background: isDaytime ? "rgba(255, 255, 255, 0.5)" : "rgba(30, 30, 30, 0.5)",
                color: isDaytime ? "#000" : "#FFF",
                transition: "background 0.3s ease, color 0.3s ease, transform 0.2s ease, opacity 0.2s ease, border 0.2s ease",
                opacity: draggedIdx === index ? 0.5 : 1,
                transform: draggedIdx === index ? "scale(0.98)" : "scale(1)",
                position: "relative",
                borderTop: dropPosition === "top" ? "2px solid var(--accent-color)" : "1px solid var(--glass-border)",
                borderBottom: dropPosition === "bottom" ? "2px solid var(--accent-color)" : "1px solid var(--glass-border)",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ cursor: "grab", display: "flex", alignItems: "center" }}>
                  <GripVertical size={20} color={isDaytime ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)"} />
                </div>
                <div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 500 }}>{city.name}</div>
                  <div style={{ color: isDaytime ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    {city.timezone} {isDaytime ? "☀️" : "🌙"}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div className="text-hero" style={{ fontSize: "3rem", fontWeight: 200, minWidth: "150px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {timeString}
                </div>
                <button 
                  onClick={() => removeCity(city.id)}
                  style={{
                    background: "transparent", border: "none", cursor: "pointer", 
                    color: isDaytime ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)",
                    padding: "4px"
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isSearchOpen && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "var(--bg-color)", backdropFilter: "blur(20px) saturate(150%)", zIndex: 50,
          borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Search size={24} color="var(--text-secondary)" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search for a city..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1, background: "transparent", border: "none", fontSize: "1.5rem", 
                color: "var(--text-primary)", outline: "none", fontWeight: 500
              }}
            />
            <button onClick={() => setIsSearchOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
              <X size={28} />
            </button>
          </div>
          
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
            {searchResults.map((city) => (
              <div 
                key={city.id}
                onClick={() => addCity(city)}
                style={{
                  padding: "16px", borderRadius: "8px", background: "rgba(128,128,128,0.1)",
                  cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "rgba(128,128,128,0.2)"}
                onMouseOut={(e) => e.currentTarget.style.background = "rgba(128,128,128,0.1)"}
              >
                <div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 500 }}>{city.name}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{city.timezone}</div>
                </div>
                <div style={{ color: "var(--text-secondary)" }}>
                  {new Date().toLocaleTimeString("en-US", { timeZone: city.timezone, hour: "numeric", minute: "2-digit" })}
                </div>
              </div>
            ))}
            {searchQuery && searchResults.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "40px" }}>
                No cities found matching "{searchQuery}"
              </div>
            )}
            {!searchQuery && (
              <div style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "40px" }}>
                Type to search across global timezones...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

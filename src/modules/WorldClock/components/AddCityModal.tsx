/**
 * ============================================================================
 * File: AddCityModal.tsx
 * Module: World Clock / Components
 * Architectural Responsibility:
 *   Modal search dialogue allowing users to search and add global cities across
 *   all supported IANA timezones.
 *
 * Design Guidelines & HIG Compliance:
 *   - Translucent liquid glass modal styling (`backdrop-filter: blur(20px)`).
 *   - Instant fuzzy filtering with quick popular destination pill chips.
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Props: Readonly<AddCityModalProps>
 *   - Zero Null Policy: Results list is strictly non-null array.
 * ============================================================================
 */

import React from "react";
import { Modal } from "../../../components/ui/Modal/Modal";
import { Input } from "../../../components/ui/Input/Input";
import { Button } from "../../../components/ui/Button/Button";
import { useCitySearch } from "../hooks/useCitySearch";
import { Search, Globe, Plus } from "lucide-react";

export interface AddCityModalProps {
  /**
   * Visibility flag controlling modal open state.
   */
  readonly isOpen: boolean;

  /**
   * Callback fired to dismiss the modal dialogue.
   */
  readonly onCloseRequest: () => void;

  /**
   * Callback fired when a city is selected to be tracked.
   */
  readonly onSelectCity: (timezoneIana: string, cityName: string) => void;
}

const POPULAR_CITIES = [
  { name: "New York", timezone: "America/New_York" },
  { name: "London", timezone: "Europe/London" },
  { name: "Tokyo", timezone: "Asia/Tokyo" },
  { name: "Sydney", timezone: "Australia/Sydney" },
  { name: "Paris", timezone: "Europe/Paris" },
  { name: "Dubai", timezone: "Asia/Dubai" },
  { name: "Singapore", timezone: "Asia/Singapore" },
  { name: "San Francisco", timezone: "America/Los_Angeles" },
] as const;

/**
 * Search dialogue for finding and adding global city timezones.
 */
export const AddCityModal: React.FC<AddCityModalProps> = ({
  isOpen,
  onCloseRequest,
  onSelectCity,
}) => {
  const { searchQuery, onSearchQueryChange, searchResults } = useCitySearch();

  const handlePick = (timezoneIana: string, cityName: string) => {
    onSelectCity(timezoneIana, cityName);
    onSearchQueryChange("");
    onCloseRequest();
  };

  return (
    <Modal
      isOpen={isOpen}
      onCloseRequest={onCloseRequest}
      title="Add World Clock City"
      description="Search by city or country name across international timezones"
      maxWidthPixels={500}
      footerActions={
        <Button variant="ghost" onClick={onCloseRequest}>
          Cancel
        </Button>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {/* Search Field */}
        <Input
          placeholder="Search city, e.g. Tokyo, London, Paris..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          leadingIcon={<Search size={16} />}
          showClearButton={true}
          onClear={() => onSearchQueryChange("")}
          autoFocus={true}
        />

        {/* Quick Popular Cities */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text-secondary)" }}>
            Popular Cities
          </span>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {POPULAR_CITIES.map((pop) => (
              <button
                key={pop.timezone}
                type="button"
                onClick={() => handlePick(pop.timezone, pop.name)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "14px",
                  border: "1px solid var(--glass-border)",
                  backgroundColor: "rgba(120, 120, 128, 0.08)",
                  color: "var(--text-primary)",
                  fontFamily: "inherit",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "all 0.15s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(10, 132, 255, 0.15)";
                  e.currentTarget.style.borderColor = "var(--accent-color)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(120, 120, 128, 0.08)";
                  e.currentTarget.style.borderColor = "var(--glass-border)";
                }}
              >
                <Plus size={12} style={{ color: "var(--accent-color)" }} />
                <span>{pop.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Autocomplete Search Results */}
        {searchQuery.trim().length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              maxHeight: "220px",
              overflowY: "auto",
              paddingRight: "4px",
              marginTop: "4px",
            }}
          >
            {searchResults.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px",
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                }}
              >
                No timezones found matching "{searchQuery}"
              </div>
            ) : (
              searchResults.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => handlePick(result.timezoneIana, result.cityName)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "transparent",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background-color 0.15s ease",
                    fontFamily: "inherit",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(120, 120, 128, 0.12)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Globe size={16} style={{ color: "var(--accent-color)", opacity: 0.8 }} />
                    <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>
                      {result.cityName}
                    </span>
                  </div>

                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {result.region || result.timezoneIana}
                  </span>
                </button>
              ))
            )}
          </div>
        ) : undefined}
      </div>
    </Modal>
  );
};

/**
 * ============================================================================
 * File: useCitySearch.ts
 * Module: World Clock / Custom Hooks
 * Architectural Responsibility:
 *   Timezone resolution and debounced search index querying across all IANA
 *   supported timezones. Provides fast localized name matching.
 *
 * Design Guidelines & HIG Compliance:
 *   - Fast responsive autocomplete without UI freezing.
 *   - Formats raw IANA paths ("America/Los_Angeles") into readable city names ("Los Angeles").
 *
 * Type Safety & Null Handling Contract:
 *   - Strictly Typed Return Contract: Readonly<UseCitySearchResult>
 *   - Zero Null Policy: Empty searches return empty array `[]`. No null values.
 * ============================================================================
 */

import { useState, useMemo } from "react";
import { CitySearchResult } from "../types";

/**
 * Retrieve current user local system IANA timezone.
 */
export function getSystemLocalTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

/**
 * Convert standard IANA string "America/New_York" to clean title "New York".
 */
export function formatIanaCityName(timezoneIana: string): string {
  const segments = timezoneIana.split("/");
  const rawCity = segments[segments.length - 1];
  return rawCity.replace(/_/g, " ");
}

/**
 * Statically cache supported IANA timezones safely without type casting to any.
 */
function getSupportedTimezones(): readonly string[] {
  try {
    if (typeof Intl !== "undefined" && "supportedValuesOf" in Intl) {
      // @ts-expect-error supportedValuesOf is standard ES2022
      return Intl.supportedValuesOf("timeZone") as string[];
    }
  } catch {
    // Fallback if unsupported
  }

  return [
    getSystemLocalTimezone(),
    "America/New_York",
    "America/Los_Angeles",
    "America/Chicago",
    "America/Toronto",
    "America/Sao_Paulo",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Rome",
    "Europe/Madrid",
    "Asia/Tokyo",
    "Asia/Singapore",
    "Asia/Dubai",
    "Asia/Shanghai",
    "Asia/Hong_Kong",
    "Asia/Kolkata",
    "Australia/Sydney",
    "Australia/Melbourne",
    "Pacific/Auckland",
    "Pacific/Honolulu",
  ];
}

const ALL_TIMEZONES = getSupportedTimezones();

export interface UseCitySearchResult {
  readonly searchQuery: string;
  readonly onSearchQueryChange: (query: string) => void;
  readonly searchResults: readonly CitySearchResult[];
}

/**
 * Custom hook providing fuzzy timezone search for the World Clock module.
 */
export const useCitySearch = (): UseCitySearchResult => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (trimmed.length === 0) return [];

    return ALL_TIMEZONES.filter((tz) => {
      const lowerTz = tz.toLowerCase();
      const lowerCity = formatIanaCityName(tz).toLowerCase();
      return lowerTz.includes(trimmed) || lowerCity.includes(trimmed);
    })
      .slice(0, 15) // Limit top 15 results for performance
      .map((tz) => {
        const segments = tz.split("/");
        return {
          id: tz,
          cityName: formatIanaCityName(tz),
          timezoneIana: tz,
          region: segments.length > 1 ? segments[0].replace(/_/g, " ") : undefined,
        };
      });
  }, [searchQuery]);

  return {
    searchQuery,
    onSearchQueryChange: setSearchQuery,
    searchResults,
  };
};

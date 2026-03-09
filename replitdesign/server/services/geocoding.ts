/**
 * Geocoding service — resolves a street address to coordinates.
 * Uses Google Maps Geocoding API when GOOGLE_MAPS_API_KEY is set,
 * otherwise falls back to OpenStreetMap Nominatim (free, no key required).
 */

export interface GeocodingResult {
  resolvedAddress: string;
  lat: number;
  lon: number;
}

/** Rate-limit guard for Nominatim (max 1 req/sec per TOS) */
let lastNominatimCall = 0;

async function geocodeWithNominatim(address: string): Promise<GeocodingResult> {
  // Enforce 1 req/sec rate limit
  const now = Date.now();
  const elapsed = now - lastNominatimCall;
  if (elapsed < 1000) {
    await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
  }
  lastNominatimCall = Date.now();

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", address);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("addressdetails", "1");

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "SitemapApp/1.0" },
  });

  if (!res.ok) {
    throw new Error(`Nominatim request failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as Array<{
    display_name: string;
    lat: string;
    lon: string;
  }>;

  if (!data.length) {
    throw new Error("Address not found. Please check the address and try again.");
  }

  const result = data[0];
  return {
    resolvedAddress: result.display_name,
    lat: parseFloat(result.lat),
    lon: parseFloat(result.lon),
  };
}

export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // No Google API key — use Nominatim (free OSM geocoder)
  if (!apiKey) {
    return geocodeWithNominatim(address);
  }

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Geocoding request failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as {
    status: string;
    results: Array<{
      formatted_address: string;
      geometry: { location: { lat: number; lng: number } };
    }>;
    error_message?: string;
  };

  switch (data.status) {
    case "OK":
      break;
    case "ZERO_RESULTS":
      throw new Error("Address not found. Please check the address and try again.");
    case "REQUEST_DENIED":
      throw new Error("Geocoding request denied. Check API key configuration.");
    case "OVER_QUERY_LIMIT":
      throw new Error("Geocoding quota exceeded. Please try again later.");
    default:
      throw new Error(
        `Geocoding error: ${data.status}${data.error_message ? ` — ${data.error_message}` : ""}`,
      );
  }

  const result = data.results[0];
  return {
    resolvedAddress: result.formatted_address,
    lat: result.geometry.location.lat,
    lon: result.geometry.location.lng,
  };
}

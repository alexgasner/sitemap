/**
 * Geocoding service — resolves a street address to coordinates.
 * Uses Google Maps Geocoding API when GOOGLE_MAPS_API_KEY is set.
 * Falls through gracefully when no key is configured.
 */

export interface GeocodingResult {
  resolvedAddress: string;
  lat: number;
  lon: number;
}

export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // No API key — passthrough mode
  if (!apiKey) {
    return { resolvedAddress: address, lat: 0, lon: 0 };
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

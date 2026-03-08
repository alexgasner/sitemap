import type { Property } from "@shared/domain";

export async function fetchDemoProperty(): Promise<Property> {
  const res = await fetch("/api/properties/demo");
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
  return res.json();
}

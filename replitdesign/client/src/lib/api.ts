import type { Property } from "@shared/domain";

export async function fetchDemoProperty(): Promise<Property> {
  const res = await fetch("/api/properties/demo");
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
  return res.json();
}

export async function analyzeProperty(address: string): Promise<Property> {
  const res = await fetch("/api/properties/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(data.error || `${res.status}: ${res.statusText}`);
  }
  return res.json();
}

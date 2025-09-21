// lib/getPublicIP.ts
export async function getPublicIP() {
  try {
    const res = await fetch('https://api64.ipify.org?format=json');
    if (!res.ok) return null;
    const data = await res.json();
    return data.ip || null;
  } catch (err) {
    console.error("Failed to fetch public IP:", err);
    return null;
  }
}

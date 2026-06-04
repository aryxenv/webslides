/** Base URL of the demo server. Defaults to the local FastAPI dev server;
 * override per-environment with VITE_SERVER_URL (e.g. in .env.local). */
const serverUrl = import.meta.env.VITE_SERVER_URL ?? "http://localhost:8000";

export const SERVER_URL = serverUrl.replace(/\/$/, "");

export interface HealthStatus {
  status: string;
}

/** Calls the server's GET /health route. */
export async function fetchHealth(signal?: AbortSignal): Promise<HealthStatus> {
  const response = await fetch(`${SERVER_URL}/health`, { signal });

  if (!response.ok) {
    throw new Error(`Server responded ${response.status}`);
  }

  return (await response.json()) as HealthStatus;
}

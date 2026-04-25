import type { AdminSession, PocketBaseRecord } from "./types";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const getPocketBaseUrl = () => trimTrailingSlash(import.meta.env.VITE_POCKETBASE_URL?.trim() || "");

const request = async <T>(path: string, init: RequestInit = {}, token?: string): Promise<T> => {
  const baseUrl = getPocketBaseUrl();
  if (!baseUrl) {
    throw new Error("Missing VITE_POCKETBASE_URL.");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: token } : {}),
      ...init.headers
    }
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = payload?.message || payload?.data || text || `${response.status} ${response.statusText}`;
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }

  return payload as T;
};

export async function loginSuperuser(email: string, password: string): Promise<Omit<AdminSession, "expiresAt">> {
  const payload = await request<{ token: string; record?: { email?: string } }>(
    "/api/collections/_superusers/auth-with-password",
    {
      method: "POST",
      body: JSON.stringify({
        identity: email,
        password
      })
    }
  );

  return {
    token: payload.token,
    email: payload.record?.email || email
  };
}

export async function listRecords(collection: string, token: string, params: Record<string, string> = {}) {
  const query = new URLSearchParams({
    page: "1",
    perPage: "200",
    ...params
  }).toString();

  const payload = await request<{ items: PocketBaseRecord[] }>(
    `/api/collections/${collection}/records?${query}`,
    undefined,
    token
  );

  return payload.items || [];
}

export async function createRecord(collection: string, data: Record<string, unknown>, token: string) {
  return request<PocketBaseRecord>(
    `/api/collections/${collection}/records`,
    {
      method: "POST",
      body: JSON.stringify(data)
    },
    token
  );
}

export async function updateRecord(collection: string, id: string, data: Record<string, unknown>, token: string) {
  return request<PocketBaseRecord>(
    `/api/collections/${collection}/records/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data)
    },
    token
  );
}

export async function deleteRecord(collection: string, id: string, token: string) {
  return request<void>(
    `/api/collections/${collection}/records/${id}`,
    {
      method: "DELETE"
    },
    token
  );
}

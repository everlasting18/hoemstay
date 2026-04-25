type PocketBaseListResponse<T> = {
  items?: T[];
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const getPocketBaseUrl = () => {
  const value = import.meta.env.PUBLIC_POCKETBASE_URL?.trim();
  return value ? trimTrailingSlash(value) : "";
};

export const hasPocketBaseConfig = () => getPocketBaseUrl().length > 0;

export async function fetchPocketBaseList<T>(
  collection: string,
  params: Record<string, string | number | undefined> = {}
) {
  const baseUrl = getPocketBaseUrl();
  if (!baseUrl) return [] as T[];

  const url = new URL(`/api/collections/${collection}/records`, `${baseUrl}/`);
  url.searchParams.set("page", "1");
  url.searchParams.set("perPage", String(params.perPage ?? 200));

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || key === "perPage") return;
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    // Bỏ cache: "no-store" — không support trên Cloudflare Workers runtime
    // cf object: bypass cache trên Workers, Node.js/local dev tự ignore
    cf: { cacheTtl: 0, cacheEverything: false },
  } as RequestInit);

  if (!response.ok) {
    throw new Error(
      `PocketBase request failed for ${collection}: ${response.status} ${response.statusText}`
    );
  }

  const payload = (await response.json()) as PocketBaseListResponse<T>;
  return Array.isArray(payload.items) ? payload.items : [];
}

export async function fetchPocketBaseFirst<T>(
  collection: string,
  filter: string
): Promise<T | null> {
  const items = await fetchPocketBaseList<T>(collection, { filter, perPage: 1 });
  return items[0] ?? null;
}
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const baseUrl = (process.env.POCKETBASE_URL || process.env.PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090").replace(/\/+$/, "");
const email = process.env.POCKETBASE_ADMIN_EMAIL;
const password = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Missing PocketBase credentials. Set POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD.");
  process.exit(1);
}

const collectionsPath = resolve(process.cwd(), "pocketbase/mvp/collections.json");
const seedPath = resolve(process.cwd(), "pocketbase/mvp/seed.json");

async function request(pathname, init = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, init);

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${text}`);
  }

  return payload;
}

async function authSuperuser() {
  const payload = await request("/api/collections/_superusers/auth-with-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      identity: email,
      password
    })
  });

  const token = payload?.token;
  if (!token) {
    throw new Error("PocketBase auth succeeded without returning a token.");
  }

  return token;
}

async function importCollections(token, collections) {
  await request("/api/collections/import", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({
      collections,
      deleteMissing: false
    })
  });
}

async function upsertRecord(token, collection, record) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: token
  };

  const existing = await fetch(`${baseUrl}/api/collections/${collection}/records/${record.id}`, {
    headers: {
      Accept: "application/json",
      Authorization: token
    }
  });

  if (existing.ok) {
    await request(`/api/collections/${collection}/records/${record.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(record)
    });
    return "updated";
  }

  if (existing.status !== 404) {
    const errorText = await existing.text();
    throw new Error(`Failed to check existing ${collection}/${record.id}: ${existing.status} ${existing.statusText}: ${errorText}`);
  }

  await request(`/api/collections/${collection}/records`, {
    method: "POST",
    headers,
    body: JSON.stringify(record)
  });
  return "created";
}

async function main() {
  const [collectionsRaw, seedRaw] = await Promise.all([
    readFile(collectionsPath, "utf8"),
    readFile(seedPath, "utf8")
  ]);
  const collections = JSON.parse(collectionsRaw);
  const seed = JSON.parse(seedRaw);

  console.log(`PocketBase URL: ${baseUrl}`);
  console.log("Authenticating superuser...");
  const token = await authSuperuser();

  console.log("Importing collections...");
  await importCollections(token, collections);

  console.log("Seeding records...");
  for (const [collection, records] of Object.entries(seed)) {
    if (!Array.isArray(records)) continue;
    for (const record of records) {
      const action = await upsertRecord(token, collection, record);
      console.log(`${collection}/${record.id}: ${action}`);
    }
  }

  console.log("PocketBase MVP setup complete.");
}

main().catch((error) => {
  console.error("PocketBase MVP setup failed.");
  console.error(error);
  process.exit(1);
});

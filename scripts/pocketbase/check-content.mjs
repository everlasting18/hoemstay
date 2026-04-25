const baseUrl = (process.env.POCKETBASE_URL || process.env.PUBLIC_POCKETBASE_URL || "").replace(/\/+$/, "");

if (!baseUrl) {
  console.error("Missing PocketBase URL. Set PUBLIC_POCKETBASE_URL or POCKETBASE_URL.");
  process.exit(1);
}

const galleryCategories = new Set(["canh-quan", "luu-tru", "trai-nghiem", "check-in"]);

async function fetchList(collection, params = {}) {
  const url = new URL(`/api/collections/${collection}/records`, `${baseUrl}/`);
  url.searchParams.set("page", "1");
  url.searchParams.set("perPage", "200");

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Failed ${collection}: ${response.status} ${response.statusText}\n${text}`);
  }

  const payload = text ? JSON.parse(text) : {};
  return Array.isArray(payload.items) ? payload.items : [];
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function parseJsonArrayString(value) {
  if (!isNonEmptyString(value)) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string" && item.trim().length > 0) : [];
  } catch {
    return [];
  }
}

function validateSettings(records) {
  const issues = [];

  if (!records.length) {
    issues.push("settings: missing record");
    return issues;
  }

  if (records.length > 1) {
    issues.push(`settings: expected 1 record but found ${records.length}`);
  }

  const requiredFields = [
    "site_name",
    "short_name",
    "tagline",
    "description",
    "location",
    "hero_title",
    "hero_subtitle",
    "hero_image",
    "phone_display",
    "phone_href",
    "zalo_url",
    "facebook_url",
    "email",
    "map_embed"
  ];

  for (const field of requiredFields) {
    if (!isNonEmptyString(records[0]?.[field])) {
      issues.push(`settings: field \`${field}\` is empty`);
    }
  }

  return issues;
}

function validateHeroSlides(records) {
  const issues = [];

  if (!records.length) {
    issues.push("hero_slides: no records");
  }

  records.forEach((record) => {
    if (!isNonEmptyString(record.image)) {
      issues.push(`hero_slides/${record.id}: field \`image\` is empty`);
    }
    if (!isNonEmptyString(record.title)) {
      issues.push(`hero_slides/${record.id}: field \`title\` is empty`);
    }
  });

  return issues;
}

function validateRooms(records) {
  const issues = [];

  if (!records.length) {
    issues.push("rooms: no records");
  }

  records.forEach((record) => {
    const requiredFields = ["slug", "name", "type", "summary", "description", "guests", "area", "view", "highlight"];
    requiredFields.forEach((field) => {
      if (!isNonEmptyString(record[field])) {
        issues.push(`rooms/${record.id}: field \`${field}\` is empty`);
      }
    });

    const amenities = parseJsonArrayString(record.amenities);
    if (!amenities.length) {
      issues.push(`rooms/${record.id}: \`amenities\` is not valid JSON array text or is empty`);
    }

    const featuredImages = parseJsonArrayString(record.featured_images);
    if (!featuredImages.length) {
      issues.push(`rooms/${record.id}: \`featured_images\` is not valid JSON array text or is empty`);
    }
  });

  return issues;
}

function validateServices(records) {
  const issues = [];

  if (!records.length) {
    issues.push("services: no records");
  }

  records.forEach((record) => {
    ["name", "summary", "description", "timing", "image"].forEach((field) => {
      if (!isNonEmptyString(record[field])) {
        issues.push(`services/${record.id}: field \`${field}\` is empty`);
      }
    });
  });

  return issues;
}

function validateGallery(records) {
  const issues = [];

  if (!records.length) {
    issues.push("gallery: no records");
  }

  records.forEach((record) => {
    ["title", "caption", "image"].forEach((field) => {
      if (!isNonEmptyString(record[field])) {
        issues.push(`gallery/${record.id}: field \`${field}\` is empty`);
      }
    });

    if (!galleryCategories.has(record.category)) {
      issues.push(`gallery/${record.id}: invalid \`category\` value \`${record.category ?? ""}\``);
    }
  });

  return issues;
}

function validateReviews(records) {
  const issues = [];

  if (!records.length) {
    issues.push("reviews: no records");
  }

  records.forEach((record) => {
    ["name", "origin", "quote"].forEach((field) => {
      if (!isNonEmptyString(record[field])) {
        issues.push(`reviews/${record.id}: field \`${field}\` is empty`);
      }
    });
  });

  return issues;
}

async function main() {
  console.log(`PocketBase URL: ${baseUrl}`);

  const [
    settings,
    heroSlides,
    rooms,
    services,
    gallery,
    reviews
  ] = await Promise.all([
    fetchList("settings"),
    fetchList("hero_slides", { sort: "order" }),
    fetchList("rooms", { sort: "order" }),
    fetchList("services", { sort: "order" }),
    fetchList("gallery", { sort: "order" }),
    fetchList("reviews", { sort: "-created" })
  ]);

  console.log("Counts:");
  console.log(`- settings: ${settings.length}`);
  console.log(`- hero_slides: ${heroSlides.length}`);
  console.log(`- rooms: ${rooms.length}`);
  console.log(`- services: ${services.length}`);
  console.log(`- gallery: ${gallery.length}`);
  console.log(`- reviews: ${reviews.length}`);

  const issues = [
    ...validateSettings(settings),
    ...validateHeroSlides(heroSlides),
    ...validateRooms(rooms),
    ...validateServices(services),
    ...validateGallery(gallery),
    ...validateReviews(reviews)
  ];

  if (!issues.length) {
    console.log("PocketBase content check passed.");
    return;
  }

  console.error("PocketBase content check found issues:");
  issues.forEach((issue) => {
    console.error(`- ${issue}`);
  });
  process.exit(1);
}

main().catch((error) => {
  console.error("PocketBase content check failed.");
  console.error(error);
  process.exit(1);
});

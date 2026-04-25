import {
  gallery as fallbackGallery,
  hero as fallbackHero,
  navigation as fallbackNavigation,
  reviews as fallbackReviews,
  rooms as fallbackRooms,
  services as fallbackServices,
  siteMeta as fallbackSiteMeta
} from "../data/site";
import type { GalleryItem, Review, Room, Service } from "../data/site";
import type { HeroContent, SiteContent, SiteMeta } from "./content.types";
import { fetchPocketBaseFirst, fetchPocketBaseList, getPocketBaseUrl, hasPocketBaseConfig } from "./pocketbase";

type PocketBaseRecord = {
  id: string;
  collectionId?: string;
  [key: string]: unknown;
};

type PocketBaseSettingsRecord = PocketBaseRecord & {
  site_name?: string;
  short_name?: string;
  tagline?: string;
  description?: string;
  location?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_image?: string | string[];
  phone_display?: string;
  phone_href?: string;
  zalo_url?: string;
  facebook_url?: string;
  email?: string;
  map_embed?: string;
};

type PocketBaseHeroSlideRecord = PocketBaseRecord & {
  image?: string | string[];
  title?: string;
};

type PocketBaseRoomRecord = PocketBaseRecord & {
  slug?: string;
  name?: string;
  type?: string;
  summary?: string;
  description?: string;
  guests?: string;
  area?: string;
  view?: string;
  highlight?: string;
  amenities?: unknown;
  featured_images?: string[] | string;
};

type PocketBaseServiceRecord = PocketBaseRecord & {
  name?: string;
  summary?: string;
  description?: string;
  timing?: string;
  image?: string | string[];
};

type PocketBaseGalleryRecord = PocketBaseRecord & {
  title?: string;
  caption?: string;
  image?: string | string[];
  category?: string;
};

type PocketBaseReviewRecord = PocketBaseRecord & {
  name?: string;
  origin?: string;
  quote?: string;
  is_featured?: boolean;
};

const galleryCategories = new Set<GalleryItem["category"]>([
  "canh-quan",
  "luu-tru",
  "trai-nghiem",
  "check-in"
]);

// Không cache ở module level — mỗi request Cloudflare Worker fetch fresh từ PocketBase
let loggedFallbackReason = false;
let loggedValidationWarnings = false;

const shouldRequireCms = () => import.meta.env.PUBLIC_REQUIRE_CMS === "true";

const cloneSiteMeta = (siteMeta: typeof fallbackSiteMeta): SiteMeta => ({
  ...siteMeta,
  contact: { ...siteMeta.contact }
});

const cloneHero = (hero: typeof fallbackHero): HeroContent => ({
  ...hero,
  slides: hero.slides.map((slide) => ({ ...slide }))
});

const cloneRooms = (rooms: typeof fallbackRooms): Room[] =>
  rooms.map((room) => ({
    ...room,
    amenities: [...room.amenities],
    media: room.media.map((media) => ({ ...media }))
  }));

const cloneServices = (services: typeof fallbackServices): Service[] => services.map((service) => ({ ...service }));

const cloneGallery = (gallery: typeof fallbackGallery): GalleryItem[] => gallery.map((item) => ({ ...item }));

const cloneReviews = (reviews: typeof fallbackReviews): Review[] => reviews.map((review) => ({ ...review }));

const createFallbackContent = (): SiteContent => ({
  navigation: fallbackNavigation.map((item) => ({ ...item })),
  siteMeta: cloneSiteMeta(fallbackSiteMeta),
  hero: cloneHero(fallbackHero),
  rooms: cloneRooms(fallbackRooms),
  services: cloneServices(fallbackServices),
  gallery: cloneGallery(fallbackGallery),
  reviews: cloneReviews(fallbackReviews)
});

const cleanString = (value: unknown, fallback = "") => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : fallback;
};

const parseStringArray = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value !== "string") return [] as string[];

  const trimmed = value.trim();
  if (!trimmed.length) return [] as string[];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }
  } catch {
    return trimmed
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [] as string[];
};

const resolveFileUrl = (record: PocketBaseRecord, filename: string) => {
  if (!filename) return "";
  if (/^(?:[a-z]+:)?\/\//i.test(filename) || filename.startsWith("/")) return filename;

  const baseUrl = getPocketBaseUrl();
  if (!baseUrl || !record.collectionId || !record.id) return filename;

  return `${baseUrl}/api/files/${record.collectionId}/${record.id}/${encodeURIComponent(filename)}`;
};

const resolveSingleFile = (record: PocketBaseRecord, value: unknown, fallback = "") => {
  if (Array.isArray(value)) {
    const first = value.find((item): item is string => typeof item === "string" && item.trim().length > 0);
    return first ? resolveFileUrl(record, first) : fallback;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return resolveFileUrl(record, value);
  }

  return fallback;
};

const resolveFileList = (record: PocketBaseRecord, value: unknown) => {
  const items = parseStringArray(value);

  return items
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => resolveFileUrl(record, item))
    .filter(Boolean);
};

const mapSettings = (record: PocketBaseSettingsRecord | undefined, fallback: SiteMeta): SiteMeta => {
  if (!record) return fallback;

  return {
    name: cleanString(record.site_name, fallback.name),
    shortName: cleanString(record.short_name, fallback.shortName),
    tagline: cleanString(record.tagline, fallback.tagline),
    description: cleanString(record.description, fallback.description),
    location: cleanString(record.location, fallback.location),
    heroImage: resolveSingleFile(record, record.hero_image, fallback.heroImage),
    contact: {
      phoneDisplay: cleanString(record.phone_display, fallback.contact.phoneDisplay),
      phoneHref: cleanString(record.phone_href, fallback.contact.phoneHref),
      zalo: cleanString(record.zalo_url, fallback.contact.zalo),
      facebook: cleanString(record.facebook_url, fallback.contact.facebook),
      email: cleanString(record.email, fallback.contact.email),
      mapEmbed: cleanString(record.map_embed, fallback.contact.mapEmbed)
    }
  };
};

const mapHero = (
  settingsRecord: PocketBaseSettingsRecord | undefined,
  records: PocketBaseHeroSlideRecord[],
  fallback: HeroContent
): HeroContent => {
  const slides = records
    .map((record) => {
      const image = resolveSingleFile(record, record.image);
      const title = cleanString(record.title);
      if (!image || !title) return null;
      return { image, title };
    })
    .filter((slide): slide is HeroContent["slides"][number] => slide !== null);

  return {
    title: cleanString(settingsRecord?.hero_title, fallback.title),
    subtitle: cleanString(settingsRecord?.hero_subtitle, fallback.subtitle),
    slides: slides.length ? slides : fallback.slides
  };
};

const mapRooms = (records: PocketBaseRoomRecord[], fallback: Room[], heroImage: string): Room[] => {
  const rooms = records
    .map((record) => {
      const slug = cleanString(record.slug);
      const name = cleanString(record.name);
      if (!slug || !name) return null;

      const mediaSources = resolveFileList(record, record.featured_images);
      const media: Room["media"] = (mediaSources.length ? mediaSources : [heroImage]).map((src, index) => ({
        type: "image" as const,
        src,
        title: index === 0 ? name : undefined
      }));

      return {
        slug,
        name,
        type: cleanString(record.type, "Phòng nghỉ"),
        summary: cleanString(record.summary),
        description: cleanString(record.description),
        guests: cleanString(record.guests),
        area: cleanString(record.area),
        view: cleanString(record.view),
        highlight: cleanString(record.highlight),
        amenities: parseStringArray(record.amenities),
        media
      };
    })
    .filter((room): room is NonNullable<typeof room> => room !== null);

  return rooms.length ? rooms : fallback;
};

const mapServices = (records: PocketBaseServiceRecord[], fallback: Service[], heroImage: string): Service[] => {
  const services = records
    .map((record) => {
      const name = cleanString(record.name);
      if (!name) return null;

      return {
        name,
        summary: cleanString(record.summary),
        description: cleanString(record.description),
        timing: cleanString(record.timing),
        image: resolveSingleFile(record, record.image, heroImage)
      };
    })
    .filter((service): service is Service => service !== null);

  return services.length ? services : fallback;
};

const mapGallery = (records: PocketBaseGalleryRecord[], fallback: GalleryItem[], heroImage: string): GalleryItem[] => {
  const gallery = records
    .map((record) => {
      const title = cleanString(record.title);
      const category = cleanString(record.category) as GalleryItem["category"];
      if (!title || !galleryCategories.has(category)) return null;

      return {
        title,
        caption: cleanString(record.caption),
        image: resolveSingleFile(record, record.image, heroImage),
        category
      };
    })
    .filter((item): item is GalleryItem => item !== null);

  return gallery.length ? gallery : fallback;
};

const mapReviews = (records: PocketBaseReviewRecord[], fallback: Review[]): Review[] => {
  const reviews = records
    .map((record) => {
      const name = cleanString(record.name);
      const quote = cleanString(record.quote);
      if (!name || !quote) return null;

      return {
        name,
        origin: cleanString(record.origin),
        quote,
        isFeatured: Boolean(record.is_featured)
      };
    })
    .filter((review): review is Review => review !== null);

  return reviews.length ? reviews : fallback;
};

const logFallback = (reason: unknown) => {
  if (loggedFallbackReason) return;
  loggedFallbackReason = true;
  console.warn("[content] Falling back to static site data.", reason);
};

const logValidationWarnings = (issues: string[]) => {
  if (loggedValidationWarnings || !issues.length) return;
  loggedValidationWarnings = true;
  console.warn("[content] PocketBase content warnings:");
  issues.forEach((issue) => {
    console.warn(`- ${issue}`);
  });
};

const validatePocketBaseContent = ({
  settingsRecords,
  heroSlideRecords,
  roomRecords,
  serviceRecords,
  galleryRecords,
  reviewRecords,
  content
}: {
  settingsRecords: PocketBaseSettingsRecord[];
  heroSlideRecords: PocketBaseHeroSlideRecord[];
  roomRecords: PocketBaseRoomRecord[];
  serviceRecords: PocketBaseServiceRecord[];
  galleryRecords: PocketBaseGalleryRecord[];
  reviewRecords: PocketBaseReviewRecord[];
  content: SiteContent;
}) => {
  const issues: string[] = [];

  if (!settingsRecords.length) {
    issues.push("Collection `settings` has no records. Frontend is using fallback site settings.");
  }

  if (!heroSlideRecords.length) {
    issues.push("Collection `hero_slides` has no records. Hero is using fallback slide data.");
  }

  if (roomRecords.length !== content.rooms.length) {
    issues.push(`Mapped ${content.rooms.length}/${roomRecords.length} room records. Some rooms are missing required fields like slug or name.`);
  }

  if (serviceRecords.length !== content.services.length) {
    issues.push(`Mapped ${content.services.length}/${serviceRecords.length} service records. Some services are missing required fields like name.`);
  }

  if (galleryRecords.length !== content.gallery.length) {
    issues.push(`Mapped ${content.gallery.length}/${galleryRecords.length} gallery records. Some gallery items are missing title/category/image.`);
  }

  if (reviewRecords.length !== content.reviews.length) {
    issues.push(`Mapped ${content.reviews.length}/${reviewRecords.length} review records. Some reviews are missing name or quote.`);
  }

  content.rooms.forEach((room) => {
    if (!room.amenities.length) {
      issues.push(`Room \`${room.slug}\` has no parsed amenities. Check the \`amenities\` text field JSON.`);
    }

    if (!room.media.length || !room.media.some((item) => item.src.trim().length > 0)) {
      issues.push(`Room \`${room.slug}\` has no usable media. Check \`featured_images\`.`);
    }
  });

  if (!content.gallery.length) {
    issues.push("Collection `gallery` has no usable records. Homepage gallery will fall back to room media.");
  }

  if (!content.reviews.length) {
    issues.push("Collection `reviews` has no usable records. Homepage reviews will fall back to static data.");
  }

  return issues;
};

async function loadContent() {
  const fallback = createFallbackContent();
  if (!hasPocketBaseConfig()) {
    if (shouldRequireCms()) {
      throw new Error("PUBLIC_REQUIRE_CMS=true but PUBLIC_POCKETBASE_URL is not configured.");
    }

    return fallback;
  }

  try {
    const [settingsRecords, heroSlideRecords, roomRecords, serviceRecords, galleryRecords, reviewRecords] = await Promise.all([
      fetchPocketBaseList<PocketBaseSettingsRecord>("settings", { perPage: 1 }),
      fetchPocketBaseList<PocketBaseHeroSlideRecord>("hero_slides", { sort: "order" }),
      fetchPocketBaseList<PocketBaseRoomRecord>("rooms", { sort: "order" }),
      fetchPocketBaseList<PocketBaseServiceRecord>("services", { sort: "order" }),
      fetchPocketBaseList<PocketBaseGalleryRecord>("gallery", { sort: "order" }),
      fetchPocketBaseList<PocketBaseReviewRecord>("reviews", { sort: "-created" })
    ]);

    const settingsRecord = settingsRecords[0];
    const siteMeta = mapSettings(settingsRecord, fallback.siteMeta);
    const content = {
      navigation: fallback.navigation,
      siteMeta,
      hero: mapHero(settingsRecord, heroSlideRecords, fallback.hero),
      rooms: mapRooms(roomRecords, fallback.rooms, siteMeta.heroImage),
      services: mapServices(serviceRecords, fallback.services, siteMeta.heroImage),
      gallery: mapGallery(galleryRecords, fallback.gallery, siteMeta.heroImage),
      reviews: mapReviews(reviewRecords, fallback.reviews)
    } satisfies SiteContent;

    logValidationWarnings(
      validatePocketBaseContent({
        settingsRecords,
        heroSlideRecords,
        roomRecords,
        serviceRecords,
        galleryRecords,
        reviewRecords,
        content
      })
    );

    return content;
  } catch (error) {
    if (shouldRequireCms()) {
      throw error;
    }

    logFallback(error);
    return fallback;
  }
}

export async function getContent() {
  return loadContent();
}

export async function getRooms() {
  return (await getContent()).rooms;
}

export async function getSiteMeta() {
  return (await getContent()).siteMeta;
}

export async function getRoomBySlug(slug: string) {
  const { siteMeta } = await getContent();

  if (hasPocketBaseConfig()) {
    try {
      const record = await fetchPocketBaseFirst<PocketBaseRoomRecord>(
        "rooms",
        `slug='${slug.replace(/'/g, "''")}'`
      );
      if (record) {
        const mapped = mapRooms([record], [], siteMeta.heroImage);
        return mapped[0] ?? null;
      }
    } catch {
      // fallback về static data nếu PocketBase lỗi
    }
  }

  const fallback = fallbackRooms.find((r) => r.slug === slug);
  return fallback ?? null;
}

import type { GalleryItem, HeroSlide, NavItem, Review, Room, Service } from "../data/site";

export type SiteMeta = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  location: string;
  heroImage: string;
  contact: {
    phoneDisplay: string;
    phoneHref: string;
    zalo: string;
    facebook: string;
    email: string;
    mapEmbed: string;
  };
};

export type HeroContent = {
  title: string;
  subtitle: string;
  slides: HeroSlide[];
};

export type SiteContent = {
  navigation: NavItem[];
  siteMeta: SiteMeta;
  hero: HeroContent;
  rooms: Room[];
  services: Service[];
  gallery: GalleryItem[];
  reviews: Review[];
};

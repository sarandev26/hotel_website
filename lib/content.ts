export interface FactItem {
  number: string;
  label: string;
}

export interface SpaceRow {
  title: string;
  line: string;
  details: [string, string];
  image: string;
}

export interface SuiteItem {
  name: string;
  size: string;
  feature: string;
  description: string;
  image: string;
}

export interface MomentItem {
  title: string;
  description: string;
  image: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  details: string;
  image: string;
}

export interface FooterColumn {
  title: string;
  links: string[];
}

export const RESIDENCE_CONTENT = {
  label: "The residence",
  headlinePrefix: "Seven stars is a",
  italicWord: "promise.",
  paragraph:
    "Not a rating, but a way of paying attention. To light, to time, and to the person walking through the door.",
  image: "/images/residence.webp",
  facts: [
    { number: "7", label: "Signature suites" },
    { number: "24", label: "Hour private concierge" },
    { number: "Level 40", label: "Sky lounge" },
  ] as FactItem[],
};

export const SPACES_CONTENT = {
  label: "The spaces",
  headlinePrefix: "Spaces to",
  italicWord: "linger.",
  spaces: [
    {
      title: "Lobby",
      line: "Bronze, marble and light, with a concierge who anticipates.",
      details: ["24-hour concierge", "Private arrivals"],
      image: "/images/lobby.webp",
    },
    {
      title: "Dining",
      line: "Seven tables. One chef. A menu you will never repeat.",
      details: ["Open 6 pm to midnight", "Tasting menu"],
      image: "/images/dining.webp",
    },
    {
      title: "Spa",
      line: "Thermal suites, warm stone and hours that belong to you.",
      details: ["Thermal suites", "By appointment"],
      image: "/images/spa.webp",
    },
    {
      title: "Studio",
      line: "Soft daylight, a private studio, and a trainer who knows your name.",
      details: ["Open 24 hours", "Personal training"],
      image: "/images/studio.webp",
    },
    {
      title: "Pool",
      line: "A heated infinity pool, open to the stars.",
      details: ["Heated, year-round", "Private cabanas"],
      image: "/images/pool.webp",
    },
  ] as SpaceRow[],
};

export const SUITES_CONTENT = {
  label: "The suites",
  headlinePrefix: "Seven suites. Seven",
  italicWord: "skies.",
  suites: [
    {
      name: "Surya Suite",
      size: "180 m²",
      feature: "Sunrise terrace",
      description: "Bathed in morning gold with a private terrace overlooking the valley.",
      image: "/images/suites/suite-1.webp",
    },
    {
      name: "Chandra Suite",
      size: "190 m²",
      feature: "Moonlit garden view",
      description: "Soft silver tones and an expansive twilight garden framed by dark marble.",
      image: "/images/suites/suite-2.webp",
    },
    {
      name: "Tara Suite",
      size: "200 m²",
      feature: "Private plunge pool",
      description: "A heated open-air plunge pool perched between stone pillars and the sky.",
      image: "/images/suites/suite-3.webp",
    },
    {
      name: "Akasha Suite",
      size: "220 m²",
      feature: "Floor-to-ceiling sky view",
      description: "Boundless floor-to-ceiling glass embracing clouds, light, and the highest horizon.",
      image: "/images/suites/suite-4.webp",
    },
    {
      name: "Nakshatra Suite",
      size: "240 m²",
      feature: "Starlit rooftop terrace",
      description: "Private rooftop sanctuary with an open-air bronze hearth under the stars.",
      image: "/images/suites/suite-5.webp",
    },
    {
      name: "Aruna Suite",
      size: "260 m²",
      feature: "Dawn-facing library",
      description: "Lined with curated first editions and rich wood facing the dawn sky.",
      image: "/images/suites/suite-6.webp",
    },
    {
      name: "Sapta Suite",
      size: "420 m²",
      feature: "The signature residence, entire top floor",
      description: "The crown penthouse occupying the entire top floor with 360-degree views.",
      image: "/images/suites/suite-7.webp",
    },
  ] as SuiteItem[],
};

export const MOMENTS_CONTENT = {
  label: "Moments",
  headlinePrefix: "Moments you",
  italicWord: "remember.",
  moments: [
    {
      title: "Private arrival",
      description: "A chauffeur waits at the airport and the doors open as you arrive.",
      image: "/images/moment-arrival.webp",
    },
    {
      title: "Chef's table",
      description: "Dinner prepared for you alone, a few steps from the kitchen.",
      image: "/images/moment-chef.webp",
    },
    {
      title: "Sunset service",
      description: "The sky lounge opens as the light turns to amber.",
      image: "/images/moment-sunset.webp",
    },
    {
      title: "Spa rituals",
      description: "Slow, warm and unhurried, designed around you.",
      image: "/images/moment-spa.webp",
    },
  ] as MomentItem[],
  // PLACEHOLDER GUEST QUOTE: editable here
  quote: "We arrived as guests and left as family.",
  author: "A guest of Saptarishi",
  // SAMPLE GUEST STORIES: these are editable samples to replace
  testimonials: [
    {
      quote: "The doors opened and the evening slowed down. I have never felt so looked after.",
      author: "Ananya Mehta, Mumbai",
      details: "Sapta Suite, 3 nights",
      image: "/images/testimonial-1.webp",
    },
    {
      quote: "Dinner at the chef's table was the best meal of our lives, quiet, unhurried, perfect.",
      author: "Karthik Raman, Chennai",
      details: "Surya Suite, 2 nights",
      image: "/images/testimonial-2.webp",
    },
    {
      quote: "From the arrival to the sky lounge at sunset, nothing was ever out of place.",
      author: "Dr. Farah Siddiqui, Dubai",
      details: "Akasha Suite, 4 nights",
      image: "/images/testimonial-3.webp",
    },
  ] as TestimonialItem[],
};

export const RESERVE_CONTENT = {
  headlinePrefix: "Seven stars. One",
  italicWord: "sky.",
  line: "Your table, your suite, your evening. We will take care of the rest.",
  cta: "Reserve Your Experience",
};

export const FOOTER_CONTENT = {
  wordmark: "SAPTARISHI",
  address: "7 Skyway Boulevard, Sanctuary Heights",
  phone: "+1 (800) 777-SAPT",
  legal: "© Saptarishi. A residence of seven stars.",
  columns: [
    {
      title: "Stay",
      links: ["Surya Suite", "Chandra Suite", "Tara Suite", "Akasha Suite", "Sapta Residence"],
    },
    {
      title: "Dine",
      links: ["The Restaurant", "Chef's Table", "Private Cellar", "In-Suite Dining"],
    },
    {
      title: "Wellness",
      links: ["Thermal Suites", "Private Studio", "Infinity Pool", "Bespoke Rituals"],
    },
    {
      title: "Contact",
      links: ["Private Concierge", "Helipad Arrivals", "Press Inquiries", "Careers"],
    },
  ] as FooterColumn[],
};

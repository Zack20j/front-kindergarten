import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Heart,
  Smile,
  Sparkles,
  ShieldCheck,
  Paintbrush,
  Music,
  Users,
} from "lucide-react";

export type NavItem = {
  name: string;
  href: string;
};

export type FeatureCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
};

export type ActivityCard = {
  title: string;
  icon: LucideIcon;
  color: string;
};

export type GalleryCard = {
  label: string;
  accent: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export type ContactInfo = {
  address: string;
  email: string;
  phone: string;
};

export const navItems: NavItem[] = [
  { name: "Inicio", href: "#inicio" },
  { name: "Nosotros", href: "#nosotros" },
  { name: "Actividades", href: "#actividades" },
  { name: "Contacto", href: "#contacto" },
];

export const heroContent = {
  badge: "Educación inicial alegre y segura",
  title: "Aprender jugando es crecer felices.",
  description:
    "En U.E.C. Luisa Cáceres acompañamos a los más pequeños con cariño, creatividad y valores en un entorno lleno de color.",
  primaryAction: { label: "Conócenos", href: "#nosotros" },
  secondaryAction: { label: "Inscripciones abiertas", href: "#contacto" },
  highlights: [
    {
      title: "Amigos nuevos",
      description: "Actividades para compartir y crear amistades.",
      icon: Smile,
      color: "bg-sky-100 text-sky-700",
    },
    {
      title: "Arte y creatividad",
      description: "Manos a la obra con pintura, música y cuentos.",
      icon: Paintbrush,
      color: "bg-amber-100 text-amber-700",
    },
  ] as FeatureCard[],
};

export const reasons: FeatureCard[] = [
  {
    title: "Atención personalizada",
    description:
      "Cada niño recibe apoyo cálido y seguimiento cercano en un entorno familiar.",
    icon: Users,
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Aprendizaje divertido",
    description:
      "Juegos, arte y cuentos que desarrollan curiosidad y alegría por aprender.",
    icon: Smile,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Ambiente seguro",
    description:
      "Espacios pensados para el juego tranquilo con supervisión y confianza.",
    icon: ShieldCheck,
    color: "bg-sky-100 text-sky-700",
  },
  {
    title: "Desarrollo integral",
    description:
      "Estimulación emocional, social y física con actividades variadas.",
    icon: Heart,
    color: "bg-pink-100 text-pink-700",
  },
];

export const activities: ActivityCard[] = [
  {
    title: "Juegos creativos",
    icon: Sparkles,
    color: "from-pink-200 via-rose-100 to-amber-100",
  },
  {
    title: "Pintura",
    icon: Paintbrush,
    color: "from-emerald-200 via-lime-100 to-sky-100",
  },
  {
    title: "Lectura",
    icon: BookOpen,
    color: "from-sky-200 via-indigo-100 to-violet-100",
  },
  {
    title: "Música",
    icon: Music,
    color: "from-amber-200 via-orange-100 to-pink-100",
  },
];

export const galleryCards: GalleryCard[] = [
  { label: "Exploración", accent: "bg-rose-100" },
  { label: "Arte y juegos", accent: "bg-sky-100" },
  { label: "Cuentos", accent: "bg-lime-100" },
  { label: "Risas", accent: "bg-amber-100" },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Nuestro hijo llegó emocionado cada mañana. El equipo es amoroso y muy atento.",
    name: "María G.",
    role: "Madre de Sofía",
  },
  {
    quote:
      "El ambiente es alegre y tranquilo. Se nota el cariño con el que trabajan.",
    name: "Carlos R.",
    role: "Padre de Mateo",
  },
];

export const contactInfo: ContactInfo = {
  address: "Av. Bolivar, Sector Los Jardines",
  email: "contacto@uec-luisa.edu.ve",
  phone: "+58 412 123 4567",
};

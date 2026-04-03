import ActivitiesSection from "./components/ActivitiesSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import GallerySection from "./components/GallerySection";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import TestimonialsSection from "./components/TestimonialsSection";
import WhyChooseUsSection from "./components/WhyChooseUsSection";
import {
  activities,
  contactInfo,
  galleryCards,
  heroContent,
  navItems,
  reasons,
  testimonials,
} from "./components/landingData";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff8f2] text-slate-900">
      <Navbar items={navItems} ctaHref="#contacto" ctaLabel="Aula Virtual" />
      <Hero {...heroContent} />
      <WhyChooseUsSection items={reasons} />
      <ActivitiesSection activities={activities} />
      <GallerySection cards={galleryCards} />
      <TestimonialsSection items={testimonials} />
      <CTASection
        title="Tu peque merece un primer paso lleno de juegos, cuidado y ternura."
        subtitle="Ven a conocer nuestras aulas, espacios exteriores y el equipo que te acompañará en cada etapa."
        buttonLabel="Reserva tu visita"
        buttonHref="#contacto"
      />
      <Footer contact={contactInfo} />
    </main>
  );
}

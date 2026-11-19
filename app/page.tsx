import { Collection } from "@/components/Collection";
import { LiveChat } from "@/components/LiveChat";
import { Concierge } from "@/components/Concierge";
import { Footer } from "@/components/Footer";
import { GalleryProvider } from "@/components/GalleryContext";
import { Hero } from "@/components/Hero";
import { InspectionModal } from "@/components/InspectionModal";
import { Navbar } from "@/components/Navbar";
import { Provenance } from "@/components/Provenance";
import { RoomView } from "@/components/RoomView";

export default function Page() {
  return (
    <GalleryProvider>
      <a
        href="#collection"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:bg-parchment focus:px-4 focus:py-2 focus:font-sans focus:text-[11px] focus:uppercase focus:tracking-[0.22em] focus:text-navy"
      >
        Skip to the collection
      </a>
      <Navbar />
      <main>
        <Hero />
        <Collection />
        <Provenance />
        <Concierge />
      </main>
      <Footer />
      <InspectionModal />
      <RoomView />
      <LiveChat />
    </GalleryProvider>
  );
}

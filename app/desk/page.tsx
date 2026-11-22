import { Desk } from "@/components/Desk";
import { GalleryProvider } from "@/components/GalleryContext";
import { Navbar } from "@/components/Navbar";

export default function DeskPage() {
  return (
    <GalleryProvider>
      <Navbar />
      <Desk />
    </GalleryProvider>
  );
}

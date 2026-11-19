export type FrameStyle = "mahogany" | "brass" | "ebonized";

export type ArtworkCategory = "horses" | "portraits" | "scenes";

export type ProvenanceLine = {
  year: string;
  text: string;
};

export type Artwork = {
  id: string;
  title: string;
  artist: string;
  year: string;
  medium: string;
  dimensionsCm: string;
  dimensionsIn: string;
  category: ArtworkCategory;
  textureUrl: string;
  frameStyle: FrameStyle;
  aspectRatio: number;
  provenance: ProvenanceLine[];
  condition: string;
  blurb: string;
};

export const artworks: Artwork[] = [
  {
    id: "golden-descent",
    title: "Golden Descent",
    artist: "Victoria Boiker",
    year: "",
    medium: "Acrylic and oil, with gold leaf",
    dimensionsCm: "Vertical canvas",
    dimensionsIn: "",
    category: "horses",
    textureUrl: "/artworks/golden-descent.jpg",
    frameStyle: "mahogany",
    aspectRatio: 692 / 1024,
    provenance: [
      { year: "Studio", text: "Painted by Victoria Boiker. The blue mass is laid in thick strokes over an orange ground, and the gold is leaf, not a printed line." },
      { year: "Gallery", text: "Held by the artist and shown by private appointment." },
    ],
    condition:
      "The impasto is intact and the gold leaf sits on the surface. The drips are part of the painting, not a later accident.",
    blurb: "A blue horse falling through orange, the gold running with it.",
  },
  {
    id: "winged-horse",
    title: "Winged Horse",
    artist: "Victoria Boiker",
    year: "",
    medium: "Acrylic and oil",
    dimensionsCm: "Square canvas",
    dimensionsIn: "",
    category: "horses",
    textureUrl: "/artworks/winged-horse.jpg",
    frameStyle: "ebonized",
    aspectRatio: 980 / 1024,
    provenance: [
      { year: "Studio", text: "Painted by Victoria Boiker. The wing is built from separate blue strokes, and the sun is a second disc behind the raised forelegs." },
      { year: "Gallery", text: "Held by the artist and shown by private appointment." },
    ],
    condition: "The paint is thick and even, with no flaking along the wing or the raised legs.",
    blurb: "A winged horse rearing against a red sun, the body almost a silhouette.",
  },
  {
    id: "green-eye",
    title: "Green Eye",
    artist: "Victoria Boiker",
    year: "",
    medium: "Acrylic and oil, with gold leaf",
    dimensionsCm: "Vertical canvas",
    dimensionsIn: "",
    category: "portraits",
    textureUrl: "/artworks/green-eye.jpg",
    frameStyle: "brass",
    aspectRatio: 533 / 1024,
    provenance: [
      { year: "Studio", text: "Painted by Victoria Boiker. The crackle is drawn into the face, and the gold is leaf on the cheek and the brow." },
      { year: "Gallery", text: "Held by the artist and shown by private appointment." },
    ],
    condition: "The surface is sound. The cracks are painted, not a split in the ground.",
    blurb: "A face split by a green eye and a dark socket, the mouth painted red.",
  },
  {
    id: "horse-and-ships",
    title: "Horse and Ships",
    artist: "Victoria Boiker",
    year: "",
    medium: "Acrylic and oil",
    dimensionsCm: "Horizontal canvas",
    dimensionsIn: "",
    category: "horses",
    textureUrl: "/artworks/horse-and-ships.jpg",
    frameStyle: "mahogany",
    aspectRatio: 809 / 1024,
    provenance: [
      { year: "Studio", text: "Painted by Victoria Boiker. The horse stands on the cliff with a hull across its back, and the smaller ships sit on the water." },
      { year: "Gallery", text: "Held by the artist and shown by private appointment." },
    ],
    condition: "The colour is clear from the orange cliff to the blue of the upper sky. No lifting along the long legs.",
    blurb: "A grey horse on an orange cliff, carrying a ship, with others already at sea.",
  },
  {
    id: "two-faces",
    title: "Two Faces",
    artist: "Victoria Boiker",
    year: "",
    medium: "Acrylic and oil",
    dimensionsCm: "Round canvas",
    dimensionsIn: "",
    category: "portraits",
    textureUrl: "/artworks/two-faces.png",
    frameStyle: "ebonized",
    aspectRatio: 1,
    provenance: [
      { year: "Studio", text: "Painted by Victoria Boiker on a round canvas. One face is frontal, the other in profile, and the signature sits in the lower right." },
      { year: "Gallery", text: "Held by the artist and shown by private appointment." },
    ],
    condition: "The round edge is clean. The crackle across both faces is painted into the surface.",
    blurb: "Two faces on one round canvas, flowers in the hair, a profile turned away.",
  },
  {
    id: "the-profile",
    title: "The Profile",
    artist: "Victoria Boiker",
    year: "",
    medium: "Acrylic and oil, with gold leaf",
    dimensionsCm: "Oval canvas",
    dimensionsIn: "",
    category: "portraits",
    textureUrl: "/artworks/the-profile.png",
    frameStyle: "brass",
    aspectRatio: 659 / 998,
    provenance: [
      { year: "Studio", text: "Painted by Victoria Boiker on an oval canvas. Gold leaf is set into the brow and the spiral beside the cheek." },
      { year: "Gallery", text: "Held by the artist and shown by private appointment." },
    ],
    condition: "The oval edge is intact. Gold leaf remains seated in the upper passages.",
    blurb: "An oval profile, one eye, a red mouth, and a spiral at the ear.",
  },
  {
    id: "the-walk",
    title: "The Walk",
    artist: "Victoria Boiker",
    year: "",
    medium: "Acrylic and oil",
    dimensionsCm: "Round canvas",
    dimensionsIn: "",
    category: "scenes",
    textureUrl: "/artworks/the-walk.png",
    frameStyle: "mahogany",
    aspectRatio: 1,
    provenance: [
      { year: "Studio", text: "Painted by Victoria Boiker on a round canvas. The figure, the dog, and the flowering hedge are built in thick strokes on a mint ground." },
      { year: "Gallery", text: "Held by the artist and shown by private appointment." },
    ],
    condition: "The impasto is even across the round. No losses in the raised paint of the dress or the dog’s coat.",
    blurb: "A woman in a green hat walking a dog in a red coat, on a round mint ground.",
  },
];

export function formatDimensions(work: Artwork) {
  if (!work.dimensionsIn) return work.dimensionsCm;
  return `${work.dimensionsCm} (${work.dimensionsIn})`;
}

export function getArtwork(id: string) {
  return artworks.find((work) => work.id === id) ?? null;
}

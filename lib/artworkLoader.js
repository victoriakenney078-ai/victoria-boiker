export default function artworkLoader({ src }) {
  if (src.startsWith("/")) return src;
  return src;
}

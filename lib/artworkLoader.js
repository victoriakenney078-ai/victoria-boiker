export default function artworkLoader({ src, width }) {
  const join = src.includes("?") ? "&" : "?";
  return `${src}${join}w=${width}`;
}

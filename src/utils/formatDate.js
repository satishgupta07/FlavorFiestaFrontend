export function formatDate(iso) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric", month: "short", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  }).format(new Date(iso));
}

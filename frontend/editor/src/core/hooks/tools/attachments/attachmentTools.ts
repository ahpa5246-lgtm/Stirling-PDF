export const validateAttachmentName = (value: string) =>
  typeof value === "string" && value.trim().length > 0;
const safe = (value: string) =>
  Array.from(
    (value.split(/[\\/]/).pop() || "document").replace(/[<>:"|?*]/g, "_"),
    (ch) => (ch.charCodeAt(0) < 32 ? "_" : ch),
  ).join("");
export function buildArchiveName(sourceName: string, id: string) {
  return `${safe(sourceName)
    .replace(/\.pdf$/i, "")
    .slice(0, 64)}_${id}_attachments.zip`;
}
export function uniqueExtractedNames(archiveName: string, names: string[]) {
  const prefix = archiveName.replace(/_attachments\.zip$/, "");
  return names.map(
    (name, index) => `${prefix}_${index + 1}_${safe(name).slice(0, 128)}`,
  );
}

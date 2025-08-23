export function isSetComplete(
  awaiting: "image" | "text" | null,
  hasText: boolean,
  hasFiles: boolean,
  pendingText: string | null,
  pendingFiles: File[] | null
) {
  return (
    (awaiting === "image" && hasFiles && !!pendingText) ||
    (awaiting === "text" && hasText && !!pendingFiles?.length)
  );
}

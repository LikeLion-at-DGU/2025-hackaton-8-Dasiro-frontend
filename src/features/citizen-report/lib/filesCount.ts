export const limitTo3 = (files?: File[] | null) =>
  files ? files.slice(0, 3) : [];

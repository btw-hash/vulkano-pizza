/** Prefix a public asset path with the Pages basePath (raw <img>/canvas/OGL use). */
export const asset = (p: string) => (process.env.NEXT_PUBLIC_BASE_PATH ?? '') + p;

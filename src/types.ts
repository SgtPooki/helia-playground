import type { createHelia } from 'helia';

export type HeliaInstanceType = Awaited<ReturnType<typeof createHelia>>

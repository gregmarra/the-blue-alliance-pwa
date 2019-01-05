export const isProd = process.env.NODE_ENV === 'production';

export const isServer = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export const canUseIDB = !!(
  typeof window !== 'undefined' &&
  window.indexedDB
);

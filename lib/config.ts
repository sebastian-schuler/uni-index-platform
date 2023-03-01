const dev = process.env.NODE_ENV !== 'production';

export const SERVER_URL = dev ? 'http://localhost:3000' : 'https://analyse.hs-kl.de'; // TODO SET URL FOR SERVER

export const INSTITUTION_SESSION_COOKIE = "institution-session";
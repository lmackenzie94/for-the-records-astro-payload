export const URL = import.meta.env.DEV
  ? 'http://localhost:3001'
  : `${import.meta.env.PAYLOAD_URL}`;

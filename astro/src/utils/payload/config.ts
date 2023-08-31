export const URL = import.meta.env.DEV
  ? "http://payload:3001"
  : `${import.meta.env.PAYLOAD_URL}`;
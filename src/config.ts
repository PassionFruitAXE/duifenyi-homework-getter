export const BACKEND_PREFIX =
  process.env.NODE_ENV === "development"
    ? "http://localhost:7000"
    : "https://passionfruit.asia:8081/api";

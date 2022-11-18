export const BACKEND_PREFIX =
  process.env.NODE_ENV === "development"
    ? "http://localhost:7000"
    : "http://passionfruit.asia:8080/api";

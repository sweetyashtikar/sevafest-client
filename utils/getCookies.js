export const getCookie = (name) => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split("; ");

  for (let cookie of cookies) {
    const [key, ...rest] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(rest.join("="));
    }
  }

  return null;
};

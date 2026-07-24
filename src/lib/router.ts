import { useEffect, useState } from "react";

export function navigate(path: string) {
  window.location.hash = path.startsWith("#") ? path : `#${path}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function useRoute() {
  const read = () => window.location.hash.replace(/^#/, "") || "/";
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const handler = () => setRoute(read());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  return route;
}

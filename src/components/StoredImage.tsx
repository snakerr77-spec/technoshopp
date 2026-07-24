import type { ImgHTMLAttributes } from "react";
import { useImageSource } from "../lib/imageStore";

export function StoredImage({ src, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const source = useImageSource(typeof src === "string" ? src : undefined);
  return <img src={source} {...props} />;
}

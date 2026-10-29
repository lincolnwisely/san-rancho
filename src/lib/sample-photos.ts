// Photos of samples we've ordered, shown after Printify's mockups in the
// product gallery. Files live in public/samples/, keyed by Printify product id
// (the id at the end of the product URL), e.g.
//   "6acd343887c401878d0f76c2": ["/samples/honest-baby-jesus/front.jpg"],
// Images aren't optimized by Next.js (see next.config.ts), so export them as
// JPGs around 1500px wide.
export const SAMPLE_PHOTOS: Record<string, string[]> = {
    "6ac91f3ab0b07f13520b321b": ["/samples/san-rancho-logo-tee/front.jpg"], // san rancho logo tee
    "6acfd73020c3d63e1b07f62a": [
        "/samples/6acfd73020c3d63e1b07f62a/stickers.jpg",
        "/samples/6acfd73020c3d63e1b07f62a/stickers-with-penny.jpg"
    ], // hologram san rancho sticker
    "6ab7d6f9db3d85977c0214c6": ["/samples/6ab7d6f9db3d85977c0214c6/front.jpg"], // what if they're right hoodie
    "6ac6a8374b300b890b0c2d5d": ["/samples/6ac6a8374b300b890b0c2d5d/IMG_4448.png", "/samples/6ac6a8374b300b890b0c2d5d/world-on.png"
    ], // worlds on fire hoodie
    "6ace552da848062eca05613d": ["/samples/6ace552da848062eca05613d/IMG_4425.png"], // peoples temple crewneck (1-side)
    "6ad23b9f51522f9ea60f4a48": ["/samples/6ad23b9f51522f9ea60f4a48/IMG_4432.png"], // HIM tour crewneck 
};

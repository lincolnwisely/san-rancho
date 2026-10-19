// Photos of samples we've ordered, shown after Printify's mockups in the
// product gallery. Files live in public/samples/, keyed by Printify product id
// (the id at the end of the product URL), e.g.
//   "6acd343887c401878d0f76c2": ["/samples/honest-baby-jesus/front.jpg"],
// Images aren't optimized by Next.js (see next.config.ts), so export them as
// JPGs around 1500px wide.
export const SAMPLE_PHOTOS: Record<string, string[]> = {
    "6ac91f3ab0b07f13520b321b": ["/samples/san-rancho-logo-tee/front.jpg"],
    "6acfd73020c3d63e1b07f62a": [
        "/samples/san-rancho-deconversion-society-hologram-sticker/stickers.jpg",
        "/samples/san-rancho-deconversion-society-hologram-sticker/stickers-with-penny.jpg"
    ],
    "6ab7d6f9db3d85977c0214c6": ["/samples/what-if-theyre-right-hoodie/front.jpg"]

};

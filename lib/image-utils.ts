// Image optimization utilities

export interface ImageConfig {
  quality: number
  format: "webp" | "jpeg" | "png"
  sizes: number[]
}

export const defaultImageConfig: ImageConfig = {
  quality: 85,
  format: "webp",
  sizes: [320, 640, 768, 1024, 1280],
}

export function generateImageSrcSet(src: string, config: ImageConfig = defaultImageConfig): string {
  // In a real implementation, this would generate different sized versions
  // For now, we'll return the original image
  return config.sizes.map((size) => `${src} ${size}w`).join(", ")
}

export function getOptimizedImageUrl(src: string, width?: number, height?: number, quality = 85): string {
  // In a real implementation, this would use a service like Cloudinary or Next.js Image Optimization
  // For now, we'll return the original URL
  return src
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

export function preloadCriticalImages(images: string[]): Promise<void[]> {
  return Promise.all(images.map(preloadImage))
}

// Image lazy loading intersection observer
export function createImageObserver(callback: (entries: IntersectionObserverEntry[]) => void) {
  if (typeof window === "undefined") return null

  return new IntersectionObserver(callback, {
    rootMargin: "50px 0px",
    threshold: 0.01,
  })
}

// Product image mapping for consistent display
export const productImageMap = {
  "soy-sauce-140ml": "/images/soy-sauce-140ml.jpg",
  "soy-sauce-340ml": "/images/soy-sauce-340ml.jpg",
  "indomie-vegetable": "/images/indomie-vegetable.jpg",
  "indomie-cup": "/images/indomie-cup.jpg",
  "indomie-fried": "/images/indomie-fried.jpg",
  "indomie-chicken-curry": "/images/indomie-chicken-curry.jpg",
  "indomie-chicken": "/images/indomie-chicken.jpg",
  "steviana-sweetener": "/images/steviana-sweetener.png",
  "siwakf-toothpaste": "/images/siwakf-toothpaste.png",
  "aji-no-moto": "/images/aji-no-moto.jpg",
} as const

export type ProductImageKey = keyof typeof productImageMap

export function getProductImage(key: ProductImageKey): string {
  return productImageMap[key]
}

export function getAllProductImages(): string[] {
  return Object.values(productImageMap)
}
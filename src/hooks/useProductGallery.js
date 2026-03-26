import { useState } from 'react'

export function useProductGallery(images = [], colors = []) {
  const [activeIndex, setActiveIndex] = useState(0)

  // activeIndex 0 -> Reference image
  // activeIndex > 0 -> Variant image mapped to a color
  
  const activeImage = images[activeIndex] ?? images[0] ?? ''
  const activeColor = activeIndex > 0 ? (colors[activeIndex - 1] ?? null) : null

  const selectColor = (colorIndex) => {
    // colorIndex maps to images[colorIndex + 1]
    const targetImageIndex = colorIndex + 1;
    if (targetImageIndex < images.length) {
      setActiveIndex(targetImageIndex)
    }
  }

  const selectVariant = (index) => {
    if (index >= 0 && index < images.length) {
      setActiveIndex(index)
    }
  }

  return { activeImage, activeColor, activeIndex, selectVariant, selectColor }
}

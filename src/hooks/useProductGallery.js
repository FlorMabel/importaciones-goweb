import { useState } from 'react'

export function useProductGallery(images = [], colors = []) {
  const [activeIndex, setActiveIndex] = useState(0)

  const activeImage = images[activeIndex] ?? images[0] ?? ''
  const activeColor = colors[activeIndex] ?? colors[0] ?? null

  const selectVariant = (index) => {
    const limit = Math.max(images.length, colors.length) - 1
    if (index >= 0 && index <= limit) setActiveIndex(index)
  }

  return { activeImage, activeColor, activeIndex, selectVariant }
}

/**
 * Image Gallery Modal
 * Display post images in a full-screen gallery view
 */

import { useState } from 'react'
import { FiX, FiChevronLeft, FiChevronRight, FiDownload } from 'react-icons/fi'

export function ImageGalleryModal({ images, initialIndex = 0, isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!isOpen || !images || images.length === 0) return null

  const currentImage = images[currentIndex]

  const handlePrevious = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleDownload = (e) => {
    e.stopPropagation()
    if (currentImage) {
      const link = document.createElement('a')
      link.href = currentImage
      link.download = `civicsense-image-${currentIndex + 1}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 ${
        isFullscreen ? 'md:p-0' : 'md:p-8'
      }`}
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-60 p-2 hover:bg-white/20 rounded-full transition"
      >
        <FiX size={28} className="text-white" />
      </button>

      {/* Image Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Main Image */}
        <img
          src={currentImage}
          alt={`Image ${currentIndex + 1}`}
          className="w-full h-full object-contain rounded-lg"
          onClick={() => setIsFullscreen(!isFullscreen)}
        />

        {/* Navigation - Only show if multiple images */}
        {images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 hover:bg-white/50 text-white rounded-full transition"
            >
              <FiChevronLeft size={24} />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 hover:bg-white/50 text-white rounded-full transition"
            >
              <FiChevronRight size={24} />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="absolute bottom-4 right-4 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
          title="Download image"
        >
          <FiDownload size={20} />
        </button>
      </div>
    </div>
  )
}

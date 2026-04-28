/**
 * CreatePostModal Component
 * Modal for creating new posts with image and text
 */

import { useState, useRef, useEffect } from 'react'
import { FiX, FiImage, FiLoader } from 'react-icons/fi'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

export function CreatePostModal({ isOpen, onClose, onSubmit, isLoading = false }) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [location, setLocation] = useState(null)
  const [aiResult, setAiResult] = useState(null)
  const fileInputRef = useRef(null)

  // Get user location
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            label: 'Current location',
            state: 'Delhi',
          })
        },
        (err) => {
          console.error('Location error:', err)
          setLocation({
            lat: 28.6139,
            lon: 77.209,
            label: 'New Delhi',
            state: 'Delhi',
          })
        }
      )
    }
  }, [isOpen])

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!content.trim() && !image) {
      alert('Please add content or an image')
      return
    }

    if (onSubmit) {
      const result = await onSubmit({
        content: content.trim(),
        image,
        location,
      })

      // Show AI result if available
      if (result?.aiClassification) {
        setAiResult(result.aiClassification)
      }

      // Reset form on success
      if (result?.success) {
        setContent('')
        setImage(null)
        setImagePreview(null)
        setAiResult(null)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:items-end md:justify-end md:rounded-none md:p-0">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto md:rounded-none md:max-h-screen md:max-w-3xl md:border-l md:border-gray-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Report an Issue</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Info */}
          <p className="text-sm text-gray-600">
            Help your community by reporting civic issues. Photos improve AI accuracy!
          </p>

          {/* Image Upload */}
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              <div className="flex flex-col items-center gap-2">
                <FiImage size={32} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">
                  {imagePreview ? 'Change image' : 'Add image'}
                </span>
                <span className="text-xs text-gray-500">JPG, PNG up to 10MB</span>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={isLoading}
              className="hidden"
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-3 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  onClick={() => {
                    setImage(null)
                    setImagePreview(null)
                  }}
                  disabled={isLoading}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <FiX size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Content Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
              placeholder="What civic issue are you reporting? Be specific..."
              className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.length} / 500 characters
            </p>
          </div>

          {/* Location */}
          {location && (
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <p className="text-gray-700">
                📍 Location detected: <span className="font-semibold">{location.lat.toFixed(4)}, {location.lon.toFixed(4)}</span>
              </p>
            </div>
          )}

          {/* AI Results */}
          {aiResult && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">AI Analysis Complete</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Category:</span>
                  <Badge category={aiResult.category} variant="category" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Severity:</span>
                  <Badge severity={aiResult.severity} variant="severity" />
                </div>
                <p className="text-sm text-gray-700">
                  Confidence: <span className="font-semibold">{(aiResult.confidence * 100).toFixed(0)}%</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4 flex gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading || (!content.trim() && !image)}
            className="flex-1"
          >
            {isLoading ? 'Analyzing...' : 'Post'}
          </Button>
        </div>
      </div>
    </div>
  )
}

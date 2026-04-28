import { useState, useRef } from 'react'
import { FiCamera, FiMapPin, FiLoader } from 'react-icons/fi'
import { mockApi } from '../mockApi'

const ZONES = [
  'Hospital',
  'School',
  'Residential',
  'Commercial',
  'Market',
]

export default function SubmitForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    description: '',
    citizenName: '',
    citizenEmail: '',
    latitude: 28.5244,
    longitude: 77.3958,
    zoneType: 'Residential',
    image: null,
  })

  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onload = (event) => setPreview(event.target.result)
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const handleGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      })
    }
  }

  const handleAnalyzeImage = async () => {
    if (!formData.image) {
      setError('Please select an image first')
      return
    }

    setLoading(true)
    try {
      const result = await mockApi.analyzeImage(
        formData.image,
        formData.latitude,
        formData.longitude,
        formData.zoneType
      )
      setAiResult(result)
    } catch (err) {
      setError('Error analyzing image. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.image) {
      setError('Please select an image')
      return
    }

    if (!formData.citizenName || !formData.citizenEmail) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const submission = {
        issueType: aiResult?.issueType || 'Unknown',
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
        imageUrl: preview,
        zoneType: formData.zoneType,
        citizenEmail: formData.citizenEmail,
        citizenName: formData.citizenName,
        priority: aiResult?.priority || 'MEDIUM',
        tensionScore: parseFloat(aiResult?.tensionScore) || 50,
        confidence: parseFloat(aiResult?.confidence) || 0.5,
      }

      await mockApi.submitComplaint(submission)
      onSubmit(submission)
      alert('Report submitted successfully!')

      // Reset form
      setFormData({
        description: '',
        citizenName: '',
        citizenEmail: '',
        latitude: 28.5244,
        longitude: 77.3958,
        zoneType: 'Residential',
        image: null,
      })
      setPreview(null)
      setAiResult(null)
    } catch (err) {
      setError('Error submitting report. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Report an Issue
          </h1>
          <p className="text-gray-600">
            Help improve your community by reporting civic issues
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Image Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              <FiCamera className="inline mr-2" />
              Upload Photo
            </label>

            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute top-2 right-2 bg-white rounded-lg px-3 py-2 shadow hover:shadow-md transition-shadow"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors"
              >
                <FiCamera className="mx-auto text-4xl text-gray-400 mb-2" />
                <p className="text-gray-600 font-medium">Click to upload</p>
                <p className="text-gray-500 text-sm">or drag and drop</p>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* AI Analysis */}
          {preview && !aiResult && (
            <button
              type="button"
              onClick={handleAnalyzeImage}
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Analyzing image...
                </>
              ) : (
                'Analyze with AI'
              )}
            </button>
          )}

          {/* AI Result */}
          {aiResult && (
            <div className="bg-gradient-to-r from-primary to-red-600 rounded-lg shadow p-6 text-white">
              <p className="text-sm opacity-90 mb-2">AI Analysis Result</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs opacity-75 mb-1">Detected Issue</p>
                  <p className="text-lg font-bold">{aiResult.issueType}</p>
                </div>
                <div>
                  <p className="text-xs opacity-75 mb-1">Priority</p>
                  <p className="text-lg font-bold">{aiResult.priority}</p>
                </div>
                <div>
                  <p className="text-xs opacity-75 mb-1">Confidence</p>
                  <p className="text-lg font-bold">{(parseFloat(aiResult.confidence) * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-xs opacity-75 mb-1">Tension Score</p>
                  <p className="text-lg font-bold">{aiResult.tensionScore}/100</p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the issue in detail..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows="4"
            />
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              <FiMapPin className="inline mr-2" />
              Location
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      latitude: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      longitude: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleGeoLocation}
              className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors"
            >
              Use My Location
            </button>
          </div>

          {/* Zone Type */}
          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Zone Type
            </label>
            <select
              value={formData.zoneType}
              onChange={(e) =>
                setFormData({ ...formData, zoneType: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.citizenName}
                  onChange={(e) =>
                    setFormData({ ...formData, citizenName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.citizenEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, citizenEmail: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

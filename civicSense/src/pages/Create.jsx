/**
 * Create Post Page
 * Form for creating new posts/complaints
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreatePostModal } from '../components/post/CreatePostModal'
import { postsAPI } from '../services/api'

export function CreatePage() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleClose = () => {
    navigate('/')
  }

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await postsAPI.createPost(
        formData.image,
        formData.content,
        formData.location?.lat || 28.6139,
        formData.location?.lon || 77.209,
        formData.location?.label || 'Unknown area',
        formData.location?.state || 'Delhi',
        false
      )

      // Success!
      setIsOpen(false)
      navigate('/')

      return {
        success: true,
        aiClassification: response.data,
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create post'
      setError(message)
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-50 pt-6 pb-28 md:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Community report</p>
            <h1 className="text-4xl font-bold text-slate-900">Create a new civic post</h1>
            <p className="mt-3 text-slate-600 max-w-2xl">
              Share what you see in your neighborhood and help authorities respond faster.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 px-4 py-2 font-semibold hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        </div>
        <CreatePostModal
          isOpen={isOpen}
          onClose={handleClose}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

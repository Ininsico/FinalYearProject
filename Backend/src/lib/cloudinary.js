import cloudinaryPackage from 'cloudinary'
import { env } from '../config/env.js'

const { v2: cloudinary } = cloudinaryPackage

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true,
})

export const cloudinaryConfigured = () =>
  Boolean(env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret)

/**
 * Upload a profile picture. Keyed per user with overwrite so replacing a
 * picture never leaves orphaned assets behind. Square face-cropped at 512px.
 */
export function uploadAvatar(buffer, userId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'fablet/avatars',
        public_id: `user-${userId}`,
        overwrite: true,
        resource_type: 'image',
        transformation: [{ width: 512, height: 512, crop: 'fill', gravity: 'face' }],
      },
      (error, result) => (error ? reject(error) : resolve(result))
    )
    stream.end(buffer)
  })
}

export function removeAvatar(publicId) {
  return cloudinary.uploader.destroy(publicId)
}

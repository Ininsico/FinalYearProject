import { Router } from 'express'
import { z } from 'zod'
import mongoose from 'mongoose'
import NewsPost from '../models/NewsPost.js'
import { requireAuth } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/admin.js'

const router = Router()

const serialize = (post) => ({
  id: String(post._id),
  title: post.title,
  tag: post.tag,
  body: post.body,
  published: post.published,
  publishedAt: post.publishedAt,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
})

const postBody = z.object({
  title: z.string().trim().min(2).max(160),
  tag: z.string().trim().max(40).optional().default(''),
  body: z.string().trim().min(2).max(8000),
  published: z.boolean().optional(),
})

const patchBody = postBody.partial()

/** The student feed: published posts, newest first. */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const posts = await NewsPost.find({ published: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(50)
    res.json({ posts: posts.map(serialize) })
  } catch (error) {
    next(error)
  }
})

/** Operator list, drafts included. */
router.get('/admin', requireAdmin, async (req, res, next) => {
  try {
    const posts = await NewsPost.find({}).sort({ createdAt: -1 }).limit(100)
    res.json({ posts: posts.map(serialize) })
  } catch (error) {
    next(error)
  }
})

router.post('/admin', requireAdmin, async (req, res, next) => {
  try {
    const parsed = postBody.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message })
    }
    const published = Boolean(parsed.data.published)
    const post = await NewsPost.create({
      ...parsed.data,
      published,
      publishedAt: published ? new Date() : null,
      authorId: req.userId,
    })
    res.status(201).json({ post: serialize(post) })
  } catch (error) {
    next(error)
  }
})

router.patch('/admin/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Unknown post.' })
    }
    const parsed = patchBody.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message })
    }

    const post = await NewsPost.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    Object.assign(post, parsed.data)
    if (typeof parsed.data.published === 'boolean') {
      post.publishedAt = parsed.data.published ? post.publishedAt ?? new Date() : null
    }
    await post.save()

    res.json({ post: serialize(post) })
  } catch (error) {
    next(error)
  }
})

router.delete('/admin/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Unknown post.' })
    }
    await NewsPost.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

export default router

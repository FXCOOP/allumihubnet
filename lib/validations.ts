import { z } from 'zod'

export const signupSchema = z.object({
  email: z.string().email('אימייל לא תקין'),
  password: z.string().min(6, 'סיסמה חייבת להכיל לפחות 6 תווים'),
  firstName: z.string().min(2, 'שם פרטי חייב להכיל לפחות 2 תווים'),
  lastName: z.string().min(2, 'שם משפחה חייב להכיל לפחות 2 תווים'),
})

export const loginSchema = z.object({
  email: z.string().email('אימייל לא תקין'),
  password: z.string().min(1, 'סיסמה נדרשת'),
})

export const profileSchema = z.object({
  firstName: z.string().min(2, 'שם פרטי חייב להכיל לפחות 2 תווים'),
  lastName: z.string().min(2, 'שם משפחה חייב להכיל לפחות 2 תווים'),
  city: z.string().optional(),
  country: z.string().optional(),
  currentRole: z.string().optional(),
  bio: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  canHelpWith: z.string().optional(),
  lookingFor: z.string().optional(),
})

export const postSchema = z.object({
  type: z.enum(['general', 'opportunity', 'question']),
  title: z.string().min(3, 'כותרת חייבת להכיל לפחות 3 תווים'),
  content: z.string().min(10, 'תוכן חייב להכיל לפחות 10 תווים'),
})

export const commentSchema = z.object({
  content: z.string().min(1, 'תגובה לא יכולה להיות ריקה'),
})

export const eventSchema = z.object({
  title: z.string().min(3, 'כותרת חייבת להכיל לפחות 3 תווים'),
  description: z.string().optional(),
  locationText: z.string().optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  maxAttendees: z.number().positive().optional(),
})

export const businessProfileSchema = z.object({
  businessName: z.string().min(2, 'שם העסק חייב להכיל לפחות 2 תווים'),
  category: z.string().min(1, 'קטגוריה נדרשת'),
  shortDescription: z.string().min(10, 'תיאור חייב להכיל לפחות 10 תווים'),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
})

export const messageSchema = z.object({
  content: z.string().min(1, 'הודעה לא יכולה להיות ריקה'),
})

import { z } from "zod"

export const createCompanySchema = z.object({
  name: z.string().min(2, "Nombre muy corto").max(100),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  subdomain: z
    .string()
    .min(2)
    .max(30)
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
})

export const createCampaignSchema = z.object({
  title: z.string().min(2).max(200),
  pushMessage: z.string().min(2).max(500),
  imageUrl: z.string().url().optional().nullable(),
  segmentId: z.string().optional().nullable(),
  landingPageId: z.string().optional().nullable(),
  actionType: z
    .enum([
      "LANDING_INTERNA",
      "WHATSAPP",
      "PDF",
      "MAPS",
      "URL_EXTERNA",
      "LLAMAR",
      "FORMULARIO",
    ])
    .default("LANDING_INTERNA"),
  actionValue: z.string().max(500).optional().nullable(),
  priority: z.enum(["NORMAL", "URGENTE"]).default("NORMAL"),
  scheduledAt: z.string().datetime().optional().nullable(),
  companyId: z.string().optional().nullable(),
})

export const createSegmentSchema = z.object({
  name: z.string().min(2).max(100),
  companyId: z.string().optional(),
})

export const createLandingSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  content: z.array(z.any()).optional(),
  companyId: z.string().optional(),
})

export const createDocumentSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(500).optional().nullable(),
  fileUrl: z.string().url("URL no válida"),
  category: z.string().default("general"),
})

export const createEventSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(1000).optional().nullable(),
  date: z.string().min(1, "Fecha obligatoria"),
  location: z.string().max(200).optional().nullable(),
})

export const registerSubscriberSchema = z.object({
  onesignalId: z.string().min(1),
  companyId: z.string().min(1),
  deviceInfo: z.any().optional(),
})

export const sendNotificationSchema = z.object({
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(500),
  url: z.string().url().optional(),
  segmentId: z.string().optional(),
  onesignalPlayerIds: z.array(z.string()).optional(),
  priority: z.number().min(1).max(10).optional(),
})

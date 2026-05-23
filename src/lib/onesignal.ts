const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID!
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY!

export async function sendPushNotification({
  headings,
  contents,
  url,
  segmentId,
  onesignalPlayerIds,
  priority = 5,
}: {
  headings: Record<string, string>
  contents: Record<string, string>
  url?: string
  segmentId?: string
  onesignalPlayerIds?: string[]
  priority?: number
}) {
  if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
    throw new Error("OneSignal no está configurado")
  }

  const body: Record<string, unknown> = {
    app_id: ONESIGNAL_APP_ID,
    target_channel: "push",
    headings: { en: Object.values(headings)[0], ...headings },
    contents: { en: Object.values(contents)[0], ...contents },
    priority,
  }

  if (url) body.url = url
  if (segmentId) {
    body.filters = [{ field: "tag", key: "company_id", relation: "=", value: segmentId }]
  }
  if (onesignalPlayerIds?.length) {
    body.include_player_ids = onesignalPlayerIds
  }

  const res = await fetch("https://onesignal.com/api/v1/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OneSignal error: ${err}`)
  }

  return res.json()
}

export function getOneSignalAppId() {
  return ONESIGNAL_APP_ID
}

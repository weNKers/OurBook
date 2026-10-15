export const FEEDBACK_EMAIL = 'ilovecqnk@163.com'

function encodeMailtoValue (value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`)
}

export function createFeedbackMailto (subject: string, body: string) {
  const normalizedBody = body.replace(/\r\n?|\n/g, '\r\n')
  return `mailto:${FEEDBACK_EMAIL}?subject=${encodeMailtoValue(subject)}&body=${encodeMailtoValue(normalizedBody)}`
}

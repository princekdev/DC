import { STATUSES, TYPES } from './constants'

// Returns an object keyed by field name -> error message.
// An empty object means the form is valid.
export function validateOpportunity(values) {
  const errors = {}

  const company = (values.company || '').trim()
  if (!company) {
    errors.company = 'Company name is required.'
  } else if (company.length > 100) {
    errors.company = 'Company name must be under 100 characters.'
  }

  const role = (values.role || '').trim()
  if (!role) {
    errors.role = 'Role or position title is required.'
  } else if (role.length > 100) {
    errors.role = 'Role must be under 100 characters.'
  }

  if (!values.type || !TYPES.includes(values.type)) {
    errors.type = 'Please choose a valid opportunity type.'
  }

  if (!values.status || !STATUSES.includes(values.status)) {
    errors.status = 'Please choose a valid status.'
  }

  if (values.deadline) {
    const parsed = new Date(values.deadline)
    if (Number.isNaN(parsed.getTime())) {
      errors.deadline = 'Enter a valid date.'
    }
  }

  const link = (values.link || '').trim()
  if (link) {
    try {
      // Accept bare domains by prefixing a scheme when missing.
      const candidate = /^https?:\/\//i.test(link) ? link : `https://${link}`
      // eslint-disable-next-line no-new
      new URL(candidate)
    } catch {
      errors.link = 'Enter a valid URL (e.g. https://company.com/careers).'
    }
  }

  const notes = (values.notes || '').trim()
  if (notes.length > 500) {
    errors.notes = 'Notes must be under 500 characters.'
  }

  return errors
}

export function normalizeLink(link) {
  const trimmed = (link || '').trim()
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

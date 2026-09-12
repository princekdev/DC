// Single source of truth for status values so the form, filters,
// dashboard math, and badge styling can never drift out of sync.
export const STATUSES = [
  'Wishlist',
  'Applied',
  'Interview',
  'Selected',
  'Completed',
  'Rejected',
]

export const TYPES = ['Internship', 'Full-time', 'Fellowship', 'Freelance/Project', 'Other']

export const STORAGE_KEY = 'ledger.opportunities.v1'

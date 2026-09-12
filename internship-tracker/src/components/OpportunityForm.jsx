import { useEffect, useRef, useState } from 'react'
import { STATUSES, TYPES } from '../utils/constants'
import { validateOpportunity } from '../utils/validation'

const EMPTY_FORM = {
  company: '',
  role: '',
  type: TYPES[0],
  deadline: '',
  status: STATUSES[0],
  link: '',
  notes: '',
}

// Controlled form used for both creating and editing an opportunity.
// `editingItem` is null when adding, or the record being edited.
export default function OpportunityForm({ editingItem, onSave, onCancel }) {
  const [values, setValues] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const firstFieldRef = useRef(null)

  useEffect(() => {
    if (editingItem) {
      setValues({ ...EMPTY_FORM, ...editingItem })
    } else {
      setValues(EMPTY_FORM)
    }
    setErrors({})
    setTouched({})
    firstFieldRef.current?.focus()
  }, [editingItem])

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(validateOpportunity({ ...values }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validateOpportunity(values)
    setErrors(validationErrors)
    setTouched({
      company: true,
      role: true,
      type: true,
      status: true,
      deadline: true,
      link: true,
      notes: true,
    })

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    onSave({
      ...values,
      company: values.company.trim(),
      role: values.role.trim(),
      notes: values.notes.trim(),
      link: values.link.trim(),
    })
  }

  const showError = (field) => touched[field] && errors[field]

  return (
    <form className="form" onSubmit={handleSubmit} noValidate aria-label={editingItem ? 'Edit opportunity' : 'Add opportunity'}>
      <div className="form__grid">
        <div className="field">
          <label htmlFor="company">
            Company <span aria-hidden="true">*</span>
          </label>
          <input
            id="company"
            ref={firstFieldRef}
            type="text"
            value={values.company}
            onChange={(e) => handleChange('company', e.target.value)}
            onBlur={() => handleBlur('company')}
            aria-required="true"
            aria-invalid={Boolean(showError('company'))}
            aria-describedby={showError('company') ? 'company-error' : undefined}
          />
          {showError('company') && (
            <p className="field__error" id="company-error" role="alert">
              {errors.company}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="role">
            Role <span aria-hidden="true">*</span>
          </label>
          <input
            id="role"
            type="text"
            placeholder="e.g. Frontend Engineering Intern"
            value={values.role}
            onChange={(e) => handleChange('role', e.target.value)}
            onBlur={() => handleBlur('role')}
            aria-required="true"
            aria-invalid={Boolean(showError('role'))}
            aria-describedby={showError('role') ? 'role-error' : undefined}
          />
          {showError('role') && (
            <p className="field__error" id="role-error" role="alert">
              {errors.role}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            value={values.type}
            onChange={(e) => handleChange('type', e.target.value)}
            onBlur={() => handleBlur('type')}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={values.status}
            onChange={(e) => handleChange('status', e.target.value)}
            onBlur={() => handleBlur('status')}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="deadline">Deadline</label>
          <input
            id="deadline"
            type="date"
            value={values.deadline}
            onChange={(e) => handleChange('deadline', e.target.value)}
            onBlur={() => handleBlur('deadline')}
            aria-invalid={Boolean(showError('deadline'))}
            aria-describedby={showError('deadline') ? 'deadline-error' : undefined}
          />
          {showError('deadline') && (
            <p className="field__error" id="deadline-error" role="alert">
              {errors.deadline}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="link">Application link</label>
          <input
            id="link"
            type="text"
            inputMode="url"
            placeholder="company.com/careers"
            value={values.link}
            onChange={(e) => handleChange('link', e.target.value)}
            onBlur={() => handleBlur('link')}
            aria-invalid={Boolean(showError('link'))}
            aria-describedby={showError('link') ? 'link-error' : undefined}
          />
          {showError('link') && (
            <p className="field__error" id="link-error" role="alert">
              {errors.link}
            </p>
          )}
        </div>

        <div className="field field--full">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            rows={3}
            maxLength={500}
            placeholder="Referral contact, interview prep, follow-up reminders…"
            value={values.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            onBlur={() => handleBlur('notes')}
            aria-invalid={Boolean(showError('notes'))}
            aria-describedby={showError('notes') ? 'notes-error' : 'notes-help'}
          />
          {showError('notes') ? (
            <p className="field__error" id="notes-error" role="alert">
              {errors.notes}
            </p>
          ) : (
            <p className="field__help" id="notes-help">
              {values.notes.length}/500 characters
            </p>
          )}
        </div>
      </div>

      <div className="form__actions">
        <button type="submit" className="btn btn--primary">
          {editingItem ? 'Save changes' : 'Add opportunity'}
        </button>
        {editingItem && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

'use client'

import React, { useMemo, useState } from 'react'

type Props = {
  // Numeric ID from Postgres. We type it as number-or-string and coerce
  // before sending so the relationship is preserved correctly server-side
  // (Payload was iterating string IDs char-by-char and rejecting them).
  productID: number | string
  productTitle: string
  disabled?: boolean
}

export function ReserveForm({ productID, productTitle, disabled }: Props) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const formId = useMemo(() => `reserve-${productID}`, [productID])

  return (
    <form
      id={formId}
      className="border border-border rounded-lg bg-card p-5"
      onSubmit={async (e) => {
        e.preventDefault()
        if (disabled) return

        setStatus('submitting')
        setErrorMessage(null)

        const form = e.currentTarget
        const formData = new FormData(form)

        // Coerce productID to a number — sending it as a string causes
        // Payload's relationship validator to iterate the string character by
        // character (e.g. "10" → ["1", "0"]) and reject the request.
        const productIDNum = typeof productID === 'number' ? productID : Number(productID)

        const payload = {
          product: Number.isFinite(productIDNum) ? productIDNum : productID,
          fullName: String(formData.get('fullName') || '').trim(),
          mobile: String(formData.get('mobile') || '').trim(),
          email: String(formData.get('email') || '').trim(),
          message: String(formData.get('message') || '').trim() || undefined,
          // Honeypot: real users won't see this field. Bots usually fill every
          // input, so a non-empty value tells the server to reject the request.
          // Name is deliberately obscure to avoid browser autofill (Chrome
          // and Safari autofill "website", "url", "company", etc.).
          hp_field: String(formData.get('hp_field') || ''),
        }

        try {
          const res = await fetch('/api/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

          if (!res.ok) {
            const text = await res.text().catch(() => '')
            throw new Error(text || `Request failed with status ${res.status}`)
          }

          form.reset()
          setStatus('success')
        } catch (err) {
          setStatus('error')
          setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
        }
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-medium">Reserve this product</div>
          <div className="text-sm text-muted-foreground mt-1">
            We’ll hold <span className="font-medium text-foreground">{productTitle}</span> for pickup and payment in
            store.
          </div>
        </div>
      </div>

      {/* Honeypot — visually hidden, ignored by real users, filled by bots.
          The name `hp_field` is deliberately obscure so password managers and
          browser autofill don't fill it in (which used to trigger the trap
          for legitimate users typing into the real fields). */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor={`${formId}-hp`}>Leave this field empty</label>
        <input
          id={`${formId}-hp`}
          name="hp_field"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          data-form-type="other"
          data-lpignore="true"
          data-1p-ignore="true"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
        <Field label="Full name" name="fullName" required disabled={disabled || status === 'submitting'} />
        <Field label="Mobile" name="mobile" required disabled={disabled || status === 'submitting'} />
        <Field label="Email" name="email" required type="email" disabled={disabled || status === 'submitting'} />
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1" htmlFor={`${formId}-message`}>
            Message (optional)
          </label>
          <textarea
            id={`${formId}-message`}
            name="message"
            rows={4}
            maxLength={1000}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            disabled={disabled || status === 'submitting'}
            placeholder="Anything we should know?"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium disabled:opacity-50"
          disabled={disabled || status === 'submitting'}
        >
          {status === 'submitting' ? 'Submitting…' : 'Reserve'}
        </button>

        {status === 'success' ? (
          <div className="text-sm text-green-600 dark:text-green-400">Reservation received. Thank you!</div>
        ) : null}
        {status === 'error' ? (
          <div className="text-sm text-red-600 dark:text-red-400">
            Could not submit. {errorMessage ? <span className="break-all">{errorMessage}</span> : null}
          </div>
        ) : null}
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  required,
  disabled,
  type = 'text',
}: {
  label: string
  name: string
  required?: boolean
  disabled?: boolean
  type?: string
}) {
  const id = `${name}-field`
  return (
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
      />
    </div>
  )
}


'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Minus, Plus } from 'lucide-react'

import RichText from '@/components/RichText'
import { resolveFontFamily } from '@/fields/fontFamilySelect'
import { cn } from '@/utilities/ui'
import { useGoogleFont } from '@/utilities/useGoogleFont'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

// We type props locally so the component compiles cleanly before Payload
// regenerates types from the new block config. After your next
// `pnpm payload generate:types` you can swap to the generated `FAQsBlock`.
type FAQItem = {
  id?: string | null
  question: DefaultTypedEditorState
  answer: DefaultTypedEditorState
  defaultOpen?: boolean | null
}

type FAQsProps = {
  anchorId?: string | null
  title?: DefaultTypedEditorState | null
  subtitle?: DefaultTypedEditorState | null
  items?: FAQItem[] | null
  allowMultipleOpen?: boolean | null

  // Section
  backgroundColor?: string | null
  maxWidth?: string | null

  // Title / subtitle
  titleColor?: string | null
  titleFontFamily?: string | null
  subtitleColor?: string | null
  subtitleFontFamily?: string | null

  // Card boxes
  cardBackgroundColor?: string | null
  cardBorderColor?: string | null
  questionColor?: string | null
  questionFontFamily?: string | null
  answerColor?: string | null
  answerFontFamily?: string | null

  // Toggle icon button
  iconBackgroundColor?: string | null
  iconColor?: string | null

  blockType?: 'faqs'
  disableInnerContainer?: boolean
}

/**
 * Casa Soria — "FAQs" block.
 *
 * Renders a stack of question/answer rows that expand on click. The first
 * card matches the layout in the design reference: white pill-shaped cards
 * with a circular +/− toggle on the right and the answer slides in below
 * the question when active.
 *
 * Every visual aspect (section background, card background/border, text
 * colors, fonts and the toggle button colors) is controlled from the CMS
 * so each instance of the block can be themed independently.
 */
export const FAQsBlock: React.FC<FAQsProps> = ({
  anchorId,
  title,
  subtitle,
  items,
  allowMultipleOpen,
  backgroundColor,
  maxWidth,
  titleColor,
  titleFontFamily,
  subtitleColor,
  subtitleFontFamily,
  cardBackgroundColor,
  cardBorderColor,
  questionColor,
  questionFontFamily,
  answerColor,
  answerFontFamily,
  iconBackgroundColor,
  iconColor,
}) => {
  const faqs = Array.isArray(items) ? items.filter((i) => i && typeof i === 'object') : []

  const titleFont = resolveFontFamily(titleFontFamily)
  const subtitleFont = resolveFontFamily(subtitleFontFamily)
  const questionFont = resolveFontFamily(questionFontFamily)
  const answerFont = resolveFontFamily(answerFontFamily)

  useGoogleFont(titleFont)
  useGoogleFont(subtitleFont)
  useGoogleFont(questionFont)
  useGoogleFont(answerFont)

  // Initialize the open state from `defaultOpen` flags. We keep an array of
  // booleans (indexed by item position) rather than a Set so the controlled
  // toggle logic remains trivial to reason about for editors looking at it
  // later. Honor `allowMultipleOpen` on the initial render too — if the
  // editor disabled it but marked several items as default open, we only
  // keep the first one open.
  const [open, setOpen] = useState<boolean[]>(() => {
    const initial = faqs.map((it) => Boolean(it.defaultOpen))
    if (!allowMultipleOpen) {
      let kept = false
      return initial.map((v) => {
        if (v && !kept) {
          kept = true
          return true
        }
        return false
      })
    }
    return initial
  })

  // Keep local state in sync if the editor reorders/adds/removes items in
  // the live preview without us doing a hard refresh.
  useEffect(() => {
    setOpen((prev) => {
      const next = faqs.map((it, idx) => prev[idx] ?? Boolean(it.defaultOpen))
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faqs.length])

  const toggle = useCallback(
    (index: number) => {
      setOpen((prev) => {
        const next = allowMultipleOpen
          ? [...prev]
          : prev.map(() => false)
        next[index] = !prev[index]
        return next
      })
    },
    [allowMultipleOpen],
  )

  if (faqs.length === 0) return null

  return (
    <section
      id={anchorId ?? undefined}
      className="relative w-full"
      style={{ backgroundColor: backgroundColor ?? '#0a0a0a' }}
    >
      <div
        className="mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
        style={{ maxWidth: maxWidth ?? '64rem' }}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <header className="mb-10 text-center sm:mb-12">
          {title ? (
            <div
              className="faqs-title text-3xl font-semibold sm:text-4xl lg:text-5xl"
              style={{
                color: titleColor ?? '#ffffff',
                fontFamily: titleFont,
              }}
            >
              <RichText data={title} enableGutter={false} enableProse={false} />
            </div>
          ) : null}

          {subtitle ? (
            <div
              className="faqs-subtitle mt-3 text-sm sm:text-base"
              style={{
                color: subtitleColor ?? '#cbd5e1',
                fontFamily: subtitleFont,
              }}
            >
              <RichText data={subtitle} enableGutter={false} enableProse={false} />
            </div>
          ) : null}
        </header>

        {/* ── Items ───────────────────────────────────────────────────── */}
        <ul className="flex flex-col gap-3 sm:gap-4">
          {faqs.map((item, idx) => (
            <FAQItemRow
              key={item.id ?? idx}
              item={item}
              isOpen={open[idx] ?? false}
              onToggle={() => toggle(idx)}
              cardBackgroundColor={cardBackgroundColor ?? undefined}
              cardBorderColor={cardBorderColor ?? undefined}
              questionColor={questionColor ?? undefined}
              questionFontFamily={questionFont}
              answerColor={answerColor ?? undefined}
              answerFontFamily={answerFont}
              iconBackgroundColor={iconBackgroundColor ?? undefined}
              iconColor={iconColor ?? undefined}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Item
// ─────────────────────────────────────────────────────────────────────────────

type FAQItemRowProps = {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
  cardBackgroundColor?: string
  cardBorderColor?: string
  questionColor?: string
  questionFontFamily?: string
  answerColor?: string
  answerFontFamily?: string
  iconBackgroundColor?: string
  iconColor?: string
}

const FAQItemRow: React.FC<FAQItemRowProps> = ({
  item,
  isOpen,
  onToggle,
  cardBackgroundColor,
  cardBorderColor,
  questionColor,
  questionFontFamily,
  answerColor,
  answerFontFamily,
  iconBackgroundColor,
  iconColor,
}) => {
  const { question, answer } = item

  return (
    <li
      className={cn(
        'group relative overflow-hidden rounded-2xl border transition-shadow',
        // The shadow under the active card matches the reference design — a
        // soft halo that makes the open card feel slightly elevated.
        isOpen ? 'shadow-lg' : 'shadow-sm',
      )}
      style={{
        backgroundColor: cardBackgroundColor ?? '#ffffff',
        borderColor: cardBorderColor ?? 'transparent',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
      >
        <div
          className="faqs-question flex-1 text-base font-medium sm:text-lg"
          style={{
            color: questionColor ?? '#0a0a0a',
            fontFamily: questionFontFamily,
          }}
        >
          <RichText data={question} enableGutter={false} enableProse={false} />
        </div>

        <span
          aria-hidden
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300',
            isOpen ? 'rotate-0' : 'rotate-0',
          )}
          style={{
            backgroundColor: iconBackgroundColor ?? '#0f4c3a',
            color: iconColor ?? '#ffffff',
          }}
        >
          {isOpen ? (
            <Minus className="size-4" strokeWidth={2.5} />
          ) : (
            <Plus className="size-4" strokeWidth={2.5} />
          )}
        </span>
      </button>

      {/* Answer panel — uses grid-rows trick for a smooth max-height animation
          that works without measuring DOM dimensions. */}
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div
            className="faqs-answer px-5 pb-5 text-sm sm:px-6 sm:pb-6 sm:text-base"
            style={{
              color: answerColor ?? '#475569',
              fontFamily: answerFontFamily,
            }}
          >
            <RichText data={answer} enableGutter={false} enableProse={false} />
          </div>
        </div>
      </div>
    </li>
  )
}

export default FAQsBlock

'use client'
import { Highlight, themes } from 'prism-react-renderer'
import React from 'react'
import { CopyButton } from './CopyButton'

type Props = {
  code: string
  language?: string
}

export const Code: React.FC<Props> = ({ code, language = '' }) => {
  if (!code) return null

  return (
    <Highlight code={code} language={language} theme={themes.vsDark}>
      {({ getLineProps, getTokenProps, tokens }) => (
        <pre className="relative overflow-x-auto rounded-2xl border border-[color-mix(in_oklch,var(--border)_55%,var(--payload-block-accent)_35%)] bg-[linear-gradient(165deg,oklch(16%_0.02_265)_0%,oklch(12%_0.03_265)_48%,oklch(10%_0.02_265)_100%)] p-5 text-[13px] leading-relaxed text-[color-mix(in_oklch,white_92%,var(--payload-block-accent-soft))] shadow-[inset_0_1px_0_oklch(100%_0_0deg_/_0.06)] ring-1 ring-[color-mix(in_oklch,var(--payload-block-accent)_25%,transparent)]">
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ className: 'table-row', line })}>
              <span className="table-cell select-none text-right text-white/25">{i + 1}</span>
              <span className="table-cell pl-4">
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            </div>
          ))}
          <CopyButton code={code} />
        </pre>
      )}
    </Highlight>
  )
}

'use client'
import { Button } from '@/components/ui/button'
import { CopyIcon } from '@payloadcms/ui/icons/Copy'
import { useState } from 'react'

export function CopyButton({ code }: { code: string }) {
  const [text, setText] = useState('Copy')

  function updateCopyStatus() {
    if (text === 'Copy') {
      setText(() => 'Copied!')
      setTimeout(() => {
        setText(() => 'Copy')
      }, 1000)
    }
  }

  return (
    <div className="flex justify-end pt-3">
      <Button
        className="gap-1.5 rounded-full border border-[color-mix(in_oklch,var(--payload-block-accent)_45%,transparent)] bg-[color-mix(in_oklch,var(--payload-block-accent)_12%,oklch(18%_0.02_265))] px-4 py-1 text-xs font-medium text-[color-mix(in_oklch,white_92%,var(--payload-block-accent))] shadow-sm backdrop-blur-sm transition-[background-color,transform] hover:bg-[color-mix(in_oklch,var(--payload-block-accent)_22%,oklch(18%_0.02_265))] hover:-translate-y-px"
        variant="ghost"
        onClick={async () => {
          await navigator.clipboard.writeText(code)
          updateCopyStatus()
        }}
      >
        <span>{text}</span>
        <CopyIcon />
      </Button>
    </div>
  )
}

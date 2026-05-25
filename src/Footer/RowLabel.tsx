'use client'
import { Footer } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Footer['navItems']>[number]>()

  const label = data?.data?.link?.label
    ? `Nav item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.link?.label}`
    : 'Row'

  return <div>{label}</div>
}

export const FooterSoriaSocialRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<
    NonNullable<NonNullable<Footer['footerSoria']>['socialLinks']>[number]
  >()

  const icon = data?.data?.icon ?? 'enlace'
  const row = data.rowNumber !== undefined ? data.rowNumber + 1 : ''

  return <div>{`Enlace ${row}: ${icon}`}</div>
}

export const FooterSoriaLegalRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<
    NonNullable<NonNullable<Footer['footerSoria']>['legalLinks']>[number]
  >()

  const row = data.rowNumber !== undefined ? data.rowNumber + 1 : ''

  return <div>{`Legal ${row}`}</div>
}

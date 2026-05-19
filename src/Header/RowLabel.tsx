'use client'
import { Header } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Header['navItems']>[number]>()

  const label = data?.data?.link?.label
    ? `Nav item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.link?.label}`
    : 'Row'

  return <div>{label}</div>
}

export const NavbarSoriaRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<
    NonNullable<NonNullable<Header['navbarSoria']>['sidebarItems']>[number]
  >()

  const label = data?.data?.link?.label
    ? `Item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.link?.label}`
    : 'Item de menú'

  return <div>{label}</div>
}

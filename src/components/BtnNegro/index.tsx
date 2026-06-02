import React from 'react'
import Link from 'next/link'

import styles from './BtnNegro.module.css'

type BtnBaseProps = {
  children: React.ReactNode
  className?: string
  /** Fondo del botón en reposo */
  baseColor?: string
  /** Color del barrido al hacer hover */
  fillColor?: string
  /** Color del texto en reposo */
  textColor?: string
  /** Color del texto al hacer hover (cuando el barrido cubre el botón) */
  hoverTextColor?: string
}

type BtnAsLink = BtnBaseProps & {
  as?: 'link'
  href: string
  target?: '_blank' | '_self'
  rel?: string
  onClick?: never
}

type BtnAsButton = BtnBaseProps & {
  as: 'button'
  href?: never
  target?: never
  rel?: never
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

type Props = BtnAsLink | BtnAsButton

export const BtnNegro: React.FC<Props> = ({
  children,
  className,
  baseColor = '#1e1e1c',
  fillColor = '#f3f3f3',
  textColor = '#f3f3f3',
  hoverTextColor = '#1e1e1c',
  ...rest
}) => {
  const style = {
    '--btn-base': baseColor,
    '--btn-fill': fillColor,
    '--btn-text': textColor,
    '--btn-text-hover': hoverTextColor,
  } as React.CSSProperties
  const classes = [styles.root, className ?? ''].filter(Boolean).join(' ')

  const layers = (
    <>
      <span aria-hidden="true" className={styles.base} />
      <span aria-hidden="true" className={styles.fill} />
      <span className={styles.label}>{children}</span>
    </>
  )

  if (rest.as === 'button') {
    const { onClick } = rest
    return (
      <button type="button" onClick={onClick} className={classes} style={style}>
        {layers}
      </button>
    )
  }

  const { href, target, rel } = rest as BtnAsLink
  const safeRel = target === '_blank' ? (rel ?? 'noopener noreferrer') : rel

  return (
    <Link href={href} target={target} rel={safeRel} className={classes} style={style}>
      {layers}
    </Link>
  )
}

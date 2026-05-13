'use client'

import React from 'react'
import Image from 'next/image'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { sanitizeSVG } from '../../utilities/sanitizeHTML'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { useGoogleFont } from '../../utilities/useGoogleFont'
import { cn } from '@/utilities/ui'
import {
  SENDA_CUSTOM_BREAKOUT_ATTR,
  buildSendaCalcBreakoutResponsiveCss,
  sendaBreakoutOnlyBoxSizing,
  sendaCalcBreakoutInlineStyle,
  sendaResolveOptionalMobileWidthVw,
} from '../../utilities/sendaCustomWidthBreakout'
import { appendSendaInjectedButtonBorderRadius } from '../../utilities/sendaInjectedButtonRadius'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Media, Page, Post } from '@/payload-types'
import { expandFontGroupRichTextFields } from '../../utilities/expandFontGroupRichTextFields'
import {
  appendFontGroupHeadingMarginRulesResponsive,
  appendFontGroupLineHeightRulesResponsive,
  appendTypographyBodyListSizeRules,
  FONT_GROUP_RICHTEXT_DESKTOP_MIN,
  FONT_GROUP_RICHTEXT_MOBILE_MAX,
  FONT_GROUP_VARIANT_CSS,
  mergeFontGroupLineHeightsWithFallback,
  trimFontGroupValue,
  type FontGroupHeadingMargins,
  type FontGroupLineHeights,
  type FontGroupTypography,
} from '../../utilities/fontGroupRichTextCss'

type FontFile = {
  id?: string | number
  url?: string
  filename?: string
  name?: string
}

type FontGroupFontEntry = { font?: FontFile | number; variant?: string }

type FontGroupData = {
  fontFamilyName?: string | null
  fonts?: FontGroupFontEntry[] | null
  typography?: FontGroupTypography | null
  typographyMobile?: FontGroupTypography | null
  headingMargins?: FontGroupHeadingMargins | null
  headingMarginsMobile?: FontGroupHeadingMargins | null
  lineHeights?: FontGroupLineHeights | null
  lineHeightsMobile?: FontGroupLineHeights | null
}

function normalizeLayoutFontGroup(raw: unknown): FontGroupData | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  let o = raw as Record<string, unknown>
  const rel = o.relationTo
  const inner = o.value
  if (
    inner &&
    typeof inner === 'object' &&
    !Array.isArray(inner) &&
    (rel === 'font-groups' || rel === 'fontGroups')
  ) {
    o = inner as Record<string, unknown>
  }
  return expandFontGroupRichTextFields(o as Record<string, unknown>) as FontGroupData
}

const LAYOUT_FG_RICHTEXT =
  'layout-senda-richtext [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6'

/** Default rich text look (MicroVisuals / CallToAction block). CMS `textColor` still overrides via injected CSS. */
const MICROVISUALS_RICHTEXT =
  'max-w-none [&_a]:text-white/90 [&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:hover:text-white' +
  ' [&_p]:text-xl [&_p]:leading-snug [&_p]:font-light [&_p]:text-white/80 sm:[&_p]:text-2xl' +
  ' [&_strong]:font-medium [&_strong]:text-white' +
  ' [&_h1]:font-heading [&_h1]:text-white [&_h1]:italic [&_h1]:tracking-[-0.02em] [&_h1]:leading-[0.92] [&_h1]:text-[clamp(2.25rem,7vw,4.25rem)]' +
  ' [&_h2]:font-heading [&_h2]:text-white [&_h2]:italic [&_h2]:tracking-tight [&_h2]:text-[clamp(1.75rem,4vw,3rem)] [&_h2]:leading-tight' +
  ' [&_h3]:font-heading [&_h3]:text-white [&_h3]:italic [&_h3]:text-[clamp(1.35rem,3vw,2.25rem)] [&_h3]:leading-tight' +
  ' [&_h4]:font-body [&_h4]:text-lg [&_h4]:font-medium [&_h4]:tracking-tight [&_h4]:text-white/90' +
  ' [&_h5]:font-body [&_h5]:text-base [&_h5]:font-medium [&_h5]:text-white/90' +
  ' [&_h6]:font-body [&_h6]:text-sm [&_h6]:font-semibold [&_h6]:uppercase [&_h6]:tracking-wide [&_h6]:text-white/75' +
  ' [&_li]:text-white/80 [&_blockquote]:border-white/20 [&_blockquote]:text-white/75'

type LinkType = {
  type?: 'reference' | 'custom' | null
  newTab?: boolean | null
  reference?: {
    relationTo?: 'pages' | 'posts'
    value?: Page | Post | number | string
  } | null
  url?: string | null
  label?: string | null
}

type ImageGroup = {
  useMedia?: boolean | null
  mediaImage?: number | Media | null
  useViewportSize?: boolean | null
  mediaWidthVw?: number | null
  mediaHeightVh?: number | null
  mediaWidthVwMobile?: number | null
  mediaHeightVhMobile?: number | null
  src?: string | null
  alt?: string | null
}

/** Mismo corte que Tailwind `lg:` (1024px). */
const LAYOUT_SENDA_VP_IMG_MAX_SM = 1023

function clampViewportUnit(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  return Math.min(200, Math.max(1, value))
}

type SubHeading = {
  icon?: {
    useMedia?: boolean | null
    mediaImage?: number | Media | null
    iconSVG?: string | null
    alt?: string | null
  } | null
  content?: DefaultTypedEditorState | null
}

function sanitizeAnchorId(value: string | null | undefined): string {
  const s = (value || '').trim().replace(/[^a-zA-Z0-9_-]/g, '')
  return s || 'layout-soria'
}

type LayoutSoriaProps = {
  anchorId?: string | null
  richText?: DefaultTypedEditorState | null
  image?: ImageGroup | null
  subHeadings?: SubHeading[] | null
  buttons?: Array<{
    link?: LinkType | null
    appearance?: 'default' | 'secondary' | 'outline' | 'link' | null
    size?: 'sm' | 'lg' | 'clear' | null
    iconSVG?: string | null
  }> | null
  invertLayout?: boolean | null
  backgroundColor?: string | null
  /** Si es true, el contenido interior usa `customWidthPercent` como ancho en vw; el fondo a ancho completo. */
  applyCustomWidth?: boolean | null
  customWidthPercent?: number | null
  customWidthPercentMobile?: number | null
  textColor?: string | null
  boldTextColor?: string | null
  buttonBackgroundColor?: string | null
  buttonTextColor?: string | null
  useFontGroup?: boolean | null
  fontGroup?: FontGroupData | number | null
  fontFamily?: string | null
  useCustomFont?: boolean | null
  customFontFile?: FontFile | number | null
  customFontName?: string | null
}

const getImageSrc = (imageGroup: ImageGroup | null | undefined): string => {
  if (!imageGroup) return ''
  if (imageGroup.useMedia && imageGroup.mediaImage && typeof imageGroup.mediaImage === 'object') {
    return imageGroup.mediaImage.url || ''
  }
  return imageGroup.src || ''
}

const getImageAlt = (imageGroup: ImageGroup | null | undefined): string => {
  if (!imageGroup) return 'Image'
  if (imageGroup.useMedia && imageGroup.mediaImage && typeof imageGroup.mediaImage === 'object') {
    return imageGroup.mediaImage.alt || imageGroup.alt || 'Image'
  }
  return imageGroup.alt || 'Image'
}

const getIconImageSrc = (subHeading: SubHeading | null | undefined): string => {
  const icon = subHeading?.icon
  if (!icon || !icon.useMedia || !icon.mediaImage || typeof icon.mediaImage !== 'object') return ''
  return icon.mediaImage.url || ''
}

const getIconAlt = (subHeading: SubHeading | null | undefined): string => {
  return subHeading?.icon?.alt || 'Icon'
}

export const LayoutSoriaBlock: React.FC<LayoutSoriaProps> = (props) => {
  const {
    anchorId,
    richText,
    image,
    subHeadings,
    buttons,
    invertLayout,
    backgroundColor,
    applyCustomWidth,
    customWidthPercent,
    customWidthPercentMobile,
    textColor,
    boldTextColor,
    buttonBackgroundColor,
    buttonTextColor,
    useFontGroup,
    fontGroup,
    fontFamily,
    useCustomFont,
    customFontFile,
    customFontName,
  } = props

  const uniqueId = React.useId().replace(/:/g, '-')
  const styleId = `layout-soria-${uniqueId}`

  const fontGroupObj =
    useFontGroup && fontGroup && typeof fontGroup === 'object'
      ? normalizeLayoutFontGroup(fontGroup)
      : null

  const fontGroupTypographyActive = Boolean(
    fontGroupObj?.fontFamilyName?.trim() && Array.isArray(fontGroupObj.fonts),
  )

  const customFontFileObj =
    customFontFile && typeof customFontFile === 'object' ? customFontFile : null
  const customFontFamilyName =
    customFontName?.trim() ||
    customFontFileObj?.name?.trim() ||
    (customFontFileObj?.filename ? customFontFileObj.filename.replace(/\.[^.]+$/, '') : undefined)

  const getFontFamily = () => {
    if (fontGroupObj?.fontFamilyName) return `"${fontGroupObj.fontFamilyName.replace(/"/g, '\\"')}"`
    if (useCustomFont && customFontFamilyName) return `"${customFontFamilyName}"`
    if (fontFamily && fontFamily !== 'default') return fontFamily
    return undefined
  }

  const selectedFontFamily = getFontFamily()
  useGoogleFont(fontGroupTypographyActive ? undefined : selectedFontFamily)

  const fontFileUrl = customFontFileObj?.url
    ? getMediaUrl(customFontFileObj.url).replace(/([^:]\/)\/+/g, '$1')
    : null
  const fontFileNameOrUrl = customFontFileObj?.filename || customFontFileObj?.url || ''
  const isValidFontFile =
    fontFileUrl && /\.(woff|woff2|ttf|otf)(\?.*)?$/i.test(fontFileNameOrUrl)

  const buildStyles = () => {
    const styles: string[] = []
    const sel = `[data-layout-senda-font="${styleId}"]`
    const mainRichtext = `${sel} .layout-senda-richtext`
    const planRichtext = mainRichtext
    const payloadRichtext = `${sel} .payload-richtext`
    const layoutBtnLabels = `${sel} .layout-senda-btn-label`

    if (fontGroupTypographyActive && fontGroupObj) {
      const familyName = fontGroupObj.fontFamilyName!.replace(/"/g, '\\"')
      const fontEntries = (fontGroupObj.fonts || []).filter(
        (e): e is FontGroupFontEntry & { font: FontFile } =>
          e?.font != null && typeof e.font === 'object' && e.font?.url != null,
      )
      for (const entry of fontEntries) {
        const url = getMediaUrl(entry.font.url).replace(/([^:]\/)\/+/g, '$1')
        const variant = entry.variant || 'regular'
        const { weight, style: fontStyleCss } = FONT_GROUP_VARIANT_CSS[variant] ?? {
          weight: '400',
          style: 'normal',
        }
        const formatMatch = url.match(/\.(woff2?|ttf|otf)(\?.*)?$/i)
        const format = formatMatch
          ? formatMatch[1].toLowerCase() === 'woff2'
            ? 'woff2'
            : formatMatch[1].toLowerCase() === 'woff'
              ? 'woff'
              : formatMatch[1].toLowerCase() === 'ttf'
                ? 'truetype'
                : 'opentype'
          : 'woff2'
        if (!formatMatch) continue
        styles.push(`
          @font-face {
            font-family: "${familyName}";
            src: url("${url}") format("${format}");
            font-weight: ${weight};
            font-style: ${fontStyleCss};
            font-display: swap;
          }
        `)
      }
      const fontValue = `"${fontGroupObj.fontFamilyName!.replace(/"/g, '\\"')}"`
      styles.push(
        `${sel}, ${sel} *, ${sel} a, ${sel} button, ${sel} span, ${payloadRichtext}, ${payloadRichtext} * { font-family: ${fontValue} !important; }`,
      )

      const typo = fontGroupObj.typography
      if (typo) {
        if (typo.h1)
          styles.push(`${mainRichtext} h1, ${payloadRichtext} h1 { font-size: ${typo.h1} !important; }`)
        if (typo.h2)
          styles.push(`${mainRichtext} h2, ${payloadRichtext} h2 { font-size: ${typo.h2} !important; }`)
        if (typo.h3)
          styles.push(`${mainRichtext} h3, ${payloadRichtext} h3 { font-size: ${typo.h3} !important; }`)
        if (typo.h4)
          styles.push(`${mainRichtext} h4, ${payloadRichtext} h4 { font-size: ${typo.h4} !important; }`)
        if (typo.h5)
          styles.push(`${mainRichtext} h5, ${payloadRichtext} h5 { font-size: ${typo.h5} !important; }`)
        if (typo.h6)
          styles.push(`${mainRichtext} h6, ${payloadRichtext} h6 { font-size: ${typo.h6} !important; }`)
        appendTypographyBodyListSizeRules(typo, mainRichtext, planRichtext, payloadRichtext, (rule: string) =>
          styles.push(rule),
        )
        if (typo.caption) {
          styles.push(
            `${mainRichtext} .caption, ${payloadRichtext} .caption { font-size: ${typo.caption} !important; }`,
          )
          styles.push(
            `${mainRichtext} p .caption, ${mainRichtext} .payload-richtext .caption, ${mainRichtext} span.caption, ${payloadRichtext} span.caption { font-size: ${typo.caption} !important; }`,
          )
          styles.push(`${sel} [data-text-size="caption"] { font-size: ${typo.caption} !important; }`)
        }
      }

      const bodyBtnDesk = trimFontGroupValue(fontGroupObj.typography?.body)
      if (bodyBtnDesk) {
        styles.push(`${layoutBtnLabels} { font-size: ${bodyBtnDesk} !important; }`)
      }

      const typoMob = fontGroupObj.typographyMobile
      if (typoMob) {
        const mobRules: string[] = []
        const t = (v: string | null | undefined) => (typeof v === 'string' ? v.trim() : '') || ''
        if (t(typoMob.h1))
          mobRules.push(`${mainRichtext} h1, ${payloadRichtext} h1 { font-size: ${t(typoMob.h1)} !important; }`)
        if (t(typoMob.h2))
          mobRules.push(`${mainRichtext} h2, ${payloadRichtext} h2 { font-size: ${t(typoMob.h2)} !important; }`)
        if (t(typoMob.h3))
          mobRules.push(`${mainRichtext} h3, ${payloadRichtext} h3 { font-size: ${t(typoMob.h3)} !important; }`)
        if (t(typoMob.h4))
          mobRules.push(`${mainRichtext} h4, ${payloadRichtext} h4 { font-size: ${t(typoMob.h4)} !important; }`)
        if (t(typoMob.h5))
          mobRules.push(`${mainRichtext} h5, ${payloadRichtext} h5 { font-size: ${t(typoMob.h5)} !important; }`)
        if (t(typoMob.h6))
          mobRules.push(`${mainRichtext} h6, ${payloadRichtext} h6 { font-size: ${t(typoMob.h6)} !important; }`)

        appendTypographyBodyListSizeRules(typoMob, mainRichtext, planRichtext, payloadRichtext, (rule: string) =>
          mobRules.push(rule),
        )

        const capM = t(typoMob.caption)
        if (capM) {
          mobRules.push(
            `${mainRichtext} .caption, ${payloadRichtext} .caption { font-size: ${capM} !important; }`,
          )
          mobRules.push(
            `${mainRichtext} p .caption, ${mainRichtext} .payload-richtext .caption, ${mainRichtext} span.caption, ${payloadRichtext} span.caption { font-size: ${capM} !important; }`,
          )
          mobRules.push(`${sel} [data-text-size="caption"] { font-size: ${capM} !important; }`)
        }

        const bodyMobBtn = t(typoMob.body)
        if (bodyMobBtn) {
          mobRules.push(`${layoutBtnLabels} { font-size: ${bodyMobBtn} !important; }`)
        }

        if (mobRules.length > 0) {
          styles.push(
            `@media (max-width: ${FONT_GROUP_RICHTEXT_MOBILE_MAX}) {\n${mobRules.join('\n')}\n}`,
          )
        }
      }

      appendFontGroupHeadingMarginRulesResponsive(
        fontGroupObj.headingMargins ?? null,
        fontGroupObj.headingMarginsMobile ?? null,
        mainRichtext,
        planRichtext,
        payloadRichtext,
        (rule: string) => styles.push(rule),
      )
      appendFontGroupLineHeightRulesResponsive(
        fontGroupObj.lineHeights ?? null,
        fontGroupObj.lineHeightsMobile ?? null,
        mainRichtext,
        planRichtext,
        payloadRichtext,
        (rule: string) => styles.push(rule),
      )

      const bodyLhDesk = trimFontGroupValue(fontGroupObj.lineHeights?.body)
      const mergedLh = mergeFontGroupLineHeightsWithFallback(
        fontGroupObj.lineHeights ?? null,
        fontGroupObj.lineHeightsMobile ?? null,
      )
      const bodyLhMob = trimFontGroupValue(mergedLh?.body)
      if (bodyLhDesk) {
        styles.push(
          `@media (min-width: ${FONT_GROUP_RICHTEXT_DESKTOP_MIN}) { ${layoutBtnLabels} { line-height: ${bodyLhDesk} !important; } }`,
        )
      }
      if (bodyLhMob) {
        styles.push(
          `@media (max-width: ${FONT_GROUP_RICHTEXT_MOBILE_MAX}) { ${layoutBtnLabels} { line-height: ${bodyLhMob} !important; } }`,
        )
      }

      styles.push(
        `${mainRichtext} h1, ${mainRichtext} h2, ${mainRichtext} h3, ${mainRichtext} h4, ${payloadRichtext} h1, ${payloadRichtext} h2, ${payloadRichtext} h3, ${payloadRichtext} h4 { letter-spacing: 0.02em; }`,
      )
      const weightMap: Record<string, string> = {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        heavy: '800',
      }
      for (const [key, w] of Object.entries(weightMap)) {
        styles.push(`${sel} [data-text-weight="${key}"] { font-weight: ${w} !important; }`)
        styles.push(
          `${mainRichtext} [data-text-weight="${key}"], ${payloadRichtext} [data-text-weight="${key}"] { font-weight: ${w} !important; }`,
        )
      }
    } else if (useCustomFont && fontFileUrl && customFontFamilyName && isValidFontFile) {
      styles.push(`
        @font-face {
          font-family: "${customFontFamilyName.replace(/"/g, '\\"')}";
          src: url("${fontFileUrl}") format("woff2"), url("${fontFileUrl}") format("woff");
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `)
      const fontValue = `"${customFontFamilyName.replace(/"/g, '\\"')}"`
      styles.push(
        `${sel}, ${sel} *, ${sel} a, ${sel} button, ${sel} span, ${payloadRichtext}, ${payloadRichtext} * { font-family: ${fontValue} !important; }`,
      )
    } else if (selectedFontFamily) {
      styles.push(
        `${sel}, ${sel} *, ${sel} a, ${sel} button, ${sel} span, ${payloadRichtext}, ${payloadRichtext} * { font-family: ${selectedFontFamily} !important; }`,
      )
    }

    if (textColor) {
      styles.push(
        `${sel}, ${sel} p, ${sel} h1, ${sel} h2, ${sel} h3, ${sel} h4, ${sel} h5, ${sel} h6, ${sel} li, ${sel} span:not(strong):not(b):not(.layout-senda-btn-label), ${sel} a { color: ${textColor} !important; }`,
      )
    }

    if (boldTextColor) {
      styles.push(
        `${sel} strong, ${sel} b { color: ${boldTextColor} !important; }`,
      )
    }

    const layoutFilledBtn = `${sel} .layout-senda-btn-filled`
    appendSendaInjectedButtonBorderRadius(styles, layoutFilledBtn)

    if (buttonBackgroundColor || buttonTextColor) {
      const btnRules: string[] = []
      if (buttonBackgroundColor) btnRules.push(`background-color: ${buttonBackgroundColor} !important;`)
      if (btnRules.length > 0) {
        styles.push(`${layoutFilledBtn} { ${btnRules.join(' ')} }`)
      }

      if (buttonTextColor) {
        styles.push(
          `${layoutFilledBtn}, ${layoutFilledBtn} * { color: ${buttonTextColor} !important; }`,
        )
      }
    }

    styles.push(
      `${sel} sub, ${sel} sup { font-weight: 700 !important; vertical-align: baseline !important; font-size: 0.75em; line-height: 1.2; }`,
    )

    return styles.length > 0 ? styles.join('\n') : ''
  }

  const combinedStyles = buildStyles()
  const fontStyle = selectedFontFamily ? { fontFamily: selectedFontFamily } : undefined

  const mainImageSrc = getImageSrc(image)
  const mainImageAlt = getImageAlt(image)
  const mediaW = clampViewportUnit(image?.mediaWidthVw)
  const mediaH = clampViewportUnit(image?.mediaHeightVh)
  const mediaWMob = clampViewportUnit(image?.mediaWidthVwMobile)
  const mediaHMob = clampViewportUnit(image?.mediaHeightVhMobile)
  const useMediaViewportSize =
    Boolean(image?.useMedia && image?.useViewportSize) && mediaW != null && mediaH != null
  const hasMobileViewportSize = mediaWMob != null && mediaHMob != null
  const vpImgDataAttr = `${styleId}-vpimg`
  const viewportImageCss = useMediaViewportSize
    ? `
[data-layout-senda-vp-img="${vpImgDataAttr}"] {
  width: var(--ls-vpw);
  height: var(--ls-vph);
}
@media (max-width: ${LAYOUT_SENDA_VP_IMG_MAX_SM}px) {
  [data-layout-senda-vp-img="${vpImgDataAttr}"] {
    width: var(--ls-vpw-sm, var(--ls-vpw));
    height: var(--ls-vph-sm, var(--ls-vph));
  }
}
`.trim()
    : ''
  const buttonItems = Array.isArray(buttons) ? buttons.slice(0, 2) : []

  /** Ancho del contenido en % del viewport (solo si el checkbox está activo). */
  const layoutCustomWidthVw =
    applyCustomWidth === true
      ? (() => {
          const p = customWidthPercent
          if (typeof p !== 'number' || Number.isNaN(p)) return 100
          const clamped = Math.min(100, Math.max(0, p))
          return clamped <= 0 ? 100 : clamped
        })()
      : null

  const layoutCustomWidthMobileVw = sendaResolveOptionalMobileWidthVw(
    applyCustomWidth,
    customWidthPercentMobile,
  )
  const layoutBreakoutCss =
    layoutCustomWidthVw != null && layoutCustomWidthMobileVw != null
      ? buildSendaCalcBreakoutResponsiveCss(styleId, layoutCustomWidthVw, layoutCustomWidthMobileVw)
      : ''

  /** Sin invertir: móvil imagen arriba; desktop texto izq / imagen dcha. Invertido: móvil imagen arriba; desktop imagen izq / texto dcha. */
  const textContainerClass = invertLayout ? 'order-2 lg:order-2' : 'order-2 lg:order-1'
  const imageContainerClass = invertLayout ? 'order-1 lg:order-1' : 'order-1 lg:order-2'

  const allBlockStyles = [combinedStyles, viewportImageCss, layoutBreakoutCss].filter(Boolean).join('\n')

  return (
    <>
      {allBlockStyles ? <style>{allBlockStyles}</style> : null}
      <section
        id={sanitizeAnchorId(anchorId)}
        data-layout-senda-font={styleId}
        className={cn(
          'relative w-full',
          layoutCustomWidthVw == null && 'overflow-x-hidden px-[5%]',
          layoutCustomWidthVw != null && 'overflow-x-visible px-0',
        )}
      >
        {layoutCustomWidthVw != null && backgroundColor ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 left-1/2 -z-0 w-screen -translate-x-1/2 max-w-none"
            style={{ backgroundColor }}
          />
        ) : null}
        <div
          className={cn(
            'relative z-[1] min-w-0 py-16 md:py-24 lg:py-28',
            layoutCustomWidthVw != null && 'overflow-x-visible',
          )}
        >
          <div
            className={cn(
              'relative min-w-0',
              layoutCustomWidthVw == null ? 'mx-auto w-full' : 'box-border w-full max-w-none px-0 overflow-x-visible',
            )}
            {...(layoutCustomWidthVw != null && layoutCustomWidthMobileVw != null
              ? { [SENDA_CUSTOM_BREAKOUT_ATTR]: styleId }
              : {})}
            style={
              layoutCustomWidthVw == null
                ? undefined
                : layoutCustomWidthMobileVw != null
                  ? sendaBreakoutOnlyBoxSizing()
                  : sendaCalcBreakoutInlineStyle(layoutCustomWidthVw)
            }
          >
            <div className={layoutCustomWidthVw == null ? 'container' : 'mx-auto w-full max-w-none'}>
              <div
                className={cn(
                  'relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-black p-8 font-body text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:rounded-[2.5rem] md:p-10 lg:p-12',
                )}
                data-theme="dark"
                style={backgroundColor ? { backgroundColor } : undefined}
              >
                <div className="grid grid-cols-1 gap-y-12 md:gap-y-16 lg:grid-cols-2 lg:items-center lg:gap-x-20">
                  <div className={textContainerClass} style={fontStyle}>
                  {richText && (
                    <div
                      className={cn(
                        'mb-6 md:mb-8',
                        MICROVISUALS_RICHTEXT,
                        fontGroupTypographyActive && LAYOUT_FG_RICHTEXT,
                      )}
                    >
                      <RichText className="mb-0" data={richText} enableGutter={false} />
                    </div>
                  )}

                  {Array.isArray(subHeadings) && subHeadings.length > 0 && (
                    <div className="grid auto-rows-min grid-cols-1 items-start gap-4 py-2 sm:grid-cols-2">
                      {subHeadings.map((subHeading, index) => {
                        const iconImageSrc = getIconImageSrc(subHeading)
                        const iconSvg = subHeading?.icon?.useMedia ? null : subHeading?.icon?.iconSVG
                        const normalizedIconSvg =
                          iconSvg && String(iconSvg).trim() ? sanitizeSVG(iconSvg) : ''
                        return (
                          <div key={index} className="self-start min-w-0">
                            {subHeading?.content && (
                              <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-stretch gap-x-4">
                                {iconImageSrc ? (
                                  <span className="inline-flex size-9 shrink-0 self-start overflow-hidden rounded-md">
                                    <Image
                                      src={iconImageSrc}
                                      alt={getIconAlt(subHeading)}
                                      width={48}
                                      height={48}
                                      className="size-full object-cover"
                                    />
                                  </span>
                                ) : normalizedIconSvg ? (
                                  <span
                                    className="inline-flex shrink-0 self-start items-start justify-start text-current"
                                    aria-hidden
                                  >
                                    <span
                                      className="inline-flex min-w-0 max-w-14 [&_svg]:block [&_svg]:h-auto [&_svg]:w-auto [&_svg]:max-h-14 [&_svg]:max-w-full [&_svg]:object-contain"
                                      dangerouslySetInnerHTML={{ __html: normalizedIconSvg }}
                                    />
                                  </span>
                                ) : (
                                  <span
                                    aria-hidden
                                    className="w-[3px] shrink-0 self-stretch rounded-sm bg-white/25"
                                  />
                                )}
                                <div
                                  className={cn(
                                    'min-w-0',
                                    MICROVISUALS_RICHTEXT,
                                    fontGroupTypographyActive && LAYOUT_FG_RICHTEXT,
                                  )}
                                >
                                  <RichText
                                    className="mb-0"
                                    data={subHeading.content}
                                    enableGutter={false}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {buttonItems.length > 0 && (
                    <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-8">
                      {buttonItems.map((button, index) => {
                        const link = button?.link
                        const rawAppearance = button?.appearance ?? (index === 0 ? 'secondary' : 'link')
                        const iconSVG = button?.iconSVG
                        const linkSpread = link as React.ComponentProps<typeof CMSLink> | undefined

                        const iconSlot = iconSVG ? (
                          <span
                            className="inline-flex size-5 shrink-0 [&_svg]:size-full"
                            dangerouslySetInnerHTML={{ __html: sanitizeSVG(iconSVG) }}
                            aria-hidden
                          />
                        ) : null

                        if (rawAppearance === 'link') {
                          return (
                            <CMSLink
                              key={index}
                              {...linkSpread}
                              appearance="inline"
                              className="font-body text-sm font-light text-white/70 transition-colors duration-200 hover:text-white"
                              label={undefined}
                            >
                              <span className="inline-flex items-center gap-1.5">
                                <span
                                  className={cn(
                                    'layout-senda-btn-label min-w-0',
                                    fontGroupTypographyActive && 'leading-normal',
                                  )}
                                >
                                  {link?.label ?? 'Button'}
                                </span>
                                {iconSlot}
                              </span>
                            </CMSLink>
                          )
                        }

                        const labelRow = (
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className={cn(
                                'layout-senda-btn-label min-w-0',
                                fontGroupTypographyActive && 'leading-normal',
                              )}
                            >
                              {link?.label ?? 'Button'}
                            </span>
                            {iconSlot}
                          </span>
                        )

                        if (rawAppearance === 'outline' || rawAppearance === 'secondary') {
                          return (
                            <CMSLink
                              key={index}
                              {...linkSpread}
                              appearance="inline"
                              className="liquid-glass font-body rounded-full px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.03] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_20px_2px_rgba(255,255,255,0.07)] active:scale-[0.97]"
                              label={undefined}
                            >
                              {labelRow}
                            </CMSLink>
                          )
                        }

                        return (
                          <CMSLink
                            key={index}
                            {...linkSpread}
                            appearance="inline"
                            className="layout-senda-btn-filled group relative inline-flex overflow-hidden rounded-full bg-white px-6 py-3 font-body text-sm font-medium text-black shadow-[0_0_0_0_rgba(255,255,255,0)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_4px_rgba(255,255,255,0.25)] active:scale-[0.97]"
                            label={undefined}
                          >
                            <span className="relative z-10 inline-flex items-center gap-1.5">
                              <span
                                className={cn(
                                  'layout-senda-btn-label min-w-0',
                                  fontGroupTypographyActive && 'leading-normal',
                                )}
                              >
                                {link?.label ?? 'Button'}
                              </span>
                              {iconSlot}
                            </span>
                            <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white to-white/85 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                          </CMSLink>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className={imageContainerClass}>
                  {mainImageSrc &&
                    (useMediaViewportSize ? (
                      <div
                        data-layout-senda-vp-img={vpImgDataAttr}
                        className="relative overflow-hidden rounded-2xl"
                        style={
                          {
                            '--ls-vpw': `${mediaW}vw`,
                            '--ls-vph': `${mediaH}vh`,
                            ...(hasMobileViewportSize
                              ? {
                                  '--ls-vpw-sm': `${mediaWMob}vw`,
                                  '--ls-vph-sm': `${mediaHMob}vh`,
                                }
                              : {}),
                          } as React.CSSProperties
                        }
                      >
                        <Image
                          src={mainImageSrc}
                          alt={mainImageAlt}
                          fill
                          className="object-cover"
                          sizes="100vw"
                        />
                      </div>
                    ) : (
                      <Image
                        src={mainImageSrc}
                        alt={mainImageAlt}
                        width={800}
                        height={600}
                        className="w-full rounded-2xl object-cover"
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}


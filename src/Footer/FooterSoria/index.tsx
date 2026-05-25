import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { resolveFontFamily } from '@/fields/fontFamilySelect'

import type { Footer as FooterType, Media } from '@/payload-types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

type FooterSoriaProps = {
  data: FooterType
}

type SocialIconName =
  | 'whatsapp'
  | 'instagram'
  | 'linkedin'
  | 'facebook'
  | 'mail'
  | 'phone'
  | 'external'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function SocialIcon({ name, className }: { name: SocialIconName; className?: string }) {
  switch (name) {
    case 'whatsapp':
      return <WhatsAppIcon className={className} />
    case 'instagram':
      return <Instagram className={className} strokeWidth={1.5} />
    case 'linkedin':
      return <Linkedin className={className} strokeWidth={1.5} />
    case 'facebook':
      return <Facebook className={className} strokeWidth={1.5} />
    case 'mail':
      return <Mail className={className} strokeWidth={1.5} />
    case 'phone':
      return <Phone className={className} strokeWidth={1.5} />
    default:
      return <ExternalLink className={className} strokeWidth={1.5} />
  }
}

function resolveBrandHref(
  brandLink: NonNullable<FooterType['footerSoria']>['brandLink'] | null | undefined,
): string {
  const linkData = brandLink?.link
  if (!linkData) return '/'

  if (
    linkData.type === 'reference' &&
    typeof linkData.reference?.value === 'object' &&
    linkData.reference.value &&
    'slug' in linkData.reference.value
  ) {
    const slug = linkData.reference.value.slug
    return linkData.reference.relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
  }

  if (linkData.type === 'custom' && linkData.url) return linkData.url
  return '/'
}

function RichTextInline({
  data,
  className,
}: {
  data: DefaultTypedEditorState
  className?: string
}) {
  return (
    <RichText
      className={cn('mb-0 max-w-none text-inherit [&_p]:mb-0 [&_p]:inline', className)}
      data={data}
      enableGutter={false}
      enableProse={false}
    />
  )
}

export const FooterSoria: React.FC<FooterSoriaProps> = ({ data }) => {
  const footer = data?.footerSoria ?? null
  const socialLinks = Array.isArray(footer?.socialLinks) ? footer.socialLinks : []
  const legalLinks = Array.isArray(footer?.legalLinks) ? footer.legalLinks : []

  const logoMedia =
    typeof footer?.logo === 'object' && footer.logo !== null ? (footer.logo as Media) : null
  const logoUrl = logoMedia?.url ? getMediaUrl(logoMedia.url) : null
  const logoAlt = (logoMedia?.alt as string | undefined) ?? 'Logo'
  const logoWidth = logoMedia?.width ?? 48
  const logoHeight = logoMedia?.height ?? 48

  const brandHref = resolveBrandHref(footer?.brandLink)

  const footerStyle: React.CSSProperties = {
    backgroundColor: footer?.backgroundColor ?? undefined,
    color: footer?.textColor ?? undefined,
    fontFamily: resolveFontFamily(footer?.fontFamily),
  }

  const dividerColor = footer?.textColor ? `${footer.textColor}22` : undefined

  return (
    <footer className="mt-auto w-full" style={footerStyle}>
      <div className="container flex flex-col gap-10 py-12 md:flex-row md:items-end md:justify-between md:py-16 lg:py-20">
        {/* ── Social links ─────────────────────────────────────────────── */}
        {socialLinks.length > 0 ? (
          <nav aria-label="Contacto y redes sociales" className="max-w-md">
            <ul className="flex flex-col">
              {socialLinks.map((item, index) => {
                const icon = (item.icon as SocialIconName | null | undefined) ?? 'external'
                const label = item.label
                const linkData = item.link

                return (
                  <li
                    key={item.id ?? index}
                    className="border-b py-4 first:pt-0"
                    style={{ borderColor: dividerColor ?? 'rgba(0,0,0,0.12)' }}
                  >
                    <CMSLink
                      {...linkData}
                      appearance="inline"
                      className="group inline-flex items-center gap-3 text-sm transition-opacity hover:opacity-70 md:text-base"
                    >
                      <SocialIcon
                        name={icon}
                        className="h-4 w-4 shrink-0 opacity-80 md:h-[18px] md:w-[18px]"
                      />
                      {label ? <RichTextInline data={label} /> : null}
                    </CMSLink>
                  </li>
                )
              })}
            </ul>
          </nav>
        ) : null}

        {/* ── Brand / logo ─────────────────────────────────────────────── */}
        {(logoUrl || footer?.brandText) && (
          <Link
            href={brandHref}
            className="inline-flex items-center gap-4 self-end transition-opacity hover:opacity-80 md:gap-6"
            aria-label="Inicio"
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={logoAlt}
                width={logoWidth}
                height={logoHeight}
                className="h-28 w-auto object-contain sm:h-32 md:h-40 lg:h-44"
              />
            ) : null}
            {footer?.brandText ? (
              <div className="text-xl sm:text-2xl md:text-3xl">
                <RichTextInline data={footer.brandText} />
              </div>
            ) : null}
          </Link>
        )}
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────── */}
      {(legalLinks.length > 0 || footer?.copyright) && (
        <div
          className="border-t"
          style={{ borderColor: dividerColor ?? 'rgba(0,0,0,0.12)' }}
        >
          <div className="container flex flex-col gap-4 py-6 text-sm md:flex-row md:items-center md:justify-between md:py-8">
            {legalLinks.length > 0 ? (
              <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {legalLinks.map((item, index) => (
                  <CMSLink
                    key={item.id ?? index}
                    {...item.link}
                    appearance="inline"
                    className="underline underline-offset-4 transition-opacity hover:opacity-70"
                  >
                    {item.label ? <RichTextInline data={item.label} /> : null}
                  </CMSLink>
                ))}
              </nav>
            ) : (
              <span />
            )}

            {footer?.copyright ? (
              <div className="shrink-0 opacity-80">
                <RichTextInline data={footer.copyright} />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </footer>
  )
}

export default FooterSoria

export const SITE_NAME = 'Casa Soria Electricidad'

export const SITE_DESCRIPTION =
  'Instalaciones eléctricas y servicios profesionales en Soria.'

export const formatPageTitle = (title?: string | null) =>
  title ? `${title} | ${SITE_NAME}` : SITE_NAME

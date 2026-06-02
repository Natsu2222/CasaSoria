import React from 'react'

import type { Page } from '@/payload-types'

import { HeroParallaxHero } from '@/heros/HeroParallax'
import { HeroParallax2Hero } from '@/heros/HeroParallax2'
import { HeroParallax3Hero } from '@/heros/HeroParallax3'
import { HeroSoriaHero } from '@/heros/HeroSoria'
import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'
import { MicroVisualsHero } from '@/heros/MicroVisuals'

const heroes = {
  heroParallax: HeroParallaxHero,
  heroParallax2: HeroParallax2Hero,
  heroParallax3: HeroParallax3Hero,
  heroSoria: HeroSoriaHero,
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  microVisuals: MicroVisualsHero,
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}

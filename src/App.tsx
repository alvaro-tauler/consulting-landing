import { useEffect, useRef, useState, createContext, useContext } from 'react'
import { motion, useScroll, AnimatePresence, useInView, useSpring, useMotionValue } from 'framer-motion'
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation, useNavigationType, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Lenis from 'lenis'

// Lenis context for scroll control
const LenisContext = createContext<Lenis | null>(null)

// ═══════════════════════════════════════════════════════════════════════════════
// PREMIUM ANIMATION SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

// Easing principal - Editorial smooth (matches CSS --ease-out-expo)
const easeOutExpo = [0.19, 1, 0.22, 1] as const

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLL PROGRESS BAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div className="scroll-progress">
      <motion.div 
        className="scroll-progress-bar"
        style={{ scaleX }}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOUSE FOLLOW GLOW COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function MouseGlow() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <motion.div 
      className="mouse-glow hidden lg:block"
      style={{ x, y }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAGNETIC BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function MagneticButton({ 
  children, 
  className = '',
  href,
  onClick,
  type = 'button'
}: { 
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
}) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { stiffness: 150, damping: 15 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.15)
    y.set((e.clientY - centerY) * 0.15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const MotionComponent = href ? motion.a : motion.button

  return (
    <MotionComponent
      ref={ref as React.RefObject<HTMLButtonElement & HTMLAnchorElement>}
      href={href}
      onClick={onClick}
      type={href ? undefined : type}
      className={`magnetic-btn ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </MotionComponent>
  )
}


// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  const navType = useNavigationType()
  const lenis = useContext(LenisContext)
  
  useEffect(() => {
    if (navType !== 'POP') {
      window.scrollTo({ top: 0, behavior: 'instant' })
      if (lenis) {
        lenis.scrollTo(0, { immediate: true })
      }
    }
  }, [pathname, navType, lenis])
  
  return null
}

// ═══════════════════════════════════════════════════════════════════════════════
// FADE IN ANIMATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function FadeIn({ 
  children, 
  delay = 0, 
  className = '',
  direction = 'up'
}: { 
  children: React.ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { y: 0, x: 30 },
    right: { y: 0, x: -30 }
  }
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...directions[direction] }}
      transition={{ duration: 0.8, delay, ease: easeOutExpo }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MASK REVEAL TEXT COMPONENT (for detail pages)
// ═══════════════════════════════════════════════════════════════════════════════

function MaskRevealText({ 
  children, 
  delay = 0,
  className = ''
}: { 
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay, duration: 0.6, ease: easeOutExpo }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// LANGUAGE SELECTOR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function LanguageSelector({ isLight = false }: { isLight?: boolean }) {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  
  const currentLang = i18n.language === 'en' ? 'EN' : 'ES'
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setIsOpen(false)
  }
  
  const textColorClass = isLight 
    ? 'text-white/70 hover:text-white' 
    : 'text-[#060357]/50 hover:text-[#060357]'
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${textColorClass} transition-colors text-[10px] tracking-[0.2em] font-medium`}
      >
        {currentLang}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2, ease: easeOutExpo }}
              className="absolute top-full right-0 mt-4 bg-white border border-[#060357]/10 py-2 z-50"
            >
              <button
                onClick={() => changeLanguage('es')}
                className="block w-full px-6 py-2 text-left text-[10px] tracking-[0.2em] hover:bg-[#F9F9F9] transition-colors"
              >
                ES
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className="block w-full px-6 py-2 text-left text-[10px] tracking-[0.2em] hover:bg-[#F9F9F9] transition-colors"
              >
                EN
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEAM PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function TeamPage() {
  const { t } = useTranslation()
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" })
  const alvaroRef = useRef(null)
  const alvaroInView = useInView(alvaroRef, { once: true, margin: "-100px" })
  const manuelRef = useRef(null)
  const manuelInView = useInView(manuelRef, { once: true, margin: "-100px" })

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white min-h-screen"
    >
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden pt-32 pb-16 md:pb-24">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="/equipo page ok.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70 z-10" />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-[1200px] mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
          >
            <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
              <div className="h-px w-8 md:w-12 bg-[#436be0]" />
              <span className="text-white text-[10px] md:text-xs tracking-[0.3em] uppercase font-medium">
                {t('team.eyebrow')}
              </span>
              <div className="h-px w-8 md:w-12 bg-[#436be0]" />
            </div>
            
            <h1 className="text-white text-[clamp(2rem,6vw,4.5rem)] md:text-[clamp(2.5rem,8vw,5rem)] font-bold tracking-[-0.03em] leading-[1.1] mb-4 md:mb-6 px-4">
              {t('team.headline1')}<br />
              {t('team.headline2')}
            </h1>
            
            <p className="text-white/90 text-base md:text-lg lg:text-xl leading-[1.7] max-w-3xl mx-auto px-4">
              {t('team.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Members */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20">
          
          {/* Álvaro Toledo */}
          <motion.div
            ref={alvaroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={alvaroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="flex flex-col"
          >
            {/* Image */}
            <div className="mb-6 flex justify-center">
              <img 
                src="/alvaro.png" 
                alt={t('team.alvaro.name')}
                className="w-48 md:w-56 lg:w-64 object-cover aspect-[4/5]"
              />
            </div>
            
            {/* Name and Title */}
            <div className="text-center mb-6">
              <h2 className="text-[#1A1A1A] text-2xl md:text-3xl lg:text-4xl font-bold mb-2 tracking-tight">
                {t('team.alvaro.name')}
              </h2>
              <p className="text-[#436be0] text-sm md:text-base font-medium mb-4">
                {t('team.alvaro.title')}
              </p>
              <a
                href="https://www.linkedin.com/in/toledotauler/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6 md:w-7 md:h-7 text-[#436be0] hover:text-[#1A1A1A] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-[#6B6B6B] text-base md:text-lg leading-[1.7] mb-4">
                {t('team.alvaro.description1')}
              </p>
              <p className="text-[#6B6B6B] text-base md:text-lg leading-[1.7]">
                {t('team.alvaro.description2')}
              </p>
            </div>

            {/* Qualifications (excluding university) */}
            <div className="space-y-4 md:space-y-5 mb-6">
              <div>
                <h3 className="text-[#1A1A1A] text-sm md:text-base font-bold mb-2 flex items-start gap-2.5">
                  <span className="w-2 h-2 bg-[#436be0] rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('team.alvaro.qualification2_title')}</span>
                </h3>
                <p className="text-[#6B6B6B] text-sm md:text-base leading-relaxed ml-7">{t('team.alvaro.qualification2_desc')}</p>
              </div>
              <div>
                <h3 className="text-[#1A1A1A] text-sm md:text-base font-bold mb-2 flex items-start gap-2.5">
                  <span className="w-2 h-2 bg-[#436be0] rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('team.alvaro.qualification3_title')}</span>
                </h3>
                <p className="text-[#6B6B6B] text-sm md:text-base leading-relaxed ml-7">{t('team.alvaro.qualification3_desc')}</p>
              </div>
            </div>

            {/* University (last) */}
            <div>
              <h3 className="text-[#1A1A1A] text-sm md:text-base font-bold mb-2 flex items-start gap-2.5">
                <span className="w-2 h-2 bg-[#436be0] rounded-full mt-2 flex-shrink-0"></span>
                <span>{t('team.alvaro.qualification1_title')}</span>
              </h3>
              <p className="text-[#6B6B6B] text-sm md:text-base leading-relaxed ml-7">{t('team.alvaro.qualification1_desc')}</p>
            </div>
          </motion.div>

          {/* Manuel Toledo */}
          <motion.div
            ref={manuelRef}
            initial={{ opacity: 0, y: 30 }}
            animate={manuelInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: easeOutExpo }}
            className="flex flex-col"
          >
            {/* Image */}
            <div className="mb-6 flex justify-center">
              <img 
                src="/manuel.png" 
                alt={t('team.manuel.name')}
                className="w-48 md:w-56 lg:w-64 object-cover aspect-[4/5]"
              />
            </div>
            
            {/* Name and Title */}
            <div className="text-center mb-6">
              <h2 className="text-[#1A1A1A] text-2xl md:text-3xl lg:text-4xl font-bold mb-2 tracking-tight">
                {t('team.manuel.name')}
              </h2>
              <p className="text-[#436be0] text-sm md:text-base font-medium mb-4">
                {t('team.manuel.title')}
              </p>
              <a
                href="https://www.linkedin.com/in/manueltoledotauler/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6 md:w-7 md:h-7 text-[#436be0] hover:text-[#1A1A1A] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-[#6B6B6B] text-base md:text-lg leading-[1.7] mb-4">
                {t('team.manuel.description1')}
              </p>
              <p className="text-[#6B6B6B] text-base md:text-lg leading-[1.7]">
                {t('team.manuel.description2')}
              </p>
            </div>

            {/* Qualifications (excluding university) */}
            <div className="space-y-4 md:space-y-5 mb-6">
              <div>
                <h3 className="text-[#1A1A1A] text-sm md:text-base font-bold mb-2 flex items-start gap-2.5">
                  <span className="w-2 h-2 bg-[#436be0] rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('team.manuel.qualification2_title')}</span>
                </h3>
                <p className="text-[#6B6B6B] text-sm md:text-base leading-relaxed ml-7">{t('team.manuel.qualification2_desc')}</p>
              </div>
              <div>
                <h3 className="text-[#1A1A1A] text-sm md:text-base font-bold mb-2 flex items-start gap-2.5">
                  <span className="w-2 h-2 bg-[#436be0] rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('team.manuel.qualification3_title')}</span>
                </h3>
                <p className="text-[#6B6B6B] text-sm md:text-base leading-relaxed ml-7">{t('team.manuel.qualification3_desc')}</p>
              </div>
            </div>

            {/* University (last) */}
            <div>
              <h3 className="text-[#1A1A1A] text-sm md:text-base font-bold mb-2 flex items-start gap-2.5">
                <span className="w-2 h-2 bg-[#436be0] rounded-full mt-2 flex-shrink-0"></span>
                <span>{t('team.manuel.qualification1_title')}</span>
              </h3>
              <p className="text-[#6B6B6B] text-sm md:text-base leading-relaxed ml-7">{t('team.manuel.qualification1_desc')}</p>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE DETAIL PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function ServiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const serviceData: Record<string, { title: string; subtitle: string }> = {
    'diagnostico': { title: 'Diagnóstico Tecnológico', subtitle: 'Radiografía completa de tu ecosistema digital' },
    'roadmap': { title: 'Roadmap Estratégico', subtitle: 'Hoja de ruta clara hacia la transformación' },
    'direccion': { title: 'Dirección Técnica', subtitle: 'Liderazgo tecnológico sin fricción' },
    'executive-cto': { title: 'Executive CTO', subtitle: 'Visión C-Level para decisiones críticas' }
  }

  if (!id || !serviceData[id]) return <div className="pt-40 text-center">{t('common.pageNotFound')}</div>

  const service = serviceData[id]

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#F9F9F9] min-h-screen pt-32 pb-24"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-3 text-[#060357]/40 hover:text-[#060357] transition-colors mb-20 group cursor-pointer"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
          <span className="eyebrow">Volver</span>
        </button>

        <header className="mb-24">
          <MaskRevealText>
            <h1 className="heading-serif text-[#060357] text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] mb-8">
              {service.title}
            </h1>
          </MaskRevealText>
          <FadeIn delay={0.2}>
            <p className="text-[#2D2D2D]/70 text-xl md:text-2xl max-w-2xl">
              {service.subtitle}
            </p>
          </FadeIn>
        </header>

        <div className="grid lg:grid-cols-12 gap-20">
          <article className="lg:col-span-8 prose prose-lg max-w-none text-[#2D2D2D]">
            <FadeIn delay={0.3}>
              <p className="text-xl leading-relaxed mb-8">
                Nuestro enfoque combina análisis profundo con ejecución pragmática. 
                No creemos en soluciones genéricas—cada organización requiere un abordaje único.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="leading-relaxed mb-12">
                Trabajamos codo a codo con tu equipo para entender las dinámicas internas, 
                identificar oportunidades de mejora y diseñar una estrategia que se adapte 
                a tu realidad operativa y objetivos de negocio.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.5}>
              <div className="border-t border-[#060357]/10 pt-12 mt-12">
                <h3 className="heading-serif text-2xl text-[#060357] mb-8">Qué incluye</h3>
                <ul className="space-y-4 list-none p-0 bullet-arrow">
                  <li className="flex gap-4 items-start">
                    <span>Análisis exhaustivo del estado actual</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span>Identificación de quick wins y mejoras a largo plazo</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span>Recomendaciones accionables y priorizadas</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span>Acompañamiento en la implementación</span>
                  </li>
                </ul>
              </div>
            </FadeIn>
          </article>
        </div>

        <footer className="mt-32 pt-16 border-t border-[#060357]/10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <h3 className="heading-serif text-3xl md:text-4xl text-[#060357] tracking-tight">
              ¿Hablamos?
            </h3>
            <MagneticButton 
              href="/#contacto"
              className="btn-pill bg-[#060357] text-white hover:bg-[#ff0000]"
            >
              Contactar
            </MagneticButton>
          </div>
        </footer>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEGAL PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function LegalPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  if (!id || !['privacy', 'cookies', 'legal'].includes(id)) {
    return <div className="pt-40 px-6 text-center">{t('common.pageNotFound')}</div>
  }

  const titleMap: Record<string, string> = {
    'privacy': t('legal.privacy.title'),
    'cookies': t('legal.cookies.title'),
    'legal': t('legal.legal_notice.title')
  }

  const renderPrivacyContent = () => (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 font-sans">{t('legal.privacy.section1_title')}</h2>
        <div className="space-y-1 text-[#6B6B6B]">
          <p>{t('legal.privacy.section1_content1')}</p>
          <p>{t('legal.privacy.section1_content2')}</p>
          <p>{t('legal.privacy.section1_content3')}</p>
          <p>{t('legal.privacy.section1_content4')}</p>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 font-sans">{t('legal.privacy.section2_title')}</h2>
        <p className="text-[#6B6B6B] mb-3">{t('legal.privacy.section2_intro')}</p>
        <ul className="list-disc pl-6 space-y-2 text-[#6B6B6B]">
          <li>{t('legal.privacy.section2_item1')}</li>
          <li>{t('legal.privacy.section2_item2')}</li>
          <li>{t('legal.privacy.section2_item3')}</li>
          <li>{t('legal.privacy.section2_item4')}</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 font-sans">{t('legal.privacy.section3_title')}</h2>
        <p className="text-[#6B6B6B] mb-3">{t('legal.privacy.section3_intro')}</p>
        <ul className="list-disc pl-6 space-y-2 text-[#6B6B6B]">
          <li>{t('legal.privacy.section3_item1')}</li>
          <li>{t('legal.privacy.section3_item2')}</li>
          <li>{t('legal.privacy.section3_item3')}</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 font-sans">{t('legal.privacy.section4_title')}</h2>
        <p className="text-[#6B6B6B]">{t('legal.privacy.section4_content')}</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 font-sans">{t('legal.privacy.section5_title')}</h2>
        <p className="text-[#6B6B6B]">{t('legal.privacy.section5_content')}</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 font-sans">{t('legal.privacy.section6_title')}</h2>
        <p className="text-[#6B6B6B]">{t('legal.privacy.section6_content')}</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 font-sans">{t('legal.privacy.section7_title')}</h2>
        <p className="text-[#6B6B6B]">{t('legal.privacy.section7_content')}</p>
      </section>
    </div>
  )

  const renderCookiesContent = () => (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 font-sans">{t('legal.cookies.section1_title')}</h2>
        <p className="text-[#6B6B6B]">{t('legal.cookies.section1_content')}</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 font-sans">{t('legal.cookies.section2_title')}</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2 font-sans">{t('legal.cookies.section2_type1_title')}</h3>
            <ul className="list-disc pl-6 space-y-1 text-[#6B6B6B]">
              <li>{t('legal.cookies.section2_type1_item1')}</li>
              <li>{t('legal.cookies.section2_type1_item2')}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2 font-sans">{t('legal.cookies.section2_type2_title')}</h3>
            <ul className="list-disc pl-6 space-y-1 text-[#6B6B6B]">
              <li>{t('legal.cookies.section2_type2_item1')}</li>
              <li>{t('legal.cookies.section2_type2_item2')}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2 font-sans">{t('legal.cookies.section2_type3_title')}</h3>
            <ul className="list-disc pl-6 space-y-1 text-[#6B6B6B]">
              <li>{t('legal.cookies.section2_type3_item1')}</li>
              <li>{t('legal.cookies.section2_type3_item2')}</li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 font-sans">{t('legal.cookies.section3_title')}</h2>
        <div className="space-y-3 text-[#6B6B6B]">
          <p>{t('legal.cookies.section3_content1')}</p>
          <p>{t('legal.cookies.section3_content2')}</p>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 font-sans">{t('legal.cookies.section4_title')}</h2>
        <p className="text-[#6B6B6B]">{t('legal.cookies.section4_content')}</p>
      </section>
    </div>
  )

  const renderLegalNoticeContent = () => (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 font-sans">{t('legal.legal_notice.section1_title')}</h2>
        <div className="space-y-1 text-[#6B6B6B]">
          <p>{t('legal.legal_notice.section1_content1')}</p>
          <p>{t('legal.legal_notice.section1_content2')}</p>
          <p>{t('legal.legal_notice.section1_content3')}</p>
          <p>{t('legal.legal_notice.section1_content4')}</p>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 font-sans">{t('legal.legal_notice.section2_title')}</h2>
        <p className="text-[#6B6B6B]">{t('legal.legal_notice.section2_content')}</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 font-sans">{t('legal.legal_notice.section3_title')}</h2>
        <div className="space-y-3 text-[#6B6B6B]">
          <p>{t('legal.legal_notice.section3_content1')}</p>
          <p>{t('legal.legal_notice.section3_content2')}</p>
          <p>{t('legal.legal_notice.section3_content3')}</p>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 font-sans">{t('legal.legal_notice.section4_title')}</h2>
        <div className="space-y-3 text-[#6B6B6B]">
          <p>{t('legal.legal_notice.section4_content1')}</p>
          <p>{t('legal.legal_notice.section4_content2')}</p>
          <p>{t('legal.legal_notice.section4_content3')}</p>
          <p>{t('legal.legal_notice.section4_content4')}</p>
          <p>{t('legal.legal_notice.section4_content5')}</p>
          <p>{t('legal.legal_notice.section4_content6')}</p>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 font-sans">{t('legal.legal_notice.section5_title')}</h2>
        <div className="space-y-3 text-[#6B6B6B]">
          <p>{t('legal.legal_notice.section5_content1')}</p>
          <p>{t('legal.legal_notice.section5_content2')}</p>
          <p>{t('legal.legal_notice.section5_content3')}</p>
        </div>
      </section>
    </div>
  )

  const renderContent = () => {
    switch (id) {
      case 'privacy':
        return renderPrivacyContent()
      case 'cookies':
        return renderCookiesContent()
      case 'legal':
        return renderLegalNoticeContent()
      default:
        return null
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#F9F9F9] min-h-screen pt-40 pb-24"
    >
      <div className="max-w-3xl mx-auto px-6">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-3 text-[#060357]/40 hover:text-[#060357] transition-colors mb-12 group cursor-pointer"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
          <span className="eyebrow">{t('legal.back')}</span>
        </button>
        
        <header className="mb-16">
          <MaskRevealText>
            <h1 className="heading-serif text-[#060357] text-4xl md:text-5xl tracking-tight mb-4">
              {titleMap[id]}
            </h1>
          </MaskRevealText>
          <FadeIn delay={0.2}>
            <p className="text-[#060357]/40 text-sm tracking-wider font-sans">
              {t('legal.last_updated')}
            </p>
          </FadeIn>
        </header>

        <FadeIn delay={0.3}>
          <div className="text-sm leading-relaxed font-sans">
            {renderContent()}
          </div>
        </FadeIn>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAVBAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function Navbar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isFirmDropdownOpen, setIsFirmDropdownOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isDarkPage = location.pathname === '/team' || location.pathname === '/private-equity'
  const { t } = useTranslation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    // Check initial scroll position
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: t('nav.services'), href: isHome ? '#servicios' : '/#servicios' },
    { label: t('nav.ma_practice'), href: '/private-equity' },
    { label: t('nav.contact'), href: isHome ? '#contacto' : '/#contacto' }
  ]

  // Determine navbar styles based on page and scroll state
  const isLightNav = isDarkPage && !isScrolled
  const navBgClass = isScrolled
    ? 'py-4 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5]'
    : isLightNav
    ? 'py-6 bg-transparent'
    : 'py-6 bg-transparent'
  const textColorClass = isLightNav ? 'text-white' : isScrolled ? 'text-[#6B6B6B]' : 'text-[#6B6B6B]'
  const hoverTextColorClass = isLightNav ? 'hover:text-white/80' : 'hover:text-[#1A1A1A]'
  const logoSrc = isLightNav ? '/loto tauler white.png' : '/logo tauler.png'

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBgClass}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: easeOutExpo }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src={logoSrc}
            alt="Tauler Group" 
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {/* La Firma with Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsFirmDropdownOpen(true)}
            onMouseLeave={() => setIsFirmDropdownOpen(false)}
          >
            <a 
              href={isHome ? '#about' : '/#about'}
              className={`${textColorClass} ${hoverTextColorClass} transition-colors text-sm font-medium flex items-center gap-1`}
            >
              {t('nav.about')}
              <svg 
                className={`w-4 h-4 transition-transform ${isFirmDropdownOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </a>
            
            <AnimatePresence>
              {isFirmDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2, ease: easeOutExpo }}
                  className="absolute top-full left-0 mt-2 bg-white border border-[#E5E5E5] rounded-xl shadow-lg py-2 min-w-[180px] z-50"
                >
                  <Link
                    to="/team"
                    className="block px-6 py-3 text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F9F9F9] transition-colors text-sm font-medium"
                  >
                    {t('nav.team')}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navLinks.map(link => (
            <a 
              key={link.label}
              href={link.href} 
              className={`${textColorClass} ${hoverTextColorClass} transition-colors text-sm font-medium`}
            >
              {link.label}
            </a>
          ))}
          <LanguageSelector isLight={isLightNav} />
          <MagneticButton
            href={isHome ? '#contacto' : '/#contacto'}
            className={isLightNav 
              ? "bg-white text-[#1A1A1A] px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/90 transition-all duration-500"
              : "bg-[#1A1A1A] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#436be0] transition-all duration-500"
            }
          >
            {t('nav.letsTalk')}
          </MagneticButton>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={onMenuOpen}
          className={`md:hidden flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
            isLightNav 
              ? 'hover:bg-white/10 text-white' 
              : 'hover:bg-[#F9F9F9] text-[#1A1A1A]'
          }`}
          aria-label={t('nav.openMenu')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </motion.nav>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE MENU COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { t } = useTranslation()
  const [isFirmExpanded, setIsFirmExpanded] = useState(false)

  const navLinks = [
    { label: t('nav.services'), href: isHome ? '#servicios' : '/#servicios' },
    { label: t('nav.ma_practice'), href: '/private-equity' },
    { label: t('nav.contact'), href: isHome ? '#contacto' : '/#contacto' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#060357]/10 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#F9F9F9] z-50 p-8 flex flex-col"
          >
            <button
              onClick={onClose}
              className="self-end p-2 text-[#060357]/50 hover:text-[#060357] transition-colors"
              aria-label={t('nav.closeMenu')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <nav className="flex-1 flex flex-col justify-center gap-8">
              {/* La Firma with Submenu */}
              <div>
                <motion.button
                  onClick={() => setIsFirmExpanded(!isFirmExpanded)}
                  className="heading-serif text-4xl text-[#060357] tracking-tight flex items-center gap-3 w-full text-left"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, ease: easeOutExpo }}
                >
                  {t('nav.about')}
                  <svg 
                    className={`w-6 h-6 transition-transform ${isFirmExpanded ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </motion.button>
                <AnimatePresence>
                  {isFirmExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: easeOutExpo }}
                      className="overflow-hidden pl-8 mt-4"
                    >
                      <Link
                        to="/team"
                        onClick={onClose}
                        className="heading-serif text-3xl text-[#060357]/70 hover:text-[#060357] tracking-tight block"
                      >
                        {t('nav.team')}
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="heading-serif text-4xl text-[#060357] tracking-tight"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (index + 2), ease: easeOutExpo }}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <MagneticButton
              href={isHome ? '#contacto' : '/#contacto'}
              onClick={onClose}
              className="btn-pill bg-[#060357] text-white text-center"
            >
              {t('nav.letsTalk')}
            </MagneticButton>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// HERO SECTION - Editorial Statement with MASSIVE Typography
// ═══════════════════════════════════════════════════════════════════════════════

function HeroSection() {
  const ref = useRef(null)
  const heroRef = useRef(null)
  const isInView = useInView(heroRef, { once: true })
  const { t } = useTranslation()

  return (
    <section
      ref={ref}
      className="min-h-screen bg-white flex items-center relative overflow-hidden py-32"
    >
      {/* Video Background - Subtle */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        >
          <source src="/videocorto2.webm" type="video/webm" />
        </video>
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/70"></div>
      </div>

      <motion.div 
        ref={heroRef}
        className="w-full max-w-[900px] mx-auto px-6 md:px-12 relative z-10"
      >
        <div className="flex flex-col items-center text-center">
          
          {/* Large Heading - Gooby Style */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: easeOutExpo }}
            className="text-[#1A1A1A] text-[clamp(2.5rem,10vw,6rem)] font-bold tracking-[-0.04em] leading-[1.05] mb-8"
          >
            {t('hero.title1')}
          </motion.h1>
          
          {/* Highlighted tagline - Gooby style with background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: easeOutExpo }}
            className="bg-[#436be0] px-4 py-2 inline-block mb-10"
          >
            <p className="text-white text-sm md:text-base font-medium">
              {t('hero.tagline')}
            </p>
          </motion.div>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: easeOutExpo }}
            className="text-[#6B6B6B] text-base md:text-lg leading-[1.7] max-w-2xl mb-12"
          >
            {t('hero.subtitle')}
          </motion.p>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: easeOutExpo }}
          >
            <MagneticButton 
              href="#contacto"
              className="bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-[#ff0000] transition-all duration-500"
            >
              {t('hero.cta')}
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGOS SECTION - Client Trust Bar
// ═══════════════════════════════════════════════════════════════════════════════

interface Company {
  name: string
  logo: string
  description: string
  url: string
}

function LogosSection() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const { t } = useTranslation()
  
  const companies: Company[] = [
    { 
      name: 'Transition Capital', 
      logo: '/Transition-capital-logo-1.svg',
      description: 'Firma de capital privado que se asocia con equipos directivos excepcionales para construir o acelerar empresas líderes en su sector y afrontar nuevos retos societarios.',
      url: 'https://transitioncapital.com'
    },
    { 
      name: 'Dormitorum', 
      logo: '/logo-dormitorum-aislado-1.png',
      description: 'Líderes en el sector del descanso, combinando retail físico y digital con gran expansión.',
      url: 'https://dormitorum.com'
    },
    { 
      name: 'Gesplan', 
      logo: '/gesplan.svg',
      description: 'Empresa especializada en labores de planificación, gestión y ejecución de proyectos relacionados con el territorio y el medioambiente.',
      url: 'https://gesplan.es'
    },
    { 
      name: 'Municipia', 
      logo: '/logo municipia color.png',
      description: 'Chatbot de IA para ayuntamientos.',
      url: 'https://municipia.es'
    },
    { 
      name: 'Columbus', 
      logo: '/logo Columbus gris.png',
      description: 'El Sistema Operativo para mercados privados, especialmente diseñado para Boutiques de M&A y Firmas de Capital/Crédito Privado.',
      url: 'https://columbus.taulergroup.com'
    },
  ]

  return (
    <>
      <section className="bg-[#F9F9F9] py-12 border-t border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-10 md:gap-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            {companies.map((company, i) => (
              <motion.button
                key={i}
                onClick={() => setSelectedCompany(company)}
                className="group relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <img 
                  src={company.logo} 
                  alt={company.name}
                  className="h-8 md:h-10 w-auto object-contain opacity-40 group-hover:opacity-80 grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Company Modal */}
      <AnimatePresence>
        {selectedCompany && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCompany(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              className="relative bg-white rounded-2xl p-8 md:p-10 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedCompany(null)}
                className="absolute top-4 right-4 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Logo */}
              <div className="flex justify-center mb-6">
                <img 
                  src={selectedCompany.logo} 
                  alt={selectedCompany.name}
                  className="h-12 md:h-14 w-auto object-contain"
                />
              </div>

              {/* Company name */}
              <h3 className="text-xl font-bold text-[#1A1A1A] text-center mb-4 font-sans">
                {selectedCompany.name}
              </h3>

              {/* Description */}
              <p className="text-[#6B6B6B] text-sm leading-relaxed text-center mb-8 font-sans">
                {selectedCompany.description}
              </p>

              {/* Visit button */}
              <a
                href={selectedCompany.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#1A1A1A] text-white text-center py-3 px-6 rounded-full text-sm font-semibold tracking-wide hover:bg-[#333] transition-colors duration-300 font-sans"
              >
                {t('logos.visitWeb')}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ABOUT SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function AboutSection() {
  const { t } = useTranslation()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="bg-white py-24 md:py-32 border-t border-[#E5E5E5]" id="about">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Centered Content - Gooby Style */}
        <div ref={ref} className="text-center max-w-4xl mx-auto">
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-[#1A1A1A] text-[clamp(2rem,6vw,4rem)] font-bold tracking-[-0.03em] leading-[1.1] mb-12"
          >
            {t('about.title1')}<br />
            <span className="italic font-normal text-[#6B6B6B]">{t('about.title2')}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: easeOutExpo }}
            className="text-[#1A1A1A] text-lg md:text-xl leading-[1.7] font-semibold mb-8"
          >
            {t('about.description_highlight')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: easeOutExpo }}
            className="text-[#6B6B6B] text-base md:text-lg leading-[1.7] mb-6"
          >
            {t('about.description1')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: easeOutExpo }}
            className="text-[#6B6B6B] text-base md:text-lg leading-[1.7] mb-8"
          >
            {t('about.description2')}
          </motion.p>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: easeOutExpo }}
            href={isHome ? '#servicios' : '/#servicios'}
            className="inline-flex items-center gap-2 text-[#436be0] hover:text-[#1A1A1A] transition-colors font-medium"
          >
            {t('about.link')}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.a>
          
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATS SECTION - Gooby inspired with large numbers
// ═══════════════════════════════════════════════════════════════════════════════

function StatsSection() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="bg-[#F9F9F9] py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Left: Image Collage */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="grid grid-cols-2 gap-3 h-[650px]"
          >
            {/* Large image - takes full height, left column */}
            <div className="overflow-hidden bg-white">
              <img 
                src="/equipo multidisciplinar ok.webp" 
                alt="Equipo multidisciplinar"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Right column with two stacked images */}
            <div className="flex flex-col gap-3">
              {/* Large image - top (70% of height) */}
              <div className="overflow-hidden bg-white h-[455px]">
                <img 
                  src="/metodo probado ok.webp" 
                  alt="Método probado"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Small image - bottom (30% of height) */}
              <div className="overflow-hidden bg-white flex-1">
                <img 
                  src="/holistica 2 ok.webp" 
                  alt="Visión holística"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <div className="space-y-12">
            
            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-[#1A1A1A] text-[clamp(1.75rem,5vw,3.5rem)] font-bold tracking-[-0.03em] leading-[1.1]"
          >
            {t('stats.headline1')}<br />
            {t('stats.headline3')}<br />
            {t('stats.headline4')}
          </motion.h2>
            
            {/* Value Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              
              {/* Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: easeOutExpo }}
                className="bg-white border border-[#E5E5E5] rounded-2xl p-6 hover:border-[#436be0]/30 transition-colors"
              >
                <h3 className="text-[#1A1A1A] text-lg font-bold mb-3">{t('stats.card1_title')}</h3>
                <p className="text-[#6B6B6B] text-sm leading-[1.7]">{t('stats.card1_desc')}</p>
              </motion.div>
              
              {/* Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3, ease: easeOutExpo }}
                className="bg-white border border-[#E5E5E5] rounded-2xl p-6 hover:border-[#436be0]/30 transition-colors"
              >
                <h3 className="text-[#1A1A1A] text-lg font-bold mb-3">{t('stats.card2_title')}</h3>
                <p className="text-[#6B6B6B] text-sm leading-[1.7]">{t('stats.card2_desc')}</p>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4, ease: easeOutExpo }}
                className="bg-white border border-[#E5E5E5] rounded-2xl p-6 hover:border-[#436be0]/30 transition-colors"
              >
                <h3 className="text-[#1A1A1A] text-lg font-bold mb-3">{t('stats.card3_title')}</h3>
                <p className="text-[#6B6B6B] text-sm leading-[1.7]">{t('stats.card3_desc')}</p>
              </motion.div>

              {/* Card 4 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5, ease: easeOutExpo }}
                className="bg-white border border-[#E5E5E5] rounded-2xl p-6 hover:border-[#436be0]/30 transition-colors"
              >
                <h3 className="text-[#1A1A1A] text-lg font-bold mb-3">{t('stats.card4_title')}</h3>
                <p className="text-[#6B6B6B] text-sm leading-[1.7]">{t('stats.card4_desc')}</p>
              </motion.div>
              
            </div>
            
          </div>
          
        </div>

      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VALUES SECTION - Gooby inspired
// ═══════════════════════════════════════════════════════════════════════════════

function ValuesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { t } = useTranslation()

  const points = [
    {
      title: t('approach.point1_title'),
      desc: t('approach.point1_desc')
    },
    {
      title: t('approach.point2_title'),
      desc: t('approach.point2_desc')
    },
    {
      title: t('approach.point3_title'),
      desc: t('approach.point3_desc')
    }
  ]

  return (
    <section className="bg-[#F9F9F9] py-24 md:py-32" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
            className="text-[#436be0] text-xs tracking-[0.3em] uppercase font-medium mb-6"
          >
            {t('approach.label')}
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: easeOutExpo }}
            className="text-[#1A1A1A] text-[clamp(2rem,6vw,4rem)] font-bold tracking-[-0.03em] leading-[1.1] mb-8 max-w-4xl mx-auto"
          >
            {t('approach.title')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: easeOutExpo }}
            className="text-[#6B6B6B] text-lg md:text-xl leading-[1.7] max-w-3xl mx-auto mb-12"
          >
            {t('approach.description')}
          </motion.p>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: easeOutExpo }}
            className="text-[#1A1A1A] text-xl md:text-2xl font-bold tracking-tight mb-12"
          >
            {t('approach.separator_title')}
          </motion.h3>
        </motion.div>

        {/* Points Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {points.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: easeOutExpo }}
              className="bg-white rounded-2xl p-8 border border-[#E5E5E5] hover:border-[#436be0]/30 hover:shadow-lg transition-all duration-500"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#436be0]/10 border border-[#436be0]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#436be0] text-xl font-bold">{i + 1}</span>
                </div>
                <h3 className="text-[#1A1A1A] text-xl font-bold tracking-tight leading-tight">
                  {point.title}
                </h3>
              </div>
              <p className="text-[#6B6B6B] text-base leading-[1.7]">
                {point.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// BENEFITS SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function BenefitsSection() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const benefits = [
    t('benefits.benefit1'),
    t('benefits.benefit2'),
    t('benefits.benefit3'),
    t('benefits.benefit4'),
    t('benefits.benefit5'),
    t('benefits.benefit6')
  ].filter(b => b)

  return (
    <section className="bg-white py-24 md:py-32" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
            className="text-[#436be0] text-xs tracking-[0.3em] uppercase font-medium mb-6"
          >
            {t('benefits.label')}
          </motion.p>
          <h2 className="text-[#1A1A1A] text-[clamp(2rem,6vw,4rem)] font-bold tracking-[-0.03em] leading-[1.1] mb-6">
            {t('benefits.title1')}<br />
            {t('benefits.title2')}
          </h2>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: easeOutExpo }}
              className="bg-[#F9F9F9] rounded-2xl p-6 border border-[#E5E5E5] hover:border-[#436be0]/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#436be0]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#436be0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <p className="text-[#1A1A1A] text-base leading-[1.7] font-medium">
                  {benefit}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES SECTION - Premium Journey Design
// ═══════════════════════════════════════════════════════════════════════════════

function ServicesSection() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  // Solo los 3 primeros servicios
  const serviceBlocks = [
    {
      number: '01',
      slug: 'strategy',
      title: t('services_section.service1.title'),
      role: t('services_section.service1.role'),
      shortLabel: 'STRATEGY',
      intro: t('services_section.service1.intro'),
      points: [
        t('services_section.service1.point1'),
        t('services_section.service1.point2'),
        t('services_section.service1.point3'),
        t('services_section.service1.point4')
      ].filter(p => p),
      result: t('services_section.service1.result'),
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M11 8v6M8 11h6" />
        </svg>
      )
    },
    {
      number: '02',
      slug: 'build',
      title: t('services_section.service2.title'),
      role: t('services_section.service2.role'),
      shortLabel: 'BUILD',
      intro: t('services_section.service2.intro'),
      points: [
        t('services_section.service2.point1'),
        t('services_section.service2.point2'),
        t('services_section.service2.point3'),
        t('services_section.service2.point4')
      ].filter(p => p),
      result: t('services_section.service2.result'),
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 3v18h18" />
          <path d="m7 14 4-4 4 4 6-6" />
        </svg>
      )
    },
    {
      number: '03',
      slug: 'govern',
      title: t('services_section.service3.title'),
      role: t('services_section.service3.role'),
      shortLabel: 'GOVERN',
      intro: t('services_section.service3.intro'),
      points: [
        t('services_section.service3.point1'),
        t('services_section.service3.point2'),
        t('services_section.service3.point3'),
        t('services_section.service3.point4')
      ].filter(p => p),
      result: t('services_section.service3.result'),
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      )
    }
  ]

  return (
    <section 
      ref={ref}
      className="bg-[#1A1A1A] py-16 md:py-20 overflow-hidden" 
      id="servicios"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="text-[#436be0] text-xs tracking-[0.3em] uppercase font-medium mb-6"
          >
            {t('services_section.label')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: easeOutExpo }}
            className="text-white text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.03em] leading-[1.1] mb-6"
          >
            {t('services_section.title1')}<br />
            {t('services_section.title2')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: easeOutExpo }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            {t('services_section.closing')}
          </motion.p>
        </div>

        {/* Services Grid - 3 Columns */}
        <div className="grid md:grid-cols-3 gap-8">
          {serviceBlocks.map((service, index) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: easeOutExpo }}
              className="bg-gradient-to-br from-[#1A1A1A] to-[#151515] rounded-2xl p-6 border border-white/5 hover:border-[#436be0]/30 transition-all duration-500 group"
            >
              {/* Icon & Number */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#436be0]/10 border border-[#436be0]/20 flex items-center justify-center text-[#436be0] group-hover:bg-[#436be0]/20 transition-colors">
                  {service.icon}
                </div>
                <span className="text-[#436be0] text-xs tracking-[0.2em] uppercase font-medium">
                  {service.number}
                </span>
              </div>

              {/* Title & Role */}
              <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight mb-2">
                {service.title}
              </h3>
              {service.role && (
                <p className="text-white/60 text-sm font-medium mb-3">
                  {service.role}
                </p>
              )}

              {/* Intro */}
              <p className="text-white/70 text-sm leading-relaxed mb-5">
                {service.intro}
              </p>

              {/* Points */}
              <ul className="space-y-2.5 mb-5">
                {service.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#436be0] text-xs font-bold">{i + 1}</span>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {point}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Result */}
              <div className="bg-gradient-to-r from-[#436be0]/10 to-transparent border border-[#436be0]/20 rounded-xl px-4 py-3 mb-5">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{t('services_section.result_label')}</p>
                <p className="text-white text-sm font-medium">
                  {service.result}
                </p>
              </div>

              {/* Link */}
              <Link 
                to={`/servicios/${service.slug}`}
                className="inline-flex items-center gap-2 text-[#436be0] hover:text-white transition-colors text-sm font-medium group/link"
              >
                <span>{t('services_section.viewDetail')}</span>
                <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// M&A SERVICE SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function MAServiceSection() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const maService = {
    number: '04',
    slug: 'ma',
    title: t('services_section.service4.title'),
    role: t('services_section.service4.role'),
    intro: t('services_section.service4.intro'),
    points: [
      t('services_section.service4.point1'),
      t('services_section.service4.point2'),
      t('services_section.service4.point3'),
      t('services_section.service4.point4')
    ].filter(p => p),
    result: t('services_section.service4.result'),
    viewDetail: t('services_section.service4.viewDetail'),
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    )
  }

  return (
    <section 
      ref={ref}
      className="bg-[#1A1A1A] py-16 md:py-20 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Service Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="bg-gradient-to-br from-[#1A1A1A] to-[#151515] rounded-3xl p-8 md:p-10 border border-white/5"
        >
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left: Content */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#436be0]/10 border border-[#436be0]/20 flex items-center justify-center text-[#436be0]">
                  {maService.icon}
                </div>
                <div>
                  <span className="text-[#436be0] text-xs tracking-[0.2em] uppercase font-medium">
                    {maService.number}
                  </span>
                  <h3 className="text-white text-2xl md:text-3xl font-bold tracking-tight mb-2">
                    {maService.title}
                  </h3>
                  {maService.role && (
                    <p className="text-white/60 text-sm font-medium">
                      {maService.role}
                    </p>
                  )}
                </div>
              </div>
              
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                {maService.intro}
              </p>
              
              <Link 
                to="/private-equity"
                className="inline-flex items-center gap-2 text-[#436be0] hover:text-white transition-colors group/link"
              >
                <span className="text-sm font-medium">{maService.viewDetail}</span>
                <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Right: Points & Result */}
            <div>
              <div className="space-y-4 mb-6">
                {maService.points.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-4 group/point"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover/point:border-[#436be0]/30 group-hover/point:bg-[#436be0]/10 transition-colors">
                      <span className="text-[#436be0] text-xs font-bold">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed pt-1">
                      {point}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Result Badge */}
              <div className="bg-gradient-to-r from-[#436be0]/10 to-transparent border border-[#436be0]/20 rounded-xl px-6 py-4">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{t('services_section.result_label')}</p>
                <p className="text-white font-medium">
                  {maService.result}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PE TEASER SECTION - Homepage Bento Grid for Private Equity
// ═══════════════════════════════════════════════════════════════════════════════

// @ts-ignore - Reserved for future use
function PETeaserSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { t } = useTranslation()

  return (
    <section ref={ref} className="bg-slate-950 py-24 md:py-32 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Gradient accent */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[#436be0]/10 to-transparent pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Bento Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Main Content Card - Spans 7 columns */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="lg:col-span-7 bg-gradient-to-br from-slate-900 to-slate-900/80 rounded-3xl p-10 md:p-14 border border-white/5 relative overflow-hidden group"
          >
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#436be0]/20 to-transparent rounded-bl-full" />
            
            <div className="relative z-10">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="w-2 h-2 rounded-full bg-[#436be0]" />
                <span className="text-[#436be0] text-xs tracking-[0.3em] uppercase font-medium">
                  {t('pe.teaser.eyebrow')}
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3, ease: easeOutExpo }}
                className="text-white text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.03em] leading-[1.05] mb-6"
              >
                {t('pe.teaser.headline')}<br />
                <span className="text-white/40 italic font-normal">{t('pe.teaser.headline_accent')}</span>
              </motion.h2>

              {/* Sub-headline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4, ease: easeOutExpo }}
                className="text-white/60 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
              >
                {t('pe.teaser.subheadline')}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5, ease: easeOutExpo }}
              >
                <Link
                  to="/private-equity"
                  className="inline-flex items-center gap-3 bg-[#436be0] text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-[#5b7fe8] transition-all duration-500 group/btn"
                >
                  <span>{t('pe.teaser.cta')}</span>
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Stacked Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* The Hook Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: easeOutExpo }}
              className="bg-gradient-to-br from-[#436be0]/20 to-slate-900 rounded-3xl p-8 border border-[#436be0]/20 flex-1"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#436be0]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#436be0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/40 text-xs tracking-widest uppercase mb-2">{t('pe.teaser.hook_label')}</p>
                  <p className="text-white font-medium leading-relaxed">
                    {t('pe.teaser.hook')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Abstract Graph Visualization Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: easeOutExpo }}
              className="bg-slate-900/60 rounded-3xl p-8 border border-white/5 flex-1 relative overflow-hidden"
            >
              {/* Minimalist "Bridge" / "Graph Going Up" Visualization */}
              <svg className="w-full h-32 md:h-40" viewBox="0 0 300 100" fill="none" preserveAspectRatio="xMidYMid meet">
                {/* Grid lines */}
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#436be0" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#436be0" stopOpacity="1" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="1" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#436be0" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#436be0" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Horizontal grid lines */}
                {[20, 40, 60, 80].map((y) => (
                  <motion.line
                    key={y}
                    x1="0" y1={y} x2="300" y2={y}
                    stroke="white"
                    strokeOpacity="0.05"
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 1.5, delay: 0.6 }}
                  />
                ))}
                
                {/* Area fill */}
                <motion.path
                  d="M0,90 Q50,85 100,70 T200,40 T300,15 L300,100 L0,100 Z"
                  fill="url(#areaGradient)"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 1, delay: 0.8 }}
                />
                
                {/* Main curve - The "Bridge" / growth line */}
                <motion.path
                  d="M0,90 Q50,85 100,70 T200,40 T300,15"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                />
                
                {/* Data points */}
                {[
                  { x: 0, y: 90 },
                  { x: 100, y: 70 },
                  { x: 200, y: 40 },
                  { x: 300, y: 15 }
                ].map((point, i) => (
                  <motion.circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#436be0"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.8 + i * 0.15 }}
                  />
                ))}
              </svg>
              
              {/* Labels */}
              <div className="flex justify-between mt-4 text-xs text-white/30">
                <span>{t('pe.scenarios.pre.title')}</span>
                <span>Due Diligence</span>
                <span>{t('pe.scenarios.post.title')}</span>
                <span>Exit</span>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRIVATE EQUITY LANDING PAGE - Full Conversion Page
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// PRIVATE EQUITY CONTACT FORM
// ═══════════════════════════════════════════════════════════════════════════════

function PEContactForm() {
  const { t } = useTranslation()
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus('submitting')

    // HubSpot form submission
    // Replace PORTAL_ID and FORM_ID with your actual HubSpot values
    const hubspotPortalId = 'YOUR_HUBSPOT_PORTAL_ID'
    const hubspotFormId = 'YOUR_HUBSPOT_FORM_ID'
    
    const hubspotData = {
      fields: [
        {
          objectTypeId: '0-1',
          name: 'firstname',
          value: formData.name.split(' ')[0] || formData.name
        },
        {
          objectTypeId: '0-1',
          name: 'lastname',
          value: formData.name.split(' ').slice(1).join(' ') || ''
        },
        {
          objectTypeId: '0-1',
          name: 'email',
          value: formData.email
        },
        {
          objectTypeId: '0-1',
          name: 'company',
          value: formData.company
        },
        {
          objectTypeId: '0-1',
          name: 'message',
          value: formData.message
        }
      ],
      context: {
        pageUri: typeof window !== 'undefined' ? window.location.href : '',
        pageName: 'Private Equity - Contact'
      }
    }

    try {
      const response = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(hubspotData)
        }
      )

      if (response.ok) {
        setFormStatus('success')
        setFormData({ name: '', email: '', company: '', message: '' })
      } else {
        setFormStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setFormStatus('error')
    }
  }

  return (
    <section id="contact-pe" className="py-24 md:py-32">
      <div className="max-w-[800px] mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
        >
          <h2 className="text-white text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.03em] mb-6">
            {t('pe.contact.headline')}<br />
            <span className="bg-gradient-to-r from-[#436be0] to-[#6366f1] bg-clip-text text-transparent">{t('pe.contact.headline_accent')}</span>
          </h2>

          <p className="text-white/50 text-lg mb-10 max-w-lg mx-auto">
            {t('pe.contact.description')}
          </p>

          {/* Contact Form */}
          <div className="bg-slate-800/50 rounded-3xl p-10 border border-white/5 mb-8">
            {formStatus === 'success' ? (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: easeOutExpo }}
                className="py-12 text-center"
              >
                <div className="text-[#10B981] text-6xl mb-6">✓</div>
                <h3 className="text-white text-2xl font-bold mb-3">Gracias</h3>
                <p className="text-white/60">Nos pondremos en contacto contigo en las próximas 24 horas.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div>
                  <label htmlFor="name" className="text-white/70 text-sm font-medium block mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#436be0] transition-colors"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-white/70 text-sm font-medium block mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#436be0] transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="text-white/70 text-sm font-medium block mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#436be0] transition-colors"
                    placeholder="Tu empresa"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="text-white/70 text-sm font-medium block mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#436be0] transition-colors resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-[#436be0] text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-[#5b7fe8] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      {t('pe.contact.cta')}
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>

                {formStatus === 'error' && (
                  <p className="text-[#EF4444] text-sm text-center">
                    Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.
                  </p>
                )}
              </form>
            )}
          </div>

          <p className="text-white/30 text-sm">
            {t('pe.contact.email_label')} <a href="mailto:info@taulergroup.com" className="text-[#436be0] hover:underline">info@taulergroup.com</a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function PrivateEquityPage() {
  const { t } = useTranslation()
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })
  const problemRef = useRef(null)
  const problemInView = useInView(problemRef, { once: true, margin: "-100px" })
  const solutionRef = useRef(null)
  const solutionInView = useInView(solutionRef, { once: true, margin: "-100px" })
  const scenariosRef = useRef(null)
  const scenariosInView = useInView(scenariosRef, { once: true, margin: "-100px" })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-slate-950 min-h-screen"
    >
      {/* ══════════════════════════════════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          {/* Gradient mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
          
          {/* Radial accent */}
          <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-[#436be0]/5 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#6366f1]/5 rounded-full blur-[120px] pointer-events-none" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#436be0] to-transparent" />
              <span className="text-[#436be0] text-xs tracking-[0.3em] uppercase font-medium">
                {t('pe.hero.eyebrow')}
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent via-[#436be0] to-transparent" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: easeOutExpo }}
              className="text-white text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-[-0.04em] leading-[0.95] mb-6"
            >
              {t('pe.hero.headline')}<br />
              <span className="bg-gradient-to-r from-[#436be0] to-[#6366f1] bg-clip-text text-transparent">{t('pe.hero.headline_accent')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: easeOutExpo }}
              className="text-white/60 text-xl md:text-2xl leading-relaxed mb-10 max-w-3xl mx-auto"
            >
              {t('pe.hero.subheadline')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: easeOutExpo }}
              className="flex flex-wrap justify-center gap-4"
            >
              <a
                href="#contact-pe"
                className="inline-flex items-center gap-3 bg-[#436be0] text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-[#5b7fe8] transition-all duration-500"
              >
                {t('pe.hero.cta_primary')}
              </a>
              <a
                href="#scenarios"
                className="inline-flex items-center gap-3 bg-white/5 text-white px-8 py-4 rounded-full text-sm font-medium border border-white/10 hover:bg-white/10 transition-all duration-500"
              >
                {t('pe.hero.cta_secondary')}
              </a>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          THE PROBLEM - VENDOR TRAP
          ══════════════════════════════════════════════════════════════════════════ */}
      <section ref={problemRef} className="py-24 md:py-32 bg-slate-900/50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-transparent h-32" />
        
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={problemInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-center mb-16"
          >
            <span className="text-[#436be0] text-xs tracking-[0.3em] uppercase font-medium">
              {t('pe.problem.eyebrow')}
            </span>
            <h2 className="text-white text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.03em] mt-4 max-w-4xl mx-auto">
              {t('pe.problem.headline')}
            </h2>
          </motion.div>

          {/* Single column layout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={problemInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: easeOutExpo }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <p className="text-white/80 text-xl leading-relaxed">
              {t('pe.problem.intro')}
            </p>
            
            <p className="text-white/70 text-lg leading-relaxed">
              {t('pe.problem.intro2')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          THE SOLUTION - TAULER'S ROLE
          ══════════════════════════════════════════════════════════════════════════ */}
      <section ref={solutionRef} className="py-24 md:py-32 relative">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={solutionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-center mb-16"
          >
            <span className="text-[#436be0] text-xs tracking-[0.3em] uppercase font-medium">
              {t('pe.solution.eyebrow')}
            </span>
            <h2 className="text-white text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.03em] mt-4 mb-4">
              {t('pe.solution.headline')}
            </h2>
            <p className="text-white/60 text-xl max-w-3xl mx-auto">
              {t('pe.solution.headline_accent')}
            </p>
          </motion.div>

          {/* 4 Levers Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                title: t('pe.solution.levers.lever1_title'),
                desc: t('pe.solution.levers.lever1_desc'),
                number: '01'
              },
              { 
                title: t('pe.solution.levers.lever2_title'),
                desc: t('pe.solution.levers.lever2_desc'),
                number: '02'
              },
              { 
                title: t('pe.solution.levers.lever3_title'),
                desc: t('pe.solution.levers.lever3_desc'),
                number: '03'
              },
              { 
                title: t('pe.solution.levers.lever4_title'),
                desc: t('pe.solution.levers.lever4_desc'),
                number: '04'
              },
            ].map((lever, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={solutionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: easeOutExpo }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-white/5 hover:border-[#436be0]/30 transition-all duration-500"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#436be0]/10 border border-[#436be0]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#436be0] text-sm font-bold">{lever.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-lg font-bold mb-2">
                      {lever.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {lever.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          SCENARIOS - USE CASES
          ══════════════════════════════════════════════════════════════════════════ */}
      <section ref={scenariosRef} id="scenarios" className="py-24 md:py-32 bg-slate-900/30">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={scenariosInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-center mb-16"
          >
            <span className="text-[#436be0] text-xs tracking-[0.3em] uppercase font-medium">
              {t('pe.scenarios.eyebrow')}
            </span>
            <h2 className="text-white text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.03em] mt-4">
              {t('pe.scenarios.headline')}
            </h2>
            <p className="text-white/60 text-lg mt-4 max-w-2xl mx-auto">
              {t('pe.scenarios.subheadline')}
            </p>
          </motion.div>

          {/* Horizontal Cards - 3 columns */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card A: Pre-Transaction */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={scenariosInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: easeOutExpo }}
              className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-10 border border-white/5 hover:border-[#436be0]/30 transition-all duration-500 relative overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#436be0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#436be0]/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#436be0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[#436be0] text-xs tracking-widest uppercase">{t('pe.scenarios.pre.type')}</span>
                    <h3 className="text-white text-2xl font-bold">{t('pe.scenarios.pre.title')}</h3>
                  </div>
                </div>

                <div className="bg-slate-950/50 rounded-2xl p-6 mb-8">
                  <p className="text-white font-semibold text-lg mb-2">{t('pe.scenarios.pre.subtitle')}</p>
                  <p className="text-white/60 leading-relaxed">
                    {t('pe.scenarios.pre.description')}
                  </p>
                </div>

                <ul className="space-y-3">
                  {(t('pe.scenarios.pre.items', { returnObjects: true }) as string[]).map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-white/50 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#436be0]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Card B: Post-Transaction */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={scenariosInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: easeOutExpo }}
              className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-10 border border-white/5 hover:border-[#10B981]/30 transition-all duration-500 relative overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#10B981]/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[#10B981] text-xs tracking-widest uppercase">{t('pe.scenarios.post.type')}</span>
                    <h3 className="text-white text-2xl font-bold">{t('pe.scenarios.post.title')}</h3>
                  </div>
                </div>

                <div className="bg-slate-950/50 rounded-2xl p-6 mb-8">
                  <p className="text-white font-semibold text-lg mb-2">{t('pe.scenarios.post.subtitle')}</p>
                  <p className="text-white/60 leading-relaxed">
                    {t('pe.scenarios.post.description')}
                  </p>
                </div>

                <ul className="space-y-3">
                  {(t('pe.scenarios.post.items', { returnObjects: true }) as string[]).map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-white/50 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Card C: Exit Readiness */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={scenariosInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: easeOutExpo }}
              className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-10 border border-white/5 hover:border-[#F59E0B]/30 transition-all duration-500 relative overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#F59E0B]/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#F59E0B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[#F59E0B] text-xs tracking-widest uppercase">{t('pe.scenarios.exit.type')}</span>
                    <h3 className="text-white text-2xl font-bold">{t('pe.scenarios.exit.title')}</h3>
                  </div>
                </div>

                <div className="bg-slate-950/50 rounded-2xl p-6 mb-8">
                  <p className="text-white font-semibold text-lg mb-2">{t('pe.scenarios.exit.subtitle')}</p>
                  <p className="text-white/60 leading-relaxed">
                    {t('pe.scenarios.exit.description')}
                  </p>
                </div>

                <ul className="space-y-3">
                  {(t('pe.scenarios.exit.items', { returnObjects: true }) as string[]).map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-white/50 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          FINAL CTA - CONTACT
          ══════════════════════════════════════════════════════════════════════════ */}
      <PEContactForm />
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function ContactSection() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const { t } = useTranslation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus('submitting')

    // HubSpot form submission
    // Replace PORTAL_ID and FORM_ID with your actual HubSpot values
    const hubspotPortalId = 'YOUR_HUBSPOT_PORTAL_ID'
    const hubspotFormId = 'YOUR_HUBSPOT_FORM_ID'
    
    const hubspotData = {
      fields: [
        {
          objectTypeId: '0-1',
          name: 'firstname',
          value: formData.name.split(' ')[0] || formData.name
        },
        {
          objectTypeId: '0-1',
          name: 'lastname',
          value: formData.name.split(' ').slice(1).join(' ') || ''
        },
        {
          objectTypeId: '0-1',
          name: 'email',
          value: formData.email
        },
        {
          objectTypeId: '0-1',
          name: 'company',
          value: formData.company
        },
        {
          objectTypeId: '0-1',
          name: 'message',
          value: formData.message
        }
      ],
      context: {
        pageUri: typeof window !== 'undefined' ? window.location.href : '',
        pageName: 'Contact - Landing Page'
      }
    }

    try {
      const response = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(hubspotData)
        }
      )

      if (response.ok) {
        setFormStatus('success')
        setFormData({ name: '', email: '', company: '', message: '' })
      } else {
        setFormStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setFormStatus('error')
    }
  }

  return (
    <section className="bg-white py-24 md:py-32" id="contacto" ref={ref}>
      <div className="max-w-[900px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-[#1A1A1A] text-[clamp(2rem,6vw,4rem)] font-bold tracking-[-0.03em] leading-[1.1] mb-6"
          >
            {t('contact.title1')}<br />
            <span className="italic font-normal text-[#6B6B6B]">{t('contact.title2')}</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: easeOutExpo }}
            className="text-[#6B6B6B] text-lg leading-[1.7] max-w-2xl mx-auto mb-8"
          >
            {t('contact.intro')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: easeOutExpo }}
          >
            <a 
              href="mailto:info@taulergroup.com" 
              className="text-[#1A1A1A] text-xl font-semibold hover:text-[#436be0] transition-colors duration-500"
            >
              info@taulergroup.com
            </a>
          </motion.div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: easeOutExpo }}
          className="bg-[#F9F9F9] rounded-3xl p-10 md:p-12"
        >
          {formStatus === 'success' ? (
            <div className="py-12 text-center">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: easeOutExpo }}
                className="text-[#436be0] text-6xl mb-6"
              >
                ✓
              </motion.div>
              <h3 className="text-[#1A1A1A] text-2xl font-bold mb-3">{t('contact.form_success_title')}</h3>
              <p className="text-[#6B6B6B]">{t('contact.form_success_message')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[#6B6B6B] text-sm font-medium block mb-3">
                    {t('contact.form_name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#436be0] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[#6B6B6B] text-sm font-medium block mb-3">
                    {t('contact.form_email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#436be0] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#6B6B6B] text-sm font-medium block mb-3">
                  {t('contact.form_company')}
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#436be0] transition-colors"
                />
              </div>
              <div>
                <label className="text-[#6B6B6B] text-sm font-medium block mb-3">
                  {t('contact.form_message')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#436be0] transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="w-full bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-[#436be0] hover:text-white transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {formStatus === 'submitting' ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('contact.form_submitting')}
                  </>
                ) : (
                  t('contact.form_submit')
                )}
              </button>
              {formStatus === 'error' && (
                <p className="text-[#EF4444] text-sm text-center">
                  Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.
                </p>
              )}
            </form>
          )}
        </motion.div>

      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════════

function Footer() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { t } = useTranslation()

  return (
    <footer className="bg-[#1A1A1A] py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
{/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <Link to="/" className="inline-block mb-6">
              <img 
                src="/loto tauler white.png" 
                alt="Tauler Group" 
                className="h-8 w-auto opacity-90"
              />
            </Link>
            <p className="text-white/50 text-sm leading-[1.7] mb-4 font-semibold">
              {t('tauler_group.title')}
            </p>
            <p className="text-white/50 text-sm leading-[1.7] mb-6">
              {t('tauler_group.description')}
            </p>
            {t('tauler_group.cta') && (
              <MagneticButton
                href={isHome ? '#contacto' : '/#contacto'}
                className="bg-[#436be0] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#5b7fe8] transition-all duration-500 inline-block"
              >
                {t('tauler_group.cta')}
              </MagneticButton>
            )}
          </div>

          <div>
            <h5 className="text-white text-sm font-semibold mb-4 font-sans">
              {t('footer.navigation_label')}
            </h5>
            <div className="flex flex-col gap-3">
              <a href={isHome ? '#about' : '/#about'} className="text-white/50 hover:text-white transition-colors text-sm font-sans">{t('nav.about')}</a>
              <a href={isHome ? '#servicios' : '/#servicios'} className="text-white/50 hover:text-white transition-colors text-sm font-sans">{t('nav.services')}</a>
              <a href={isHome ? '#contacto' : '/#contacto'} className="text-white/50 hover:text-white transition-colors text-sm font-sans">{t('nav.contact')}</a>
            </div>
          </div>
          
          <div>
            <h5 className="text-white text-sm font-semibold mb-4 font-sans">
              Legal
            </h5>
            <div className="flex flex-col gap-3">
              <Link to="/legal/privacy" className="text-white/50 hover:text-white transition-colors text-sm font-sans">{t('footer.privacy')}</Link>
              <Link to="/legal/cookies" className="text-white/50 hover:text-white transition-colors text-sm font-sans">{t('footer.cookies')}</Link>
              <Link to="/legal/legal" className="text-white/50 hover:text-white transition-colors text-sm font-sans">{t('footer.legal')}</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          
          <a
            href="https://www.linkedin.com/company/tauler-group/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function LandingPage() {
  return (
    <main>
      <HeroSection />
      <LogosSection />
      <AboutSection />
      <StatsSection />
      <ValuesSection />
      <ServicesSection />
      <MAServiceSection />
      <BenefitsSection />
      <ContactSection />
    </main>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// COOKIE BANNER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Small delay before showing banner
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-3 md:p-4"
        >
          <div className="max-w-4xl mx-auto bg-[#1A1A1A] rounded-xl px-5 py-3 md:px-6 md:py-4 shadow-2xl border border-white/10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
              <p className="text-white/80 text-xs flex-1 font-sans">
                {t('cookie_banner.message')}
              </p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  to="/legal/cookies"
                  className="text-white/50 hover:text-white text-xs font-sans transition-colors"
                >
                  {t('cookie_banner.more_info')}
                </Link>
                <button
                  onClick={handleReject}
                  className="px-4 py-1.5 text-white/70 hover:text-white text-xs font-semibold font-sans transition-colors"
                >
                  {t('cookie_banner.reject')}
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-1.5 bg-white text-[#1A1A1A] rounded-full text-xs font-semibold font-sans hover:bg-white/90 transition-colors"
                >
                  {t('cookie_banner.accept')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null)

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    setLenisInstance(lenis)

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <Router>
      <LenisContext.Provider value={lenisInstance}>
        {/* Mouse follow glow */}
        <MouseGlow />
        
        {/* Scroll progress bar */}
        <ScrollProgressBar />
        
        <ScrollToTop />
        <Navbar onMenuOpen={() => setIsMenuOpen(true)} />
        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/private-equity" element={<PrivateEquityPage />} />
          <Route path="/servicios/:id" element={<ServiceDetailPage />} />
          <Route path="/legal/:id" element={<LegalPage />} />
        </Routes>
        
        <Footer />
        <CookieBanner />
      </LenisContext.Provider>
    </Router>
  )
}

export default App

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

function LanguageSelector() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  
  const currentLang = i18n.language === 'en' ? 'EN' : 'ES'
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setIsOpen(false)
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-[#060357]/50 hover:text-[#060357] transition-colors text-[10px] tracking-[0.2em] font-medium"
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
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { t } = useTranslation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: t('nav.about'), href: isHome ? '#about' : '/#about' },
    { label: t('nav.services'), href: isHome ? '#servicios' : '/#servicios' },
    { label: t('nav.contact'), href: isHome ? '#contacto' : '/#contacto' }
  ]

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-4 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5]'
          : 'py-6 bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: easeOutExpo }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/logo tauler.png" 
            alt="Tauler Group" 
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(link => (
            <a 
              key={link.label}
              href={link.href} 
              className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
          <LanguageSelector />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={onMenuOpen}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#F9F9F9] transition-colors"
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

  const navLinks = [
    { label: t('nav.about'), href: isHome ? '#about' : '/#about' },
    { label: t('nav.services'), href: isHome ? '#servicios' : '/#servicios' },
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
              {navLinks.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="heading-serif text-4xl text-[#060357] tracking-tight"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, ease: easeOutExpo }}
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
            {t('hero.title1')}<br />
            <span className="italic font-normal">{t('hero.title2')}</span>
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
            className="text-[#6B6B6B] text-lg md:text-xl leading-[1.7] mb-8"
          >
            {t('about.intro')}
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: easeOutExpo }}
            className="text-[#1A1A1A] text-lg md:text-xl leading-[1.7] font-semibold"
          >
            {t('about.description_highlight')}
          </motion.p>
          
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
              {t('stats.headline2')} {t('stats.headline3')}<br />
              {t('stats.headline4')} <span className="italic font-normal text-[#6B6B6B]">{t('stats.headline5')}</span>
            </motion.h2>
            
            {/* Principios Operativos */}
            <div className="space-y-10 mt-12">
              
              {/* Principio 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: easeOutExpo }}
                className="border-l-2 border-[#1A1A1A] pl-6"
              >
                <div className="text-[#1A1A1A] text-sm font-bold mb-3 tracking-wider">01. LÓGICA DE NEGOCIO SOBRE CÓDIGO</div>
                <p className="text-[#6B6B6B] text-base leading-[1.7]">
                  No nos deslumbra el modelo más nuevo. Nos obsesiona el margen operativo y la convergencia entre la tecnología y la estrategia. Prescribimos soluciones desde un lente riguroso y pragmático.
                </p>
              </motion.div>
              
              {/* Principio 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3, ease: easeOutExpo }}
                className="border-l-2 border-[#1A1A1A] pl-6"
              >
                <div className="text-[#1A1A1A] text-sm font-bold mb-3 tracking-wider">02. SOBERANÍA DEL CLIENTE</div>
                <p className="text-[#6B6B6B] text-base leading-[1.7]">
                  La consultoría tradicional vive de crear dependencias. Nosotros vivimos de eliminarlas. Construimos sistemas que usted pueda auditar, controlar y gobernar sin nosotros.
                </p>
              </motion.div>

              {/* Principio 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4, ease: easeOutExpo }}
                className="border-l-2 border-[#1A1A1A] pl-6"
              >
                <div className="text-[#1A1A1A] text-sm font-bold mb-3 tracking-wider">03. HONESTIDAD RADICAL (FIDUCIARY STANDARD)</div>
                <p className="text-[#6B6B6B] text-base leading-[1.7]">
                  Actuamos con responsabilidad fiduciaria. Si una iniciativa va a destruir valor, tenemos la obligación moral y contractual de detenerla.
                </p>
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

  const comparativeItems = [
    {
      no: '"Proyectos de Ciencia"',
      noDesc: 'No hacemos I+D sin un Business Case validado. No experimentamos con su dinero.',
      yes: 'Impacto Forense en P&L',
      yesDesc: 'Cada euro invertido debe tener una trazabilidad clara hacia ahorro de costes o nuevos ingresos.'
    },
    {
      no: 'Cajas Negras',
      noDesc: 'Si no podemos explicar cómo el algoritmo toma la decisión, no se implementa. La auditabilidad no es negociable.',
      yes: 'Gestión de Riesgos',
      yesDesc: 'Tratamos la tecnología como un activo financiero. Evaluamos riesgo de ejecución, deuda técnica y coste de oportunidad.'
    },
    {
      no: 'Venta de Horas (Body Shopping)',
      noDesc: 'Nos oponemos al modelo de negocio arcaico del body shopping. Nuestros ingresos dependen exclusivamente de resolver problemas.',
      yes: 'Pragmatismo Brutal',
      yesDesc: 'La solución más simple que funcione es la solución correcta.'
    },
    {
      no: 'Hype Tecnológico',
      noDesc: 'Somos el filtro que separa la señal del ruido.',
      yes: 'Velocidad de Ejecución',
      yesDesc: 'El mercado no espera. Nuestros sprints de diagnóstico y validación se miden en semanas, no en trimestres.'
    }
  ]

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
          <h2 className="text-[#1A1A1A] text-[clamp(2rem,6vw,4rem)] font-bold tracking-[-0.03em] leading-[1.1] mb-6">
            Lo que NO compramos<br />
            <span className="italic font-normal text-[#6B6B6B]">vs. Lo que SÍ garantizamos</span>
          </h2>
        </motion.div>

        {/* Comparative Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {comparativeItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: easeOutExpo }}
              className="bg-[#F9F9F9] rounded-3xl p-8 hover:bg-[#F5F4F0] transition-colors duration-500"
            >
              {/* NO Section */}
              <div className="mb-6 pb-6 border-b border-[#E5E5E5]">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-[#ff0000] text-xl font-bold mt-1">✕</span>
                  <h3 className="text-[#1A1A1A] text-lg font-bold tracking-tight font-sans">
                    {item.no}
                  </h3>
                </div>
                <p className="text-[#6B6B6B] text-sm leading-[1.7] pl-8">
                  {item.noDesc}
                </p>
              </div>

              {/* YES Section */}
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-[#00C853] text-xl font-bold mt-1">✓</span>
                  <h3 className="text-[#1A1A1A] text-lg font-bold tracking-tight font-sans">
                    {item.yes}
                  </h3>
                </div>
                <p className="text-[#6B6B6B] text-sm leading-[1.7] pl-8">
                  {item.yesDesc}
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
  const [activeService, setActiveService] = useState(0)
  
  const serviceBlocks = [
    {
      number: '01',
      slug: 'diagnostico',
      title: t('services_section.service1.title'),
      shortLabel: 'Diagnóstico',
      intro: t('services_section.service1.intro'),
      points: [
        t('services_section.service1.point1'),
        t('services_section.service1.point2'),
        t('services_section.service1.point3'),
        t('services_section.service1.point4')
      ],
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
      slug: 'roadmap',
      title: t('services_section.service2.title'),
      shortLabel: 'Roadmap',
      intro: t('services_section.service2.intro'),
      points: [
        t('services_section.service2.point1'),
        t('services_section.service2.point2'),
        t('services_section.service2.point3'),
        t('services_section.service2.point4')
      ],
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
      slug: 'direccion',
      title: t('services_section.service3.title'),
      shortLabel: 'Dirección',
      intro: t('services_section.service3.intro'),
      points: [
        t('services_section.service3.point1'),
        t('services_section.service3.point2'),
        t('services_section.service3.point3'),
        t('services_section.service3.point4')
      ],
      result: t('services_section.service3.result'),
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      )
    },
    {
      number: '04',
      slug: 'executive-cto',
      title: t('services_section.service4.title'),
      shortLabel: 'STO',
      intro: t('services_section.service4.intro'),
      points: [
        t('services_section.service4.target1'),
        t('services_section.service4.target2'),
        t('services_section.service4.target3')
      ],
      result: t('services_section.service4.result'),
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )
    }
  ]

  return (
    <section 
      ref={ref}
      className="bg-[#0F0F0F] py-24 md:py-32 overflow-hidden" 
      id="servicios"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="text-[#436be0] text-xs tracking-[0.3em] uppercase font-medium mb-6"
          >
            Metodología
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: easeOutExpo }}
            className="text-white text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.03em] leading-[1.1] mb-6"
          >
            El viaje estratégico
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: easeOutExpo }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Cuatro fases diseñadas para llevar tu organización desde el diagnóstico inicial hasta la excelencia operativa
          </motion.p>
        </div>

        {/* Desktop: Interactive Journey Timeline */}
        <div className="hidden lg:block">
          {/* Progress Bar */}
          <div className="relative mb-16">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/10 -translate-y-1/2" />
            <motion.div 
              className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-[#436be0] to-[#6366f1] -translate-y-1/2"
              initial={{ width: '0%' }}
              animate={isInView ? { width: `${((activeService + 1) / 4) * 100}%` } : {}}
              transition={{ duration: 0.6, ease: easeOutExpo }}
            />
            
            {/* Step Indicators */}
            <div className="relative flex justify-between">
              {serviceBlocks.map((service, index) => (
                <motion.button
                  key={service.number}
                  onClick={() => setActiveService(index)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: easeOutExpo }}
                  className={`relative flex flex-col items-center group cursor-pointer ${
                    index <= activeService ? 'z-10' : 'z-0'
                  }`}
                >
                  {/* Node */}
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500
                    ${index === activeService 
                      ? 'bg-[#436be0] text-white scale-110 shadow-lg shadow-[#436be0]/30' 
                      : index < activeService
                        ? 'bg-[#436be0]/20 text-[#436be0] border border-[#436be0]/30'
                        : 'bg-white/5 text-white/30 border border-white/10 group-hover:border-white/20'
                    }
                  `}>
                    <span className="text-xl font-bold">{service.number}</span>
                  </div>
                  
                  {/* Label */}
                  <span className={`
                    mt-4 text-sm font-medium transition-colors duration-300 text-center whitespace-nowrap
                    ${index === activeService ? 'text-white' : 'text-white/40 group-hover:text-white/60'}
                  `}>
                    {service.shortLabel}
                  </span>

                  {/* Arrow connector */}
                  {index < 3 && (
                    <div className={`absolute top-8 left-full w-[calc(100%-4rem)] flex items-center justify-center pointer-events-none
                      ${index < activeService ? 'text-[#436be0]' : 'text-white/10'}
                    `}>
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Active Service Detail Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
              className="bg-gradient-to-br from-[#1A1A1A] to-[#151515] rounded-[2rem] p-10 md:p-14 border border-white/5"
            >
              <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Left: Content */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-[#436be0]/10 border border-[#436be0]/20 flex items-center justify-center text-[#436be0]">
                      {serviceBlocks[activeService].icon}
                    </div>
                    <div>
                      <span className="text-[#436be0] text-xs tracking-[0.2em] uppercase font-medium">
                        Fase {serviceBlocks[activeService].number}
                      </span>
                      <h3 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
                        {serviceBlocks[activeService].title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-lg leading-relaxed mb-8">
                    {serviceBlocks[activeService].intro}
                  </p>
                  
                  <Link 
                    to={`/servicios/${serviceBlocks[activeService].slug}`}
                    className="inline-flex items-center gap-2 text-[#436be0] hover:text-white transition-colors group/link"
                  >
                    <span className="text-sm font-medium">Explorar servicio</span>
                    <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Right: Points & Result */}
                <div>
                  <div className="space-y-4 mb-8">
                    {serviceBlocks[activeService].points.map((point, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
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
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Resultado</p>
                    <p className="text-white font-medium">
                      {serviceBlocks[activeService].result}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile/Tablet: Vertical Timeline */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#436be0] via-[#436be0]/50 to-white/10" />

            {/* Service Cards */}
            <div className="space-y-8">
              {serviceBlocks.map((service, index) => (
                <motion.div
                  key={service.number}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.15, ease: easeOutExpo }}
                  className="relative pl-16"
                >
                  {/* Node on timeline */}
                  <div className={`
                    absolute left-0 w-12 h-12 rounded-xl flex items-center justify-center
                    ${index === 0 
                      ? 'bg-[#436be0] text-white' 
                      : 'bg-[#1A1A1A] border border-white/10 text-white/60'
                    }
                  `}>
                    <span className="text-lg font-bold">{service.number}</span>
                  </div>

                  {/* Card */}
                  <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#436be0]/10 flex items-center justify-center text-[#436be0]">
                        {service.icon}
                      </div>
                      <h3 className="text-white text-xl font-bold tracking-tight">
                        {service.title}
                      </h3>
                    </div>
                    
                    <p className="text-white/60 text-sm leading-relaxed mb-4">
                      {service.intro}
                    </p>

                    {/* Collapsible Points */}
                    <ul className="space-y-2 mb-4">
                      {service.points.slice(0, 2).map((point, i) => (
                        <li key={i} className="text-white/50 text-xs leading-relaxed flex items-start gap-2">
                          <span className="text-[#436be0] mt-0.5">→</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Result */}
                    <div className="bg-white/5 rounded-lg px-4 py-3">
                      <p className="text-white text-xs font-medium">
                        {service.result}
                      </p>
                    </div>

                    {/* Arrow to next */}
                    {index < 3 && (
                      <div className="absolute -bottom-4 left-6 -translate-x-1/2 w-6 h-6 bg-[#0F0F0F] rounded-full flex items-center justify-center z-10">
                        <svg className="w-3 h-3 text-[#436be0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease: easeOutExpo }}
          className="text-center mt-16 md:mt-20"
        >
          <p className="text-white/40 text-sm mb-6">
            ¿Listo para comenzar tu transformación?
          </p>
          <MagneticButton 
            href="#contacto"
            className="bg-[#436be0] text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-[#5b7fe8] transition-all duration-500"
          >
            Agenda una consulta
          </MagneticButton>
        </motion.div>

      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function ContactSection() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const { t } = useTranslation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus('submitting')

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('https://formspree.io/f/mandzjzo', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })

      if (response.ok) {
        setFormStatus('success')
        form.reset()
      } else {
        setFormStatus('error')
      }
    } catch {
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
                  className="w-full bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#436be0] transition-colors"
                />
              </div>
              <div>
                <label className="text-[#6B6B6B] text-sm font-medium block mb-3">
                  {t('contact.form_message')}
                </label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="w-full bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#436be0] transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="w-full bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-[#436be0] hover:text-white transition-all duration-500 disabled:opacity-50"
              >
                {formStatus === 'submitting' ? t('contact.form_submitting') : t('contact.form_submit')}
              </button>
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
            <p className="text-white/50 text-sm leading-[1.7]">
              {t('footer.tagline')}
            </p>
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

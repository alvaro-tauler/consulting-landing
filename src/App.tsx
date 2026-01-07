import { useEffect, useRef, useState, createContext, useContext } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation, useNavigationType, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Lenis from 'lenis'
import Lottie from 'lottie-react'

// Lenis context for scroll control
const LenisContext = createContext<Lenis | null>(null)

// Import animations
import aiLettering from '../public/lettering-artificial-intelligence-with-robot-and-h-2025-11-05-04-40-43-utc.json'
import ideaAnim from '../public/idea-for-business-success-and-project-management-2025-11-05-06-06-57-utc.json'
import analyticsAnim from '../public/research-of-statistical-data-and-analytics-2025-11-05-06-06-57-utc.json'
import dashboardAnim from '../public/data-dashboard-with-infographics-and-statistics-2025-11-05-06-06-56-utc.json'
import financeAnim from '../public/artificial-intelligence-in-finance-management-2025-11-05-04-02-22-utc.json'
import cloudAnim from '../public/cloud-computing-and-virtualization-technology-2025-11-05-06-06-55-utc.json'

// Easing principal
const easeOutExpo = [0.16, 1, 0.3, 1] as const

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  const navType = useNavigationType()
  const lenis = useContext(LenisContext)
  
  useEffect(() => {
    // Always scroll to top on forward navigation (PUSH/REPLACE)
    if (navType !== 'POP') {
      // Use both methods for reliability
      window.scrollTo({ top: 0, behavior: 'instant' })
      if (lenis) {
        lenis.scrollTo(0, { immediate: true })
      }
    }
  }, [pathname, navType, lenis])
  
  return null
}

// Language Selector Component
function LanguageSelector() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  
  const currentLang = i18n.language === 'en' ? 'en' : 'es'
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setIsOpen(false)
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 text-[#060357]/60 hover:text-[#060357] transition-colors text-sm tracking-wide"
      >
        <span className="uppercase font-medium">{currentLang}</span>
        <svg 
          width="10" 
          height="10" 
          viewBox="0 0 10 10" 
          fill="none" 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-28 bg-white shadow-xl border border-[#060357]/5 py-2 z-50"
            >
              <button
                onClick={() => changeLanguage('es')}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-[#f5f3ef] transition-colors ${
                  currentLang === 'es' ? 'text-[#060357] font-medium' : 'text-[#060357]/60'
                }`}
              >
                Español
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-[#f5f3ef] transition-colors ${
                  currentLang === 'en' ? 'text-[#060357] font-medium' : 'text-[#060357]/60'
                }`}
              >
                English
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Service Detail Pages Data
function ServiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const animationMap: Record<string, object> = {
    'diagnostico': analyticsAnim,
    'roadmap': cloudAnim,
    'direccion': dashboardAnim,
    'executive-cto': financeAnim
  }

  if (!id || !animationMap[id]) return <div>{t('common.pageNotFound')}</div>

  const serviceKey = id === 'executive-cto' ? 'executive_cto' : id

  const renderContent = () => {
    switch (id) {
      case 'diagnostico':
        return (
          <>
            <p>{t('service_detail.diagnostico.p1')}</p>
            <p>{t('service_detail.diagnostico.p2')}</p>
            <p className="font-serif text-2xl md:text-3xl italic text-[#060357] py-8">{t('service_detail.diagnostico.axes_title')}</p>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="border-l-2 border-[#ff0000] pl-6 py-2">
                <h4 className="font-bold mb-2 uppercase tracking-widest text-xs opacity-40">{t('service_detail.diagnostico.axis1_title')}</h4>
                <p>{t('service_detail.diagnostico.axis1_desc')}</p>
              </div>
              <div className="border-l-2 border-[#ff0000] pl-6 py-2">
                <h4 className="font-bold mb-2 uppercase tracking-widest text-xs opacity-40">{t('service_detail.diagnostico.axis2_title')}</h4>
                <p>{t('service_detail.diagnostico.axis2_desc')}</p>
              </div>
              <div className="border-l-2 border-[#ff0000] pl-6 py-2">
                <h4 className="font-bold mb-2 uppercase tracking-widest text-xs opacity-40">{t('service_detail.diagnostico.axis3_title')}</h4>
                <p>{t('service_detail.diagnostico.axis3_desc')}</p>
              </div>
              <div className="border-l-2 border-[#ff0000] pl-6 py-2">
                <h4 className="font-bold mb-2 uppercase tracking-widest text-xs opacity-40">{t('service_detail.diagnostico.axis4_title')}</h4>
                <p>{t('service_detail.diagnostico.axis4_desc')}</p>
              </div>
            </div>
            <p>{t('service_detail.diagnostico.p3')}</p>
            <p>{t('service_detail.diagnostico.p4')}</p>
            <ul className="space-y-4 my-8">
              <li className="flex items-start gap-4"><span className="text-[#ff0000] font-serif">—</span> {t('service_detail.diagnostico.q1')}</li>
              <li className="flex items-start gap-4"><span className="text-[#ff0000] font-serif">—</span> {t('service_detail.diagnostico.q2')}</li>
              <li className="flex items-start gap-4"><span className="text-[#ff0000] font-serif">—</span> {t('service_detail.diagnostico.q3')}</li>
              <li className="flex items-start gap-4"><span className="text-[#ff0000] font-serif">—</span> {t('service_detail.diagnostico.q4')}</li>
            </ul>
            <div className="bg-[#060357] text-white p-10 md:p-16 my-16 rounded-sm">
              <h4 className="font-serif text-2xl md:text-3xl mb-8 italic">{t('service_detail.diagnostico.result_title')}</h4>
              <ul className="space-y-4 opacity-80">
                <li>• {t('service_detail.diagnostico.result1')}</li>
                <li>• {t('service_detail.diagnostico.result2')}</li>
                <li>• {t('service_detail.diagnostico.result3')}</li>
              </ul>
            </div>
            <p className="font-serif text-3xl md:text-4xl text-center py-12 italic">{t('service_detail.diagnostico.conclusion')}</p>
          </>
        )
      case 'roadmap':
        return (
          <>
            <p>{t('service_detail.roadmap.p1')}</p>
            <p>{t('service_detail.roadmap.p2')}</p>
            <p className="font-serif text-2xl md:text-3xl italic text-[#060357] py-8 text-center">{t('service_detail.roadmap.questions_title')}</p>
            <div className="grid md:grid-cols-2 gap-12 my-12">
              <ul className="space-y-6">
                <li className="flex items-start gap-4"><span className="text-[#ff0000] font-serif">—</span> {t('service_detail.roadmap.q1')}</li>
                <li className="flex items-start gap-4"><span className="text-[#ff0000] font-serif">—</span> {t('service_detail.roadmap.q2')}</li>
              </ul>
              <ul className="space-y-6">
                <li className="flex items-start gap-4"><span className="text-[#ff0000] font-serif">—</span> {t('service_detail.roadmap.q3')}</li>
                <li className="flex items-start gap-4"><span className="text-[#ff0000] font-serif">—</span> {t('service_detail.roadmap.q4')}</li>
              </ul>
            </div>
            <p className="font-serif text-2xl md:text-3xl italic text-[#060357] py-8">{t('service_detail.roadmap.priority_title')}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                t('service_detail.roadmap.priority1'),
                t('service_detail.roadmap.priority2'),
                t('service_detail.roadmap.priority3'),
                t('service_detail.roadmap.priority4')
              ].map(item => (
                <div key={item} className="border border-[#060357]/10 p-6 text-center flex items-center justify-center min-h-[120px]">
                  <span className="text-sm font-bold uppercase tracking-widest opacity-60 leading-tight">{item}</span>
                </div>
              ))}
            </div>
            <p>{t('service_detail.roadmap.p3')}</p>
            <p>{t('service_detail.roadmap.p4')}</p>
          </>
        )
      case 'direccion':
        return (
          <>
            <p>{t('service_detail.direccion.p1')}</p>
            <p>{t('service_detail.direccion.p2')}</p>
            <div className="bg-[#f5f3ef] border border-[#060357]/10 p-10 md:p-16 my-16">
              <h4 className="font-serif text-2xl md:text-3xl mb-10 italic">{t('service_detail.direccion.function_title')}</h4>
              <ul className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                <li className="flex gap-4 items-center">
                  <span className="w-8 h-px bg-[#ff0000]"></span>
                  <span>{t('service_detail.direccion.function1')}</span>
                </li>
                <li className="flex gap-4 items-center">
                  <span className="w-8 h-px bg-[#ff0000]"></span>
                  <span>{t('service_detail.direccion.function2')}</span>
                </li>
                <li className="flex gap-4 items-center">
                  <span className="w-8 h-px bg-[#ff0000]"></span>
                  <span>{t('service_detail.direccion.function3')}</span>
                </li>
                <li className="flex gap-4 items-center">
                  <span className="w-8 h-px bg-[#ff0000]"></span>
                  <span>{t('service_detail.direccion.function4')}</span>
                </li>
              </ul>
            </div>
            <p className="text-center font-bold uppercase tracking-widest text-xs opacity-40 mb-8">{t('service_detail.direccion.layer_intro')}</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-12 mb-16">
              {[
                t('service_detail.direccion.layer1'),
                t('service_detail.direccion.layer2'),
                t('service_detail.direccion.layer3'),
                t('service_detail.direccion.layer4')
              ].map(item => (
                <span key={item} className="font-serif text-2xl italic">{item}</span>
              ))}
            </div>
            <p>{t('service_detail.direccion.p3')}</p>
            <p>{t('service_detail.direccion.p4')}</p>
            <p className="font-serif text-2xl md:text-3xl text-[#060357] py-8">{t('service_detail.direccion.conclusion')}</p>
          </>
        )
      case 'executive-cto':
        return (
          <>
            <p>{t('service_detail.executive_cto.p1')}</p>
            <p>{t('service_detail.executive_cto.p2')}</p>
            <h4 className="font-bold text-center uppercase tracking-[0.3em] text-[10px] opacity-40 my-12">{t('service_detail.executive_cto.perspectives_title')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#060357]/10 border border-[#060357]/10 mb-16">
              {[
                { t: t('service_detail.executive_cto.perspective1_title'), d: t('service_detail.executive_cto.perspective1_desc') },
                { t: t('service_detail.executive_cto.perspective2_title'), d: t('service_detail.executive_cto.perspective2_desc') },
                { t: t('service_detail.executive_cto.perspective3_title'), d: t('service_detail.executive_cto.perspective3_desc') },
                { t: t('service_detail.executive_cto.perspective4_title'), d: t('service_detail.executive_cto.perspective4_desc') }
              ].map(item => (
                <div key={item.t} className="bg-white p-8 space-y-4">
                  <h5 className="font-serif text-xl italic">{item.t}</h5>
                  <p className="text-sm opacity-60 leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
            <p className="font-serif text-2xl md:text-3xl italic text-[#060357] py-8">{t('service_detail.executive_cto.participation_title')}</p>
            <ul className="space-y-4 mb-16">
              <li className="flex gap-4 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff0000]"></span>
                <span>{t('service_detail.executive_cto.participation1')}</span>
              </li>
              <li className="flex gap-4 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff0000]"></span>
                <span>{t('service_detail.executive_cto.participation2')}</span>
              </li>
              <li className="flex gap-4 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff0000]"></span>
                <span>{t('service_detail.executive_cto.participation3')}</span>
              </li>
              <li className="flex gap-4 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff0000]"></span>
                <span>{t('service_detail.executive_cto.participation4')}</span>
              </li>
            </ul>
            <p className="text-center md:text-left font-serif text-3xl md:text-4xl italic leading-tight">{t('service_detail.executive_cto.conclusion')}</p>
          </>
        )
      default:
        return null
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#f5f3ef] min-h-screen pt-32 pb-24 relative overflow-hidden"
    >
      <SubtleBlur />
      
      {/* Background Large Animation - Subtle watermark effect */}
      <div className="absolute top-0 right-[-10%] w-[60%] h-[60%] opacity-[0.03] pointer-events-none z-0">
        <Lottie animationData={animationMap[id]} loop={true} />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-[#060357]/40 hover:text-[#060357] transition-colors mb-20 group cursor-pointer"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-xs uppercase tracking-widest font-bold">{t('service_detail.back')}</span>
        </button>

        {/* Hero Section - Pure Typography & Symbol */}
        <header className="mb-24 lg:mb-40">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-9">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: easeOutExpo }}
                className="font-serif text-[#060357] text-[clamp(3rem,10vw,8rem)] leading-[0.85] tracking-tighter mb-12 text-balance"
              >
                {t(`service_detail.${serviceKey}.title`)}
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: easeOutExpo }}
                className="font-serif text-3xl md:text-5xl italic text-[#060357]/60 leading-[1.1] max-w-4xl"
              >
                {t(`service_detail.${serviceKey}.subtitle`)}
              </motion.p>
            </div>
            <div className="lg:col-span-3 flex justify-center lg:justify-end">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: easeOutExpo }}
                className="w-40 h-40 md:w-64 md:h-64 opacity-90 mix-blend-multiply"
              >
                <Lottie animationData={animationMap[id]} loop={true} />
              </motion.div>
            </div>
          </div>
        </header>

        {/* Main Content Flow - Centered and Impeccable */}
        <div className="grid lg:grid-cols-12 gap-12">
          <article className="lg:col-span-8 lg:col-start-3">
            <div className="prose prose-2xl prose-indigo text-[#060357] max-w-none">
              <div className="content-render space-y-16">
                {renderContent()}
              </div>
            </div>

            {/* CTA Section - Minimalist & Powerful */}
            <footer className="mt-40 pt-24 border-t border-[#060357]/10">
              <div className="flex flex-col items-center text-center space-y-12">
                <h3 className="font-serif text-4xl md:text-7xl text-[#060357] leading-[1] text-balance tracking-tighter italic">
                  {t('service_detail.cta_title')}
                </h3>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a 
                    href="/#contacto"
                    className="inline-block bg-[#060357] text-[#f5f3ef] px-20 py-7 text-xs tracking-[0.4em] uppercase hover:bg-[#ff0000] transition-all duration-500 shadow-2xl shadow-[#060357]/20 font-bold"
                  >
                    {t('service_detail.cta_button')}
                  </a>
                </motion.div>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </motion.div>
  )
}

// Legal Pages
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

  const renderLegalContent = () => {
    switch (id) {
      case 'privacy':
        return (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4">{t('legal.privacy.section1_title')}</h2>
              <p>{t('legal.privacy.section1_content1')}</p>
              <p>{t('legal.privacy.section1_content2')}</p>
              <p>{t('legal.privacy.section1_content3')}</p>
              <p>{t('legal.privacy.section1_content4')}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-4">{t('legal.privacy.section2_title')}</h2>
              <p>{t('legal.privacy.section2_intro')}</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>{t('legal.privacy.section2_item1')}</li>
                <li>{t('legal.privacy.section2_item2')}</li>
                <li>{t('legal.privacy.section2_item3')}</li>
                <li>{t('legal.privacy.section2_item4')}</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-4">{t('legal.privacy.section3_title')}</h2>
              <p>{t('legal.privacy.section3_intro')}</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>{t('legal.privacy.section3_item1')}</li>
                <li>{t('legal.privacy.section3_item2')}</li>
                <li>{t('legal.privacy.section3_item3')}</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-4">{t('legal.privacy.section4_title')}</h2>
              <p>{t('legal.privacy.section4_content')}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-4">{t('legal.privacy.section5_title')}</h2>
              <p>{t('legal.privacy.section5_content')}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-4">{t('legal.privacy.section6_title')}</h2>
              <p>{t('legal.privacy.section6_content')}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-4">{t('legal.privacy.section7_title')}</h2>
              <p>{t('legal.privacy.section7_content')}</p>
            </section>
          </div>
        )
      case 'cookies':
        return (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4">{t('legal.cookies.section1_title')}</h2>
              <p>{t('legal.cookies.section1_content')}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-4">{t('legal.cookies.section2_title')}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold">{t('legal.cookies.section2_type1_title')}</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{t('legal.cookies.section2_type1_item1')}</li>
                    <li>{t('legal.cookies.section2_type1_item2')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold">{t('legal.cookies.section2_type2_title')}</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{t('legal.cookies.section2_type2_item1')}</li>
                    <li>{t('legal.cookies.section2_type2_item2')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold">{t('legal.cookies.section2_type3_title')}</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{t('legal.cookies.section2_type3_item1')}</li>
                    <li>{t('legal.cookies.section2_type3_item2')}</li>
                  </ul>
                </div>
              </div>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-4">{t('legal.cookies.section3_title')}</h2>
              <p>{t('legal.cookies.section3_content1')}</p>
              <p className="mt-4">{t('legal.cookies.section3_content2')}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-4">{t('legal.cookies.section4_title')}</h2>
              <p>{t('legal.cookies.section4_content')}</p>
            </section>
          </div>
        )
      case 'legal':
        return (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4">{t('legal.legal_notice.section1_title')}</h2>
              <p>{t('legal.legal_notice.section1_content1')}</p>
              <p>{t('legal.legal_notice.section1_content2')}</p>
              <p>{t('legal.legal_notice.section1_content3')}</p>
              <p>{t('legal.legal_notice.section1_content4')}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-4">{t('legal.legal_notice.section2_title')}</h2>
              <p>{t('legal.legal_notice.section2_content')}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-4">{t('legal.legal_notice.section3_title')}</h2>
              <p>{t('legal.legal_notice.section3_content1')}</p>
              <p className="mt-4">{t('legal.legal_notice.section3_content2')}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-4">{t('legal.legal_notice.section4_title')}</h2>
              <p>{t('legal.legal_notice.section4_content1')}</p>
              <p className="mt-4">{t('legal.legal_notice.section4_content2')}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-4">{t('legal.legal_notice.section5_title')}</h2>
              <p>{t('legal.legal_notice.section5_content1')}</p>
              <p className="mt-4">{t('legal.legal_notice.section5_content2')}</p>
            </section>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#f5f3ef] min-h-screen pt-40 pb-24"
    >
      <SubtleBlur />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-[#060357]/40 hover:text-[#060357] transition-colors mb-12 group cursor-pointer"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-xs uppercase tracking-widest font-bold">{t('legal.back')}</span>
        </button>
        
        <header className="mb-16">
          <h1 className="font-serif text-[#060357] text-4xl md:text-6xl mb-4 italic">
            {titleMap[id]}
          </h1>
          <p className="text-[#060357]/40 text-sm uppercase tracking-widest">
            {t('legal.last_updated')}: 15/09/2025
          </p>
        </header>

        <div className="prose prose-lg max-w-none text-[#060357]/80 leading-relaxed">
          {renderLegalContent()}
        </div>
      </div>
    </motion.div>
  )
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: easeOutExpo }
  }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: easeOutExpo }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
}

// Navbar Component
function Navbar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
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
    { label: t('nav.services'), href: isHome ? '#servicios' : '/#servicios', hasDropdown: true },
    { label: t('nav.contact'), href: isHome ? '#contacto' : '/#contacto' }
  ]

  const services = [
    { label: t('services_menu.diagnostico'), href: '/servicios/diagnostico' },
    { label: t('services_menu.roadmap'), href: '/servicios/roadmap' },
    { label: t('services_menu.direccion'), href: '/servicios/direccion' },
    { label: t('services_menu.executive_cto'), href: '/servicios/executive-cto' }
  ]

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-4 bg-[#f5f3ef]/90 backdrop-blur-md'
          : 'py-6'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: easeOutExpo }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center"
        >
          <img 
            src="/logo tauler.png" 
            alt="Tauler Group Logo" 
            className="h-8 md:h-10 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(link => (
            <div 
              key={link.label}
              className="relative group"
              onMouseEnter={() => link.hasDropdown && setIsServicesOpen(true)}
              onMouseLeave={() => link.hasDropdown && setIsServicesOpen(false)}
            >
              <a 
                href={link.href} 
                className="text-[#060357]/60 hover:text-[#060357] transition-colors text-sm tracking-wide py-2 flex items-center gap-1"
              >
                {link.label}
                {link.hasDropdown && (
                  <svg 
                    width="10" 
                    height="10" 
                    viewBox="0 0 10 10" 
                    fill="none" 
                    className={`transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </a>

              {link.hasDropdown && (
                <AnimatePresence>
                  {isServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-64 bg-white shadow-xl border border-[#060357]/5 py-4 z-50"
                    >
                      {services.map(service => (
                        <Link
                          key={service.href}
                          to={service.href}
                          className="block px-6 py-3 text-sm text-[#060357]/60 hover:text-[#060357] hover:bg-[#f5f3ef] transition-colors"
                          onClick={() => setIsServicesOpen(false)}
                        >
                          {service.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
          
          <LanguageSelector />
        </div>

        <div className="md:hidden flex items-center gap-4">
          <LanguageSelector />
          <button
            onClick={onMenuOpen}
            className="flex flex-col gap-1.5 p-2"
            aria-label={t('nav.openMenu')}
          >
            <span className="block w-6 h-[1.5px] bg-[#060357]"></span>
            <span className="block w-6 h-[1.5px] bg-[#060357]"></span>
          </button>
        </div>
      </div>
    </motion.nav>
  )
}

// Mobile Menu Component
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const { t } = useTranslation()

  const navLinks = [
    { label: t('nav.about'), href: isHome ? '#about' : '/#about' },
    { label: t('nav.services'), href: isHome ? '#servicios' : '/#servicios', hasDropdown: true },
    { label: t('nav.contact'), href: isHome ? '#contacto' : '/#contacto' }
  ]

  const services = [
    { label: t('services_menu.diagnostico'), href: '/servicios/diagnostico' },
    { label: t('services_menu.roadmap'), href: '/servicios/roadmap' },
    { label: t('services_menu.direccion'), href: '/servicios/direccion' },
    { label: t('services_menu.executive_cto'), href: '/servicios/executive-cto' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#060357]/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#f5f3ef] z-50 p-8 flex flex-col overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="self-end p-2 text-[#060357]/60 hover:text-[#060357] transition-colors"
              aria-label={t('nav.closeMenu')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="mt-8 mb-16">
              <Link to="/" onClick={onClose}>
                <img 
                  src="/logo tauler.png" 
                  alt="Tauler Group Logo" 
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            <nav className="flex flex-col gap-6">
              {navLinks.map((item, index) => (
                <div key={item.label} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <motion.a
                      href={item.href}
                      onClick={(e) => {
                        if (item.hasDropdown) {
                          e.preventDefault()
                          setIsServicesOpen(!isServicesOpen)
                        } else {
                          onClose()
                        }
                      }}
                      className="font-serif text-4xl text-[#060357]/80 hover:text-[#060357] transition-colors flex items-center gap-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      {item.label}
                      {item.hasDropdown && (
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 10 10" 
                          fill="none" 
                          className={`transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`}
                        >
                          <path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </motion.a>
                  </div>

                  {item.hasDropdown && (
                    <AnimatePresence>
                      {isServicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="flex flex-col gap-4 pl-4 overflow-hidden"
                        >
                          {services.map(service => (
                            <Link
                              key={service.href}
                              to={service.href}
                              onClick={onClose}
                              className="text-[#060357]/60 text-xl font-serif italic hover:text-[#060357]"
                            >
                              {service.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            <motion.a
              href={isHome ? '#contacto' : '/#contacto'}
              onClick={onClose}
              className="mt-12 border border-[#060357]/20 text-[#060357] py-4 text-center hover:bg-[#060357] hover:text-[#f5f3ef] transition-all text-sm tracking-wide font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {t('nav.letsTalk')}
            </motion.a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Subtle Background Animation for cream sections
function SubtleBlur() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.3, 1],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ backgroundColor: '#3b82f6' }}
        className="absolute top-[-15%] left-[5%] w-[45%] h-[45%] rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          opacity: [0.15, 0.35, 0.15],
          scale: [1.3, 1, 1.3],
          x: [0, -50, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{ backgroundColor: '#2563eb' }}
        className="absolute bottom-[-20%] right-[0%] w-[55%] h-[55%] rounded-full blur-[140px]"
      />
      <motion.div
        animate={{
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        style={{ backgroundColor: '#60a5fa' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[30%] rounded-full blur-[120px]"
      />
    </div>
  )
}

// Hero Section
function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  const { t } = useTranslation()
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={ref}
      className="min-h-screen bg-[#f5f3ef] flex flex-col items-center justify-center relative overflow-hidden pt-24 pb-12"
    >
      <SubtleBlur />
      
      {/* Background Large Animation - Subtle watermark effect like in detail pages */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] opacity-[0.03] pointer-events-none z-0">
        <Lottie animationData={aiLettering} loop={true} />
      </div>
      
      <motion.div 
        className="relative z-10 text-center px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[70vh]"
        style={{ y, opacity }}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full flex flex-col items-center"
        >
          {/* Main Headline - Significant scale for maximum impact */}
          <motion.h1
            variants={fadeInUp}
            className="font-serif text-[#060357] text-[clamp(3.5rem,10vw,11rem)] leading-[0.85] tracking-tighter mb-12 text-balance"
          >
            {t('hero.title1')}
            <br />
            <span className="italic font-medium text-[#060357]/80">{t('hero.title2')}</span>
          </motion.h1>

          <div className="flex flex-col items-center space-y-12 w-full">
            {/* Subtitle - More prominent and elegant */}
            <motion.p
              variants={fadeInUp}
              className="text-[#060357] text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto leading-tight font-serif italic px-4 opacity-70"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* CTA - Solid presence */}
            <motion.div variants={fadeInUp} className="pt-8">
              <a 
                href="#contacto"
                className="inline-block bg-[#060357] text-[#f5f3ef] px-14 py-6 text-xs tracking-[0.3em] uppercase hover:bg-[#ff0000] transition-all duration-500 shadow-2xl shadow-[#060357]/20 font-bold"
              >
                {t('hero.cta')}
              </a>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

// About Section
function AboutSection() {
  const { t } = useTranslation()

  return (
    <section className="bg-[#f5f3ef] py-24 md:py-32 relative overflow-hidden" id="about">
      <SubtleBlur />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Left - Content */}
          <motion.div variants={fadeInUp} className="lg:col-span-8 space-y-12">
            <div>
              <span className="text-[#060357]/40 text-xs tracking-widest uppercase block mb-8">
                {t('about.label')}
              </span>
              <h2 className="font-serif text-[#060357] text-3xl md:text-5xl lg:text-7xl leading-[1.1] tracking-tight">
                {t('about.title1')}
                <br />
                <span className="italic font-medium text-[#060357]/80">{t('about.title2')}</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-6">
                <p className="text-[#060357]/80 text-lg leading-relaxed font-medium">
                  {t('about.intro')}
                </p>
                <ul className="space-y-3 text-[#060357]/70 text-base">
                  <li className="flex gap-3">
                    <span className="text-[#060357]/30">—</span>
                    <span>{t('about.point1')}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#060357]/30">—</span>
                    <span>{t('about.point2')}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#060357]/30">—</span>
                    <span>{t('about.point3')}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#060357]/30">—</span>
                    <span>{t('about.point4')}</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-6">
                <p className="text-[#060357]/70 text-base leading-relaxed">
                  {t('about.description1')}
                </p>
                <p className="text-[#060357]/70 text-base leading-relaxed">
                  {t('about.description2')}
                </p>
                <div className="pt-4">
                  <a href="#servicios" className="group flex items-center gap-3 text-[#060357] font-medium tracking-wide text-sm">
                    {t('about.link')}
                    <span className="w-8 h-[1px] bg-[#060357] group-hover:w-12 transition-all duration-300"></span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Animation */}
          <motion.div 
            variants={fadeIn} 
            className="lg:col-span-4 flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-[320px] aspect-square p-4">
              <Lottie animationData={ideaAnim} loop={true} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// What We Do / Don't Do Section
function ApproachSection() {
  const [mousePos1, setMousePos1] = useState({ x: 0, y: 0 })
  const [mousePos2, setMousePos2] = useState({ x: 0, y: 0 })
  const { t } = useTranslation()

  const handleMouseMove1 = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos1({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleMouseMove2 = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos2({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <section className="bg-[#060357] py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          className="mb-16 flex flex-col lg:flex-row justify-between items-end gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div>
            <span className="text-white/40 text-xs tracking-widest uppercase mb-6 block">
              {t('approach.label')}
            </span>
            <h2 className="font-serif text-white text-4xl md:text-5xl lg:text-7xl tracking-tight leading-none">
              {t('approach.title')}<span className="text-[#ff0000]">.</span>
            </h2>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-px bg-white/10 border border-white/10">
          {/* No hacemos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onMouseMove={handleMouseMove1}
            className="bg-[#060357] p-10 md:p-16 relative overflow-hidden group"
          >
            {/* Glare effect */}
            <div 
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
              style={{
                background: `radial-gradient(600px circle at ${mousePos1.x}px ${mousePos1.y}px, rgba(255,255,255,0.08), transparent 80%)`
              }}
            />
            
            <div className="relative z-10">
              <h3 className="text-white/30 font-serif text-2xl md:text-3xl mb-10 italic">{t('approach.dont_title')}</h3>
              <ul className="space-y-8">
                {[
                  { title: t('approach.dont.item1_title'), desc: t('approach.dont.item1_desc') },
                  { title: t('approach.dont.item2_title'), desc: t('approach.dont.item2_desc') },
                  { title: t('approach.dont.item3_title'), desc: t('approach.dont.item3_desc') },
                  { title: t('approach.dont.item4_title'), desc: t('approach.dont.item4_desc') }
                ].map((item, index) => (
                  <li key={index} className="space-y-1">
                    <h4 className="text-white text-lg font-medium">{item.title}</h4>
                    <p className="text-white/40 text-base leading-relaxed">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Sí hacemos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onMouseMove={handleMouseMove2}
            className="bg-[#0b077a] p-10 md:p-16 relative overflow-hidden group"
          >
            {/* Glare effect */}
            <div 
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
              style={{
                background: `radial-gradient(600px circle at ${mousePos2.x}px ${mousePos2.y}px, rgba(255,255,255,0.1), transparent 80%)`
              }}
            />

            <div className="relative z-10">
              <h3 className="text-white font-serif text-2xl md:text-3xl mb-10 italic">{t('approach.do_title')}</h3>
              <ul className="space-y-8">
                {[
                  { title: t('approach.do.item1_title'), desc: t('approach.do.item1_desc') },
                  { title: t('approach.do.item2_title'), desc: t('approach.do.item2_desc') },
                  { title: t('approach.do.item3_title'), desc: t('approach.do.item3_desc') },
                  { title: t('approach.do.item4_title'), desc: t('approach.do.item4_desc') }
                ].map((item, index) => (
                  <li key={index} className="space-y-1">
                    <h4 className="text-white text-lg font-medium">{item.title}</h4>
                    <p className="text-white/70 text-base leading-relaxed">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Services Section
function ServicesSection() {
  const { t } = useTranslation()
  
  const services = [
    {
      number: t('services_section.service1.number'),
      slug: 'diagnostico',
      title: t('services_section.service1.title'),
      animation: analyticsAnim,
      content: (
        <div className="space-y-6">
          <p className="text-[#060357]/80 font-medium">{t('services_section.service1.intro')}</p>
          <ul className="space-y-2 text-[#060357]/60">
            <li className="flex gap-2"><span>—</span> {t('services_section.service1.point1')}</li>
            <li className="flex gap-2"><span>—</span> {t('services_section.service1.point2')}</li>
            <li className="flex gap-2"><span>—</span> {t('services_section.service1.point3')}</li>
            <li className="flex gap-2"><span>—</span> {t('services_section.service1.point4')}</li>
          </ul>
          <p className="pt-4 text-[#060357] italic">{t('services_section.service1.result')}</p>
        </div>
      ),
    },
    {
      number: t('services_section.service2.number'),
      slug: 'roadmap',
      title: t('services_section.service2.title'),
      animation: cloudAnim,
      content: (
        <div className="space-y-6">
          <p className="text-[#060357]/80 font-medium">{t('services_section.service2.intro')}</p>
          <ul className="space-y-2 text-[#060357]/60">
            <li className="flex gap-2"><span>—</span> {t('services_section.service2.point1')}</li>
            <li className="flex gap-2"><span>—</span> {t('services_section.service2.point2')}</li>
            <li className="flex gap-2"><span>—</span> {t('services_section.service2.point3')}</li>
            <li className="flex gap-2"><span>—</span> {t('services_section.service2.point4')}</li>
          </ul>
          <p className="pt-4 text-[#060357] font-medium leading-tight">{t('services_section.service2.result')}</p>
        </div>
      ),
    },
    {
      number: t('services_section.service3.number'),
      slug: 'direccion',
      title: t('services_section.service3.title'),
      animation: dashboardAnim,
      content: (
        <div className="space-y-6">
          <p className="text-[#060357]/70">{t('services_section.service3.intro')}</p>
          <ul className="space-y-2 text-[#060357]/60">
            <li className="flex gap-2"><span>—</span> {t('services_section.service3.point1')}</li>
            <li className="flex gap-2"><span>—</span> {t('services_section.service3.point2')}</li>
            <li className="flex gap-2"><span>—</span> {t('services_section.service3.point3')}</li>
            <li className="flex gap-2"><span>—</span> {t('services_section.service3.point4')}</li>
            <li className="flex gap-2"><span>—</span> {t('services_section.service3.point5')}</li>
          </ul>
          <p className="pt-4 text-[#060357]/80">{t('services_section.service3.result')}</p>
        </div>
      ),
    },
    {
      number: t('services_section.service4.number'),
      slug: 'executive-cto',
      title: t('services_section.service4.title'),
      animation: financeAnim,
      content: (
        <div className="space-y-6">
          <p className="text-[#060357] italic font-medium">{t('services_section.service4.intro')}</p>
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-[#060357]/40 font-bold">{t('services_section.service4.designed_for')}</p>
            <ul className="text-[#060357]/60">
              <li>• {t('services_section.service4.target1')}</li>
              <li>• {t('services_section.service4.target2')}</li>
              <li>• {t('services_section.service4.target3')}</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-[#060357]/40 font-bold">{t('services_section.service4.we_provide')}</p>
            <ul className="space-y-1 text-[#060357]/60">
              <li className="flex gap-2"><span>—</span> {t('services_section.service4.provide1')}</li>
              <li className="flex gap-2"><span>—</span> {t('services_section.service4.provide2')}</li>
              <li className="flex gap-2"><span>—</span> {t('services_section.service4.provide3')}</li>
              <li className="flex gap-2"><span>—</span> {t('services_section.service4.provide4')}</li>
              <li className="flex gap-2"><span>—</span> {t('services_section.service4.provide5')}</li>
            </ul>
          </div>
          <p className="pt-4 text-[#060357] font-medium leading-tight">{t('services_section.service4.result')}</p>
        </div>
      ),
    }
  ]

  return (
    <section className="bg-[#f5f3ef] py-24 md:py-32 border-y border-[#060357]/5 relative overflow-hidden" id="servicios">
      <SubtleBlur />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          className="grid lg:grid-cols-12 gap-12 lg:gap-20 mb-16 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="lg:col-span-3">
            <span className="text-[#060357]/40 text-xs tracking-widest uppercase block">
              {t('services_section.label')}
            </span>
          </div>
          <div className="lg:col-span-9">
            <h2 className="font-serif text-[#060357] text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[1.2]">
              {t('services_section.title1')}
              <br />
              <span className="italic font-medium text-[#060357]/80">{t('services_section.title2')}</span>
            </h2>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col border-t border-[#060357]/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {services.map((service) => (
            <motion.div
              key={service.number}
              variants={fadeInUp}
              className="group border-b border-[#060357]/10 py-10 md:py-16 transition-all duration-500 relative"
            >
              <Link to={`/servicios/${service.slug}`} className="absolute inset-0 z-20" />
              <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-start relative z-10">
                {/* Left - Number & Animation Box (2/5) */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="flex justify-between items-start">
                    <span className="text-[#060357]/20 font-serif text-2xl md:text-3xl group-hover:text-[#060357] transition-colors duration-500 block">
                      {service.number}
                    </span>
                    <span className="text-[#060357]/0 group-hover:text-[#060357]/40 transition-colors duration-500 font-serif italic text-sm">{t('services_section.viewDetail')}</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-serif text-[#060357] text-xl md:text-5xl italic font-medium leading-tight">
                    {service.title}
                  </h3>

                  {/* Animation Box */}
                  <div className="w-full max-w-[320px] aspect-square flex items-center justify-center">
                    <div className="w-full h-full opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                      <Lottie animationData={service.animation} loop={true} />
                    </div>
                  </div>
                </div>
                
                {/* Right - Content (3/5) */}
                <div className="lg:col-span-3 lg:pt-24">
                  <div className="text-base md:text-lg leading-relaxed text-[#060357]/70">
                    {service.content}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Benefits Section (Old Quote Section)
function BenefitsSection() {
  const { t } = useTranslation()
  
  const benefits = [
    t('benefits.benefit1'),
    t('benefits.benefit2'),
    t('benefits.benefit3'),
    t('benefits.benefit4'),
    t('benefits.benefit5'),
    t('benefits.benefit6')
  ]

  return (
    <section className="bg-[#060357] py-20 md:py-24 relative overflow-hidden text-white">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="lg:col-span-5">
            <motion.span 
              variants={fadeIn}
              className="text-white/40 text-xs tracking-widest uppercase mb-6 block"
            >
              {t('benefits.label')}
            </motion.span>
            <motion.h2 
              variants={fadeInUp}
              className="font-serif text-3xl md:text-5xl lg:text-6xl leading-none tracking-tight italic font-medium"
            >
              {t('benefits.title1')}
              <br />
              {t('benefits.title2')}<span className="text-[#ff0000]">.</span>
            </motion.h2>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="space-y-4 md:space-y-6">
              {benefits.map((benefit, idx) => (
                <motion.li 
                  key={idx}
                  variants={fadeInUp}
                  className="flex items-center gap-4 group"
                >
                  <span className="w-6 h-px bg-white/20 group-hover:w-10 group-hover:bg-[#ff0000] transition-all duration-500"></span>
                  <p className="text-base md:text-lg lg:text-xl text-white/80 font-serif italic group-hover:text-white transition-colors duration-300">
                    {benefit}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Tauler Group Section
function TaulerGroupSection() {
  const { t } = useTranslation()

  return (
    <section className="bg-white py-12 md:py-16 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-col items-center text-center"
        >
          <motion.span 
            variants={fadeIn}
            className="text-[#060357]/40 text-[10px] tracking-[0.3em] uppercase mb-6 block font-bold"
          >
            {t('tauler_group.label')}
          </motion.span>
          
          <motion.h3 
            variants={fadeInUp}
            className="font-serif text-2xl md:text-3xl text-[#060357] italic mb-10 leading-tight max-w-4xl"
          >
            {t('tauler_group.title')}
          </motion.h3>
          
          <motion.div 
            variants={fadeInUp}
            className="mb-10"
          >
            <img 
              src="/logo tauler.png" 
              alt="Tauler Group" 
              className="h-16 md:h-20 lg:h-24 w-auto opacity-100"
            />
          </motion.div>
          
          <motion.a 
            href="https://taulergroup.com" 
            target="_blank" 
            rel="noopener noreferrer"
            variants={fadeInUp}
            className="group flex flex-col items-center gap-4"
          >
            <p className="text-[#060357] text-lg md:text-xl font-serif italic max-w-2xl mx-auto leading-relaxed group-hover:text-[#ff0000] transition-colors duration-500">
              {t('tauler_group.description')}
            </p>
            <div className="w-12 h-px bg-[#060357]/20 group-hover:w-24 group-hover:bg-[#ff0000] transition-all duration-700"></div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

// Contact Section
function ContactSection() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const { t } = useTranslation()

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
    <section className="bg-[#f5f3ef] py-24 md:py-32 relative overflow-hidden" id="contacto">
      <SubtleBlur />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-20 items-start">
          {/* Left */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <span className="text-[#060357]/40 text-xs tracking-widest uppercase mb-8 block">
              {t('contact.label')}
            </span>
            <h2 className="font-serif text-[#060357] text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none mb-10">
              {t('contact.title1')}
              <br />
              <span className="italic font-medium text-[#060357]/80">{t('contact.title2')}</span>
            </h2>
            <div className="space-y-8 text-[#060357]/70 text-lg leading-relaxed mb-12">
              <p>
                {t('contact.intro')}
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="w-6 h-px bg-[#060357]/20"></span>
                  <p className="text-sm uppercase tracking-wider font-medium">{t('contact.feature1')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-6 h-px bg-[#060357]/20"></span>
                  <p className="text-sm uppercase tracking-wider font-medium">{t('contact.feature2')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-6 h-px bg-[#060357]/20"></span>
                  <p className="text-sm uppercase tracking-wider font-medium">{t('contact.feature3')}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-10 border-t border-[#060357]/10">
              <p className="text-[#060357]/40 text-sm mb-2 italic">{t('contact.email_intro')}</p>
              <a href="mailto:info@taulergroup.com" className="text-2xl text-[#060357] font-serif italic hover:text-[#ff0000] transition-colors">
                info@taulergroup.com
              </a>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 lg:col-start-7 bg-white p-10 md:p-16 shadow-2xl shadow-black/[0.03]"
          >
            {formStatus === 'success' ? (
              <div className="py-20 text-center">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-serif text-6xl mb-6 text-[#060357]"
                >
                  ✓
                </motion.div>
                <h3 className="font-serif text-[#060357] text-3xl mb-4 italic font-medium">{t('contact.form_success_title')}</h3>
                <p className="text-[#060357]/60 text-lg">{t('contact.form_success_message')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#060357]/40 font-bold">{t('contact.form_name')}</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full bg-transparent border-b border-[#060357]/10 px-0 py-2 text-[#060357] focus:outline-none focus:border-[#060357] transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#060357]/40 font-bold">{t('contact.form_email')}</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full bg-transparent border-b border-[#060357]/10 px-0 py-2 text-[#060357] focus:outline-none focus:border-[#060357] transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#060357]/40 font-bold">{t('contact.form_company')}</label>
                  <input
                    type="text"
                    name="company"
                    className="w-full bg-transparent border-b border-[#060357]/10 px-0 py-2 text-[#060357] focus:outline-none focus:border-[#060357] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#060357]/40 font-bold">{t('contact.form_message')}</label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    className="w-full bg-transparent border-b border-[#060357]/10 px-0 py-2 text-[#060357] focus:outline-none focus:border-[#060357] transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-[#060357] text-white py-6 text-xs tracking-[0.3em] uppercase hover:bg-[#0b077a] transition-all duration-300 disabled:opacity-50 mt-10 font-bold"
                >
                  {formStatus === 'submitting' ? t('contact.form_submitting') : t('contact.form_submit')}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { t } = useTranslation()

  return (
    <footer className="bg-[#060357] pt-24 pb-12">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-5">
            <Link to="/">
              <img 
                src="/loto tauler white.png" 
                alt="Tauler Group Logo" 
                className="h-10 md:h-12 w-auto"
              />
            </Link>
            <p className="text-white/40 text-lg mt-8 leading-relaxed max-w-sm italic">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="md:col-span-2 md:col-start-8">
            <h5 className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-bold mb-8">{t('footer.navigation_label')}</h5>
            <div className="flex flex-col gap-4">
              <a href={isHome ? '#about' : '/#about'} className="text-white/60 hover:text-white transition-colors">{t('nav.about')}</a>
              <a href={isHome ? '#servicios' : '/#servicios'} className="text-white/60 hover:text-white transition-colors">{t('nav.services')}</a>
              <a href={isHome ? '#contacto' : '/#contacto'} className="text-white/60 hover:text-white transition-colors">{t('nav.contact')}</a>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <p className="text-white/20 text-xs tracking-widest uppercase">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
            <Link to="/legal/privacy" className="text-white/20 hover:text-white/40 text-xs tracking-widest uppercase transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/legal/cookies" className="text-white/20 hover:text-white/40 text-xs tracking-widest uppercase transition-colors">
              {t('footer.cookies')}
            </Link>
            <Link to="/legal/legal" className="text-white/20 hover:text-white/40 text-xs tracking-widest uppercase transition-colors">
              {t('footer.legal')}
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <a
              href="https://www.linkedin.com/company/tauler-group/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-all duration-300 p-2 border border-white/10 rounded-full"
              aria-label="LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Landing Page Component
function LandingPage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ApproachSection />
      <ServicesSection />
      <BenefitsSection />
      <TaulerGroupSection />
      <ContactSection />
    </main>
  )
}

// Main App Component
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null)

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
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
        <ScrollToTop />
        <Navbar onMenuOpen={() => setIsMenuOpen(true)} />
        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/servicios/:id" element={<ServiceDetailPage />} />
          <Route path="/legal/:id" element={<LegalPage />} />
        </Routes>
        
        <Footer />
      </LenisContext.Provider>
    </Router>
  )
}

export default App

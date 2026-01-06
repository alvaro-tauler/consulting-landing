import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'

// Easing principal
const easeOutExpo = [0.16, 1, 0.3, 1] as const

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOutExpo }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo }
  }
}

// Scroll Progress Bar Component
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-white/30 origin-left z-[9999]"
      style={{ scaleX }}
    />
  )
}

// Navbar Component
function Navbar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-4 bg-[#0a1628]/90 backdrop-blur-xl'
          : 'py-6'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: easeOutExpo }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <motion.a
          href="#"
          className="text-white font-bold text-xl tracking-tight"
        >
          tauler
        </motion.a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#problema" className="text-white/70 hover:text-white transition-colors text-sm">
            El problema
          </a>
          <a href="#servicios" className="text-white/70 hover:text-white transition-colors text-sm">
            Servicios
          </a>
          <a href="#contacto" className="text-white/70 hover:text-white transition-colors text-sm">
            Contacto
          </a>
          <a 
            href="#contacto" 
            className="border border-white/30 hover:bg-white hover:text-[#0a1628] text-white px-5 py-2.5 rounded-full text-sm transition-all duration-300"
          >
            Hablemos
          </a>
        </div>

        <button
          onClick={onMenuOpen}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Abrir menú"
        >
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </div>
    </motion.nav>
  )
}

// Mobile Menu Component
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            className="fixed top-0 right-0 bottom-0 w-80 bg-[#0a1628] z-50 p-8 flex flex-col"
          >
            <button
              onClick={onClose}
              className="self-end p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Cerrar menú"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="mt-8 mb-12">
              <span className="text-white font-bold text-xl">tauler</span>
            </div>

            <nav className="flex flex-col gap-6">
              {[
                { label: 'El problema', href: '#problema' },
                { label: 'Servicios', href: '#servicios' },
                { label: 'Contacto', href: '#contacto' }
              ].map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="text-2xl font-light text-white/80 hover:text-white transition-colors"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <motion.a
              href="#contacto"
              onClick={onClose}
              className="mt-auto border border-white/30 text-white py-4 rounded-full text-center hover:bg-white hover:text-[#0a1628] transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Hablemos
            </motion.a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hero Section
function HeroSection() {
  const ref = useRef(null)

  return (
    <section
      ref={ref}
      className="min-h-screen bg-[#2339E8] flex flex-col justify-center items-center px-6 pt-24 pb-16"
    >
      <motion.div
        className="max-w-5xl mx-auto text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Main Headline */}
        <motion.h1
          variants={fadeInUp}
          className="text-white text-5xl md:text-7xl lg:text-[90px] font-bold leading-[1.05] tracking-tight mb-8"
        >
          El problema no es
          <br />
          la IA.{' '}
          <span className="relative inline-block">
            <span className="relative z-10 italic">Es el criterio.</span>
            <span className="absolute inset-0 bg-[#0a1628] rounded-lg -skew-x-3 scale-105"></span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          className="text-white/80 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-16 leading-relaxed"
        >
          La mayoría de empresas no fracasan con la IA por falta de tecnología. 
          Fracasan porque nadie les dijo qué problema resolver primero, 
          ni si merecía la pena resolverlo.
        </motion.p>

        {/* Quote */}
        <motion.div
          variants={fadeInUp}
          className="border-t border-white/20 pt-12 max-w-2xl mx-auto"
        >
          <p className="text-white/60 text-lg md:text-xl italic">
            "El 87% de los proyectos de IA nunca llegan a producción. 
            No es un problema técnico. Es un problema de hacer las preguntas correctas."
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// Problem Section
function ProblemSection() {
  return (
    <section className="bg-[#0a1628] py-24 md:py-32" id="problema">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          className="grid lg:grid-cols-2 gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Left */}
          <motion.div variants={fadeInUp}>
            <span className="text-[#2339E8] text-sm font-medium uppercase tracking-widest mb-6 block">
              El diagnóstico
            </span>
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Tu empresa no necesita más IA. Necesita saber para qué.
            </h2>
          </motion.div>

          {/* Right */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <p className="text-white/70 text-lg md:text-xl leading-relaxed">
              Llevas meses oyendo que "hay que hacer algo con IA". Te han vendido demos 
              espectaculares que nunca escalaron. Has invertido en formación que no cambió nada. 
              Y sigues sin tener claro por dónde empezar.
            </p>
            <p className="text-white/50 text-lg leading-relaxed">
              El problema no es la tecnología. Es que nadie se ha sentado contigo a entender 
              tu negocio antes de proponer soluciones. A separar el ruido del valor real. 
              A decirte "esto no" cuando toca.
            </p>
            <p className="text-white/70 text-lg leading-relaxed font-medium">
              Nosotros empezamos por ahí.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Differentiation Section
function DifferentiationSection() {
  return (
    <section className="bg-[#0d1e33] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight">
            Lo que hacemos{' '}
            <span className="relative inline-block">
              <span className="relative z-10 italic text-white/60">(y lo que no)</span>
            </span>
          </h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {/* No somos */}
          <motion.div
            variants={staggerItem}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10"
          >
            <h3 className="text-white/40 text-2xl font-bold mb-8">No hacemos</h3>
            <ul className="space-y-5">
              {[
                'Demos bonitas que nunca llegan a producción',
                'Implementar "lo que está de moda" sin validar el caso de uso',
                'Proyectos de 18 meses para descubrir que no funcionaba',
                'Vender horas de consultoría sin comprometernos con resultados',
                'Decir que sí a todo para facturar'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4 text-white/50">
                  <span className="text-red-400 mt-1 text-lg">✕</span>
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Somos */}
          <motion.div
            variants={staggerItem}
            className="bg-[#2339E8]/10 border border-[#2339E8]/30 rounded-2xl p-8 md:p-10"
          >
            <h3 className="text-white text-2xl font-bold mb-8">Sí hacemos</h3>
            <ul className="space-y-5">
              {[
                'Diagnósticos honestos: "esto no tiene sentido" es una respuesta válida',
                'Priorizar por impacto en negocio, no por sofisticación técnica',
                'MVPs en semanas que validan hipótesis antes de escalar',
                'Transferencia real de conocimiento a tu equipo',
                'Decirte lo que no quieres oír si es lo que necesitas'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4 text-white/80">
                  <span className="text-[#2339E8] mt-1 text-lg">✓</span>
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Services Section
function ServicesSection() {
  const services = [
    {
      number: '01',
      title: 'Diagnóstico Estratégico',
      description: 'No empezamos con tecnología. Empezamos entendiendo tu negocio, tus cuellos de botella y dónde una solución de IA tendría impacto real vs. dónde sería un capricho caro.',
      outcome: 'Resultado: Mapa de oportunidades priorizado por ROI, no por hype.'
    },
    {
      number: '02',
      title: 'Diseño de Solución',
      description: 'Definimos el qué, el cómo y el cuánto. Sin ambigüedades. Con métricas de éxito claras y un plan B si la hipótesis falla. Porque a veces falla.',
      outcome: 'Resultado: Roadmap ejecutable con hitos medibles.'
    },
    {
      number: '03',
      title: 'Ejecución y Validación',
      description: 'Construimos MVPs que demuestran valor en semanas, no en trimestres. Si funciona, escalamos. Si no, pivotamos rápido y barato.',
      outcome: 'Resultado: Prueba de concepto validada en entorno real.'
    },
    {
      number: '04',
      title: 'CTO Externo',
      description: 'Liderazgo tecnológico de alto nivel sin el coste fijo de un C-level. Para cuando necesitas criterio senior pero no 250K€ de nómina.',
      outcome: 'Resultado: Decisiones tecnológicas con visión de negocio.'
    }
  ]

  return (
    <section className="bg-[#0a1628] py-24 md:py-32" id="servicios">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="text-[#2339E8] text-sm font-medium uppercase tracking-widest mb-6 block">
            Servicios
          </span>
          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Menos PowerPoint, más resultados
          </h2>
          <p className="text-white/50 text-xl max-w-2xl">
            No vendemos "transformación digital". Resolvemos problemas concretos con soluciones que funcionan.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {services.map((service) => (
            <motion.div
              key={service.number}
              variants={staggerItem}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#2339E8]/50 rounded-2xl p-8 md:p-10 transition-all duration-500"
            >
              <span className="text-[#2339E8]/40 text-6xl font-bold group-hover:text-[#2339E8]/60 transition-colors">
                {service.number}
              </span>
              <h3 className="text-white text-2xl font-bold mt-4 mb-4">
                {service.title}
              </h3>
              <p className="text-white/60 text-lg mb-4">
                {service.description}
              </p>
              <p className="text-[#2339E8] text-sm font-medium">
                {service.outcome}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Manifesto Section
function ManifestoSection() {
  return (
    <section className="bg-[#2339E8] py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.span 
            variants={fadeInUp}
            className="text-white/60 text-sm font-medium uppercase tracking-widest mb-8 block"
          >
            Nuestra posición
          </motion.span>
          
          <motion.h2 
            variants={fadeInUp}
            className="text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-12 leading-tight"
          >
            La IA no es magia. Es una herramienta. 
            Y como toda herramienta, solo sirve si sabes para qué la usas.
          </motion.h2>
          
          <motion.div variants={fadeInUp} className="space-y-6 text-white/80 text-lg md:text-xl text-left">
            <p>
              Llevamos años viendo empresas gastar fortunas en proyectos de IA que nunca 
              debieron empezar. No porque la tecnología fallara, sino porque nadie hizo 
              las preguntas incómodas al principio.
            </p>
            <p>
              ¿Qué problema estamos resolviendo? ¿Cuánto vale resolverlo? ¿Es la IA 
              la mejor forma de hacerlo? ¿Tenemos los datos? ¿Está la organización 
              preparada para adoptar la solución?
            </p>
            <p className="text-white font-medium">
              Nuestro trabajo es hacer esas preguntas. Y a veces, la respuesta honesta 
              es: "No hagas nada. Todavía no."
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Contact Section
function ContactSection() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

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
    <section className="bg-[#0a1628] py-24 md:py-32" id="contacto">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          className="grid lg:grid-cols-2 gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {/* Left */}
          <motion.div variants={fadeInUp}>
            <span className="text-[#2339E8] text-sm font-medium uppercase tracking-widest mb-6 block">
              Siguiente paso
            </span>
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Una conversación honesta
            </h2>
            <p className="text-white/60 text-lg mb-6">
              No hacemos llamadas de venta. Hacemos conversaciones para entender 
              si tiene sentido trabajar juntos. A veces la respuesta es no, 
              y está bien.
            </p>
            <div className="space-y-4 text-white/40 text-sm">
              <p>→ Sin compromiso. Sin presión.</p>
              <p>→ 30 minutos para entender tu situación.</p>
              <p>→ Feedback honesto, aunque no te guste.</p>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div variants={fadeInUp}>
            {formStatus === 'success' ? (
              <div className="bg-[#2339E8]/20 border border-[#2339E8]/40 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="text-white text-xl font-bold mb-2">Mensaje recibido</h3>
                <p className="text-white/60">Te responderemos en menos de 48h. Sin bots, sin respuestas automáticas.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Tu nombre"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#2339E8]/50 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email profesional"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#2339E8]/50 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="company"
                    placeholder="Empresa y cargo"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#2339E8]/50 transition-colors"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder="¿Cuál es el problema que intentas resolver? (sé específico)"
                    rows={4}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#2339E8]/50 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-[#2339E8] hover:bg-[#1a2bc0] text-white font-medium py-4 rounded-xl transition-colors disabled:opacity-50"
                >
                  {formStatus === 'submitting' ? 'Enviando...' : 'Enviar mensaje'}
                </button>
                {formStatus === 'error' && (
                  <p className="text-red-400 text-sm text-center">
                    Error al enviar. Inténtalo de nuevo o escríbenos directamente.
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="bg-[#060d18] py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <span className="text-white font-bold text-xl">tauler</span>
            <p className="text-white/40 text-sm mt-2">
              Consultoría estratégica en IA. Sin humo.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <a href="#problema" className="text-white/50 hover:text-white text-sm transition-colors">
              El problema
            </a>
            <a href="#servicios" className="text-white/50 hover:text-white text-sm transition-colors">
              Servicios
            </a>
            <a href="#contacto" className="text-white/50 hover:text-white text-sm transition-colors">
              Contacto
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Tauler Group
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/30 hover:text-white/50 text-sm transition-colors">
              Privacidad
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white/50 transition-colors"
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

// Main App Component
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

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
    <>
      <ScrollProgress />
      <Navbar onMenuOpen={() => setIsMenuOpen(true)} />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <main>
        <HeroSection />
        <ProblemSection />
        <DifferentiationSection />
        <ServicesSection />
        <ManifestoSection />
        <ContactSection />
      </main>
      
      <Footer />
    </>
  )
}

export default App

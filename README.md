# Tauler Group - Consultoría en IA

Landing page premium para el servicio de Consultoría en Inteligencia Artificial de Tauler Group.

## Stack Tecnológico

- **Framework**: Vite + React 18 + TypeScript
- **Estilos**: Tailwind CSS v4 con @theme
- **Animaciones**: Framer Motion
- **Smooth Scroll**: Lenis
- **Formularios**: Formspree

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## Estructura del Proyecto

```
├── index.html           # HTML principal con fuentes y metadatos
├── src/
│   ├── main.tsx        # Entry point de React
│   ├── App.tsx         # Componente principal con todas las secciones
│   ├── index.css       # Estilos globales con Tailwind @theme
│   └── vite-env.d.ts   # Tipos de Vite
├── public/
│   └── favicon.png     # Favicon
├── package.json
├── vite.config.ts
├── postcss.config.js
├── tsconfig.json
└── README.md
```

## Secciones

1. **Hero** - Headline principal con animaciones staggered y orbs parallax
2. **Manifesto** - Propuesta de valor con grid asimétrico
3. **Qué Hacemos** - Cards de diferenciación (lo que no somos vs lo que somos)
4. **Servicios** - Grid 2x2 de servicios con hover animations
5. **Beneficios** - Bento grid con beneficios clave
6. **Contacto** - Formulario integrado con Formspree
7. **Footer** - Links y legal

## Paleta de Colores

- **Background**: Blanco (#FFFFFF)
- **Ink/Brand**: Azul Tauler (8, 10, 76)
- **Accent Red**: Rojo de marca (232, 21, 28)
- **Accent**: Azul slate muted (52, 72, 120)

## Tipografía

- **Sans**: Inter (headlines y body)
- **Mono**: JetBrains Mono (eyebrows y código)

## Características

- ✅ Diseño responsive (mobile-first)
- ✅ Smooth scroll con Lenis
- ✅ Animaciones con Framer Motion
- ✅ Scroll progress bar
- ✅ Navbar con shrink on scroll
- ✅ Menú móvil con overlay
- ✅ Formulario funcional con Formspree
- ✅ Accesibilidad (WCAG AA)
- ✅ Soporte prefers-reduced-motion

## Formspree

El formulario de contacto está configurado para enviar a:
`https://formspree.io/f/mandzjzo`

## Licencia

© 2024 Tauler Group. Todos los derechos reservados.


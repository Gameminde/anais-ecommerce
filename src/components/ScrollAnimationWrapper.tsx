// import { motion, useScroll, useTransform } from 'framer-motion' // Temporarily disabled
import React, { ReactNode, useRef } from 'react'
// import { useScrollAnimation, useParallax } from '../hooks/useScrollAnimation'

interface ScrollAnimationWrapperProps {
  children: ReactNode
  className?: string
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'magazine'
  delay?: number
  duration?: number
  parallax?: number
  magazineEffect?: boolean
  once?: boolean
}

export default function ScrollAnimationWrapper({
  children,
  className = '',
  animation = 'fadeIn',
  delay = 0,
  duration = 0.8,
  parallax = 0,
  magazineEffect = false,
  once = true
}: ScrollAnimationWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [once])

  const animationClass = animation === 'fadeIn' ? 'animate-fade-in' :
                        animation === 'slideUp' ? 'animate-slide-up' :
                        'animate-fade-in'

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? animationClass : 'opacity-0'}`}
      style={{
        animationDelay: isVisible ? `${delay}s` : undefined,
        animationDuration: `${duration}s`,
        transition: 'opacity 0.8s ease-out'
      }}
    >
      {children}
    </div>
  )
}

// Magazine-style page transition component
export function MagazinePage({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

// Smooth scroll progress bar
export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = React.useState(0)

  React.useEffect(() => {
    const updateProgress = () => {
      const scrolled = window.scrollY
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(scrolled / maxHeight)
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress() // Initial call

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-anais-taupe z-50 origin-left transition-transform duration-100"
      style={{ transform: `scaleX(${scrollProgress})` }}
    />
  )
}


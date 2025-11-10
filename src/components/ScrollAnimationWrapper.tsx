import { motion, useScroll, useTransform } from 'framer-motion'
import { ReactNode, useRef } from 'react'
import { useScrollAnimation, useParallax } from '../hooks/useScrollAnimation'

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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: once })
  const { offsetY } = useParallax(parallax)

  const getAnimationVariants = () => {
    const baseTransition = {
      duration,
      delay,
      ease: [0.25, 0.25, 0.25, 0.75]
    }

    switch (animation) {
      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: baseTransition }
        }
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: baseTransition }
        }
      case 'slideLeft':
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0, transition: baseTransition }
        }
      case 'slideRight':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0, transition: baseTransition }
        }
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1, transition: baseTransition }
        }
      case 'magazine':
        return {
          hidden: { opacity: 0, y: 100, rotateX: 15 },
          visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
              ...baseTransition,
              type: "spring",
              stiffness: 100,
              damping: 20
            }
          }
        }
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: baseTransition }
        }
    }
  }

  const variants = getAnimationVariants()

  // Magazine-style transform effects
  const magazineY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const magazineRotate = useTransform(scrollYProgress, [0, 1], [0, 5])
  const magazineScale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

  return (
    <motion.div
      ref={elementRef as any}
      className={className}
      style={{
        transform: parallax ? `translateY(${offsetY}px)` : undefined,
        y: magazineEffect ? magazineY : undefined,
        rotateX: magazineEffect ? magazineRotate : undefined,
        scale: magazineEffect ? magazineScale : undefined,
      }}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  )
}

// Magazine-style page transition component
export function MagazinePage({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.25, 0.25, 0.75]
      }}
    >
      {children}
    </motion.div>
  )
}

// Smooth scroll progress bar
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-anais-taupe z-50 origin-left"
      style={{ scaleX: scrollYProgress }}
      transition={{ duration: 0.1 }}
    />
  )
}


// import { motion } from 'framer-motion' // Temporarily disabled due to React conflicts
import { useEffect, useState } from 'react'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  direction?: 'left' | 'right' | 'up' | 'down'
  type?: 'chars' | 'words' | 'lines'
  staggerChildren?: number
  once?: boolean
}

export default function SplitText({
  text,
  className = '',
  delay = 0,
  duration = 0.8,
  direction = 'right',
  type = 'chars',
  staggerChildren = 0.03,
  once = true
}: SplitTextProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <span className={className}>{text}</span>
  }

  const getDirectionOffset = () => {
    switch (direction) {
      case 'left': return { x: -50 }
      case 'right': return { x: 50 }
      case 'up': return { y: -30 }
      case 'down': return { y: 30 }
      default: return { x: 50 }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren,
      }
    }
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      ...getDirectionOffset()
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: "easeOut"
      }
    }
  }

  const splitText = () => {
    switch (type) {
      case 'chars':
        return text.split('').map((char, index) => (
          <span
            key={index}
            className="inline-block"
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))
      case 'words':
        return text.split(' ').map((word, index) => (
          <span
            key={index}
            className="inline-block mr-2"
          >
            {word}
          </span>
        ))
      case 'lines':
        return text.split('\n').map((line, index) => (
          <div
            key={index}
            style={{ display: 'block' }}
          >
            {line}
          </div>
        ))
      default:
        return text
    }
  }

  return (
    <span className={className}>
      {splitText()}
    </span>
  )
}


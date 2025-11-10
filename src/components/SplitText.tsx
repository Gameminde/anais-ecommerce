import { motion } from 'framer-motion'
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
          <motion.span
            key={index}
            initial={{ opacity: 0, ...getDirectionOffset() }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once }}
            transition={{
              duration,
              delay: index * staggerChildren,
              ease: "easeOut"
            }}
            style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))
      case 'words':
        return text.split(' ').map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, ...getDirectionOffset() }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once }}
            transition={{
              duration,
              delay: index * staggerChildren,
              ease: "easeOut"
            }}
            style={{ display: 'inline-block', marginRight: '0.3em' }}
          >
            {word}
          </motion.span>
        ))
      case 'lines':
        return text.split('\n').map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, ...getDirectionOffset() }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once }}
            transition={{
              duration,
              delay: index * staggerChildren,
              ease: "easeOut"
            }}
            style={{ display: 'block' }}
          >
            {line}
          </motion.div>
        ))
      default:
        return text
    }
  }

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-100px" }}
    >
      {splitText()}
    </motion.span>
  )
}


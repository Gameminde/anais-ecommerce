import { useEffect, useRef, useCallback } from 'react'

interface UseMobileGesturesOptions {
  onPullRefresh?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  pullRefreshThreshold?: number
  swipeThreshold?: number
}

export function useMobileGestures({
  onPullRefresh,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  pullRefreshThreshold = 80,
  swipeThreshold = 50
}: UseMobileGesturesOptions = {}) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const pullIndicatorRef = useRef<HTMLDivElement | null>(null)
  const isPullingRef = useRef(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }

    // Reset pull refresh state
    if (pullIndicatorRef.current) {
      pullIndicatorRef.current.classList.remove('visible')
    }
    isPullingRef.current = false
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y

    // Handle pull to refresh (only when at top of page)
    if (window.scrollY === 0 && deltaY > 0 && Math.abs(deltaY) > Math.abs(deltaX)) {
      e.preventDefault()

      if (deltaY > pullRefreshThreshold && onPullRefresh && !isPullingRef.current) {
        isPullingRef.current = true
        if (pullIndicatorRef.current) {
          pullIndicatorRef.current.classList.add('visible')
        }
      }
    }
  }, [pullRefreshThreshold, onPullRefresh])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Handle pull to refresh
    if (isPullingRef.current && onPullRefresh) {
      onPullRefresh()
      if (pullIndicatorRef.current) {
        setTimeout(() => {
          pullIndicatorRef.current?.classList.remove('visible')
        }, 1000)
      }
    }

    // Handle swipe gestures
    if (absDeltaX > swipeThreshold || absDeltaY > swipeThreshold) {
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }
    }

    touchStartRef.current = null
    isPullingRef.current = false
  }, [swipeThreshold, onPullRefresh, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  useEffect(() => {
    const handleGlobalTouchStart = (e: TouchEvent) => handleTouchStart(e)
    const handleGlobalTouchMove = (e: TouchEvent) => handleTouchMove(e)
    const handleGlobalTouchEnd = (e: TouchEvent) => handleTouchEnd(e)

    document.addEventListener('touchstart', handleGlobalTouchStart, { passive: false })
    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
    document.addEventListener('touchend', handleGlobalTouchEnd, { passive: false })

    return () => {
      document.removeEventListener('touchstart', handleGlobalTouchStart)
      document.removeEventListener('touchmove', handleGlobalTouchMove)
      document.removeEventListener('touchend', handleGlobalTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  const setPullIndicatorRef = useCallback((ref: HTMLDivElement | null) => {
    pullIndicatorRef.current = ref
  }, [])

  return { setPullIndicatorRef }
}





import React, { useState, useEffect } from 'react'
import ccLogo from '../assets/cma.png'

export function MySociabble() {
  const [sizes, setSizes] = useState({})

  // Calculate responsive sizes with improved breakpoints and scaling
  const getResponsiveSizes = () => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    
    // Define breakpoints for better responsive behavior
    const breakpoints = {
      xs: 320,   // Very small phones
      sm: 640,   // Small tablets
      md: 768,   // Tablets
      lg: 1024,  // Small laptops
      xl: 1280,  // Desktop
      xxl: 1536  // Large desktop
    }
    
    // Determine current breakpoint
    let currentBreakpoint = 'xs'
    if (screenWidth >= breakpoints.xxl) currentBreakpoint = 'xxl'
    else if (screenWidth >= breakpoints.xl) currentBreakpoint = 'xl'
    else if (screenWidth >= breakpoints.lg) currentBreakpoint = 'lg'
    else if (screenWidth >= breakpoints.md) currentBreakpoint = 'md'
    else if (screenWidth >= breakpoints.sm) currentBreakpoint = 'sm'
    
    // Responsive scaling based on breakpoints with smoother transitions
    const getScaleFactor = () => {
      switch (currentBreakpoint) {
        case 'xxl': return 1.4
        case 'xl': return 1.2
        case 'lg': return 1.0
        case 'md': return 0.9
        case 'sm': return 0.8
        case 'xs': return 0.7
        default: return 1.0
      }
    }
    
    const scaleFactor = getScaleFactor()
    
    // Base sizes that scale with breakpoints
    const logoSize = Math.floor(64 * scaleFactor)
    const containerPadding = Math.floor(32 * scaleFactor)
    const horizontalPadding = Math.floor(24 * scaleFactor)
    
    // Text scaling with better readability considerations
    const textScaleFactor = scaleFactor * 0.85 // Slightly reduce text scaling
    const textFontSize = Math.floor(18 * textScaleFactor)
    
    // Spacing and borders
    const gap = Math.floor(24 * scaleFactor)
    const borderWidth = Math.max(1, Math.floor(2 * scaleFactor))
    
    // Additional responsive properties
    const flexDirection = screenWidth < breakpoints.sm ? 'column' : 'row'
    const textAlign = screenWidth < breakpoints.sm ? 'center' : 'center'
    const maxWidth = screenWidth < breakpoints.sm ? '100%' : '4xl'
    
    return {
      logoSize,
      containerPadding,
      horizontalPadding,
      textFontSize,
      gap,
      borderWidth,
      scaleFactor,
      flexDirection,
      textAlign,
      maxWidth,
      currentBreakpoint
    }
  }

  // Update sizes on mount and window resize
  useEffect(() => {
    const updateSizes = () => {
      setSizes(getResponsiveSizes())
    }
    
    updateSizes() // Initial calculation
    
    // Debounced resize handler for better performance
    let timeoutId
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateSizes, 100)
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  // Return loading state if sizes haven't been calculated yet
  if (!sizes.logoSize) {
    return (
      <header className="w-full bg-ccblue shadow-lg border-blue-700 border-b-2">
        <div className="container mx-auto text-center py-8 px-6">
          <div className="flex items-center justify-center flex-wrap gap-6">
            <div className="w-16 h-16 bg-gray-300 animate-pulse rounded"></div>
            <div className="h-6 bg-gray-300 animate-pulse rounded w-64"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header 
      className="w-full bg-ccblue shadow-lg border-blue-700"
      style={{
        borderBottomWidth: `${sizes.borderWidth}px`,
        borderBottomStyle: 'solid',
        marginTop: `-${Math.floor(sizes.borderWidth * 4)}px`
      }}
    >
      <div 
        className="container mx-auto text-center"
        style={{ 
          paddingTop: `${sizes.containerPadding}px`,
          paddingBottom: `${sizes.containerPadding}px`,
          paddingLeft: `${sizes.horizontalPadding}px`,
          paddingRight: `${sizes.horizontalPadding}px`
        }}
      >
        <div 
          className="flex items-center justify-center flex-wrap"
          style={{ 
            gap: `${sizes.gap}px`,
            flexDirection: sizes.flexDirection
          }}
        >
          <img
            src={ccLogo}
            alt="CMA CGM Logo"
            className="filter brightness-0 invert transition-all duration-300 hover:scale-105 flex-shrink-0"
            style={{ 
              height: `${sizes.logoSize}px`,
              minHeight: '32px', // Minimum size for very small screens
              maxHeight: '120px' // Maximum size for very large screens
            }}
          />
          <p 
            className="font-ssp text-white font-bold tracking-wide leading-tight"
            style={{ 
              fontSize: `${sizes.textFontSize}px`,
              textAlign: sizes.textAlign,
              maxWidth: sizes.currentBreakpoint === 'xs' ? '100%' : '64rem',
              lineHeight: sizes.currentBreakpoint === 'xs' ? '1.3' : '1.25',
              wordSpacing: sizes.currentBreakpoint === 'xs' ? '0.1em' : '0.05em'
            }}
          >
            WE IMAGINE BETTER WAYS TO SERVE A WORLD IN MOTION
          </p>
        </div>
      </div>
    </header>
  )
}
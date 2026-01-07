import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

export function NavBar({ items, className, accentColor, bgColor, textColor = '#000000ff' }) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredTab, setHoveredTab] = useState(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div 
        className="flex items-center gap-3 border border-white/20 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg"
        style={bgColor ? { backgroundColor: bgColor } : { backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        onMouseLeave={() => setHoveredTab(null)}
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive = (hoveredTab || activeTab) === item.name

          return (
            <a
              key={item.name}
              href={item.url}
              onClick={(e) => {
                if(item.url === '#') e.preventDefault();
                setActiveTab(item.name);
                if(item.onClick) item.onClick();
              }}
              onMouseEnter={() => setHoveredTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                "text-white hover:text-white",
                isActive && "bg-white/10 text-white"
              )}
              style={(() => {
                if (!accentColor) return undefined;
                const isHovered = hoveredTab === item.name;
                if (isActive) return { backgroundColor: accentColor, color: '#fff' };
                return { color: '#ffffff' };
              })()}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-white/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-t-full">
                    <div className="absolute w-12 h-6 bg-[#14B8A6]/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-[#14B8A6]/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-[#14B8A6]/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}
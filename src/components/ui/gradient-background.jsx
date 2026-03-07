'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils'; // adjusted from @/lib/utils

const Default_Gradients = [
    "linear-gradient(135deg, #ffffff 0%, #14b8a6 100%)",
    "linear-gradient(135deg, #14b8a5a3 0%, #078f71c5 100%)",
    "linear-gradient(135deg, #f0fdfa 0%, #0d9488 100%)",
    "linear-gradient(135deg, #0bc9a3b4 0%, #13ce9faf 100%)",
    "linear-gradient(135deg, #ffffff 0%, #14b8a593 100%)",
];

export function GradientBackground({
    children,
    className = '',
    gradients = Default_Gradients,
    animationDuration = 8,
    animationDelay = 0.5,
    overlay = false,
    overlayOpacity = 0.3,
    ...props
}) {
    return (
        <div className={cn('absolute inset-0 z-0 overflow-hidden pointer-events-none', className)} {...props}>
            {/* Animated gradient background */}
            <motion.div
                className="absolute inset-0"
                style={{ background: gradients[0] }}
                animate={{ background: gradients }}
                transition={{
                    delay: animationDelay,
                    duration: animationDuration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Optional overlay */}
            {overlay && (
                <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: overlayOpacity }}
                />
            )}

            {/* Content wrapper */}
            {children && (
                <div
                    className={cn(
                        'relative z-10 flex flex-col min-h-screen items-center justify-center',
                    )}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

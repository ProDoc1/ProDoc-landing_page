import React from 'react';
import {
    motion,
    AnimatePresence,
} from 'motion/react';
import { Plus, Loader2 } from 'lucide-react';

/**
 * A micro-interaction button that expands from a circular icon to a pill shape
 * containing text upon hover. It handles loading states by reverting to the
 * circular shape and displaying a spinner.
 */
const MicroExpander = React.forwardRef(
    (
        {
            text,
            icon,
            variant = 'default',
            isLoading = false,
            className,
            onClick,
            ...props
        },
        ref
    ) => {
        const [isHovered, setIsHovered] = React.useState(false);

        const containerVariants = {
            initial: { width: '48px' },
            hover: { width: 'auto' },
            loading: { width: '48px' },
        };

        const textVariants = {
            initial: { opacity: 0, x: -10 },
            hover: {
                opacity: 1,
                x: 0,
                transition: { delay: 0.15, duration: 0.3, ease: 'easeOut' },
            },
            exit: {
                opacity: 0,
                x: -5,
                transition: { duration: 0.1, ease: 'linear' },
            },
        };

        const variantStyles = {
            default: 'bg-teal-600 text-white border border-teal-600',
            outline:
                'bg-transparent border border-slate-200 text-slate-800 hover:border-teal-600',
            ghost:
                'bg-slate-50/50 border border-transparent text-slate-600 hover:bg-slate-100',
            destructive:
                'bg-rose-500 text-white border border-rose-500 hover:bg-rose-600',
        };

        const handleClick = (e) => {
            if (isLoading) return;
            onClick?.(e);
        };

        // Helper function for conditionally joining classes
        const classNames = (...classes) => {
            return classes.filter(Boolean).join(' ');
        };

        return (
            <motion.button
                ref={ref}
                className={classNames(
                    'relative flex h-12 items-center overflow-hidden rounded-full',
                    'whitespace-nowrap font-medium text-sm',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
                    isLoading && 'cursor-not-allowed',
                    variantStyles[variant],
                    className
                )}
                initial='initial'
                animate={isLoading ? 'loading' : isHovered ? 'hover' : 'initial'}
                variants={containerVariants}
                transition={{ type: 'spring', stiffness: 150, damping: 20, mass: 0.8 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onFocus={() => setIsHovered(true)}
                onBlur={() => setIsHovered(false)}
                onClick={handleClick}
                disabled={isLoading}
                {...props}
                aria-label={text}
            >
                <div className='grid h-12 w-12 place-items-center shrink-0 z-10'>
                    <AnimatePresence mode='popLayout'>
                        {isLoading ? (
                            <motion.div
                                key='spinner'
                                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Loader2 className='h-5 w-5 animate-spin' />
                            </motion.div>
                        ) : (
                            <motion.div
                                key='icon'
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                {icon || <Plus className='h-5 w-5' />}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <motion.div variants={textVariants} className='pr-6 pl-1'>
                    {text}
                </motion.div>
            </motion.button>
        );
    }
);

MicroExpander.displayName = 'MicroExpander';

export { MicroExpander };

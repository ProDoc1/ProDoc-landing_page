"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { AlertCircle } from "lucide-react";

function DisplayCard({
    className,
    icon = <AlertCircle className="w-5 h-5 text-teal-600" />,
    title,
    description,
    titleClassName,
}) {
    return (
        <div
            className={cn(
                "relative flex min-h-[140px] w-[85vw] sm:w-[22rem] max-w-full -skew-y-[4deg] select-none flex-col justify-center rounded-2xl border-2 border-slate-200 bg-white/95 backdrop-blur-md px-5 sm:px-6 py-4 sm:py-5 transition-all duration-700 shadow-xl after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-full sm:after:w-[20rem] after:bg-gradient-to-l after:from-teal-50/10 after:to-transparent after:content-[''] hover:border-teal-400 hover:bg-white hover:shadow-teal-500/10 hover:-skew-y-0",
                className
            )}
        >
            <div className="flex items-center gap-3 mb-2">
                <span className="relative inline-flex items-center justify-center rounded-xl bg-teal-50 p-2.5 transition-colors">
                    {icon}
                </span>
                <p className={cn("text-lg font-bold text-slate-900", titleClassName)}>{title}</p>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-normal pl-1">{description}</p>
        </div>
    );
}

export default function DisplayCards({ cards, className }) {
    const defaultCards = [
        {
            title: "Trust Issues",
            description: "Finding a doctor you can truly trust is difficult in an unregulated market.",
            className: "[grid-area:stack] z-[3] group-hover:-translate-y-[135px] md:group-hover:-translate-y-[170px] group-hover:-skew-y-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] before:absolute before:inset-0 before:bg-white/40 before:rounded-2xl group-hover:before:opacity-0 before:transition-opacity before:duration-700",
        },
        {
            title: "Information Overload",
            description: "Fragmented and unreliable medical information confuses patients during critical moments.",
            className: "[grid-area:stack] z-[2] translate-y-6 translate-x-2 lg:translate-x-4 scale-[0.95] group-hover:-translate-y-0 group-hover:translate-x-0 group-hover:scale-100 group-hover:-skew-y-0 shadow-xl before:absolute before:inset-0 before:bg-slate-50/60 before:rounded-2xl group-hover:before:opacity-0 before:transition-opacity before:duration-700",
        },
        {
            title: "Lack of Transparency",
            description: "Hidden costs and unknown credentials make healthcare choices risky and stressful.",
            className: "[grid-area:stack] z-[1] translate-y-12 translate-x-4 lg:translate-x-8 scale-[0.90] group-hover:translate-y-[135px] md:group-hover:translate-y-[170px] group-hover:translate-x-0 group-hover:scale-100 group-hover:-skew-y-0 shadow-2xl before:absolute before:inset-0 before:bg-slate-100/80 before:rounded-2xl group-hover:before:opacity-0 before:transition-opacity before:duration-700",
        },
    ];

    const displayCards = cards || defaultCards;

    return (
        <div className={cn("grid [grid-template-areas:'stack'] place-items-center opacity-100 group min-h-[400px] cursor-pointer w-full justify-center max-w-md mx-auto relative", className)}>
            {displayCards.map((cardProps, index) => (
                <DisplayCard key={index} {...cardProps} />
            ))}
        </div>
    );
}

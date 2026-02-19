import React from 'react';

const CalcButton = ({
    label,
    onClick,
    type = 'neutral', // 'neutral' (dark gray), 'accent' (orange), 'function' (light gray)
    className = '',
    active = false, // for persistent operator highlighting
}) => {

    // Base classes for circle shape and basic layout
    const baseClasses = "rounded-full flex items-center justify-center text-3xl font-medium transition-all duration-150 active:scale-95 select-none";

    // Dimensions - Fluid responsive system
    // We use aspect-square to ensure buttons remain circular while rescaling with width.
    // text size uses clamp to adapt to button size.

    const sizeClasses = `
    w-full aspect-square 
    text-[clamp(1.5rem,6cqw,2.5rem)] 
    flex items-center justify-center
  `;

    // Color variants
    const variants = {
        neutral: `bg-[#333333] text-white hover:lg:bg-[#4d4d4d] active:bg-[#737373]`,
        function: `bg-[#a5a5a5] text-black hover:lg:bg-[#d9d9d9] active:bg-[#f2f2f2]`,
        accent: `bg-[#ff9f0a] text-white hover:lg:bg-[#ffb340] active:bg-[#d48407] transition-colors`,
        accentActive: `bg-white text-[#ff9f0a] hover:bg-gray-100`,
    };

    // Handle 0 button specifically
    // It spans 2 columns. To keep the pill shape proportional to the single buttons:
    // We want it to be same height as others, but width of 2 buttons + gap.
    // We use aspect-auto but force height to match others via grid usually, or just careful CSS.
    // Simpler approach: 'h-full aspect-[2.1/1]' works if grid rows are even.
    // Or just rely on row height from other buttons.
    const isZero = label === '0';
    const shapeClasses = isZero
        ? "col-span-2 w-full rounded-full aspect-[2.1/1] items-center justify-start pl-[12%]"
        : sizeClasses;

    // Determine effective class
    let variantClass = variants[type];
    if (type === 'accent' && active) {
        variantClass = variants.accentActive;
    }

    return (
        <button
            className={`${baseClasses} ${shapeClasses} ${variantClass} ${className}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default CalcButton;

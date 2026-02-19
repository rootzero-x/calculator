import React, { useEffect, useRef } from 'react';
import { formatDisplay } from '../utils/calcEngine';

const Display = ({ value }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    // Auto-resize text logic
    useEffect(() => {
        const container = containerRef.current;
        const text = textRef.current;
        if (!container || !text) return;

        let fontSize = 80; // Start max fontsize (mobile)
        if (window.innerWidth < 640) fontSize = 85;

        text.style.fontSize = `${fontSize}px`;

        // Shrink until it fits
        const minFontSize = 30;
        while (text.scrollWidth > container.clientWidth && fontSize > minFontSize) {
            fontSize -= 5;
            text.style.fontSize = `${fontSize}px`;
        }
    }, [value]);

    return (
        <div
            ref={containerRef}
            className="w-full flex-shrink-0 h-32 mb-2 flex items-end justify-end px-4 overflow-hidden relative"
        >
            <span
                ref={textRef}
                className="text-white font-light tracking-tight leading-none transition-all duration-100 whitespace-nowrap"
                style={{ fontSize: '80px' }}
            >
                {formatDisplay(value)}
            </span>
        </div>
    );
};

export default Display;

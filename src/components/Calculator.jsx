import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Display from './Display';
import CalcButton from './CalcButton';
import { useCalculator } from '../hooks/useCalculator';

const Calculator = () => {
    const {
        displayValue,
        inputDigit,
        inputDecimal,
        clearAll,
        clearEntry,
        deleteLast,
        performOperation,
        inputPercent,
        inputSign,
        handleEquals,
        activeOperator
    } = useCalculator();

    // --- Keyboard Support ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            const { key } = e;

            if (/\d/.test(key)) {
                e.preventDefault();
                inputDigit(key);
            } else if (key === '.') {
                e.preventDefault();
                inputDecimal();
            } else if (key === 'Enter' || key === '=') {
                e.preventDefault();
                handleEquals();
            } else if (key === 'Backspace') {
                e.preventDefault();
                deleteLast();
            } else if (key === 'Escape') {
                e.preventDefault();
                clearAll();
            } else if (['+', '-', '*', '/'].includes(key)) {
                e.preventDefault();
                let mapOp = key;
                if (key === '/') mapOp = '÷';
                if (key === '*') mapOp = '×';
                performOperation(mapOp);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [inputDigit, inputDecimal, handleEquals, deleteLast, clearAll, performOperation]);

    return (
        /* 
           Layout Strategy:
            - Fluid Container: Uses max-width but shrinks (`w-full`, `max-w-md`).
            - Container Queries: `container` class allows buttons to look at parent width for font sizing.
            - Overflow protection: `overflow-hidden` prevents large numbers pushing layout.
            - Full Height for Mobile: `h-[100dvh]` ensures full coverage.
        */
        <div className="
            transition-all duration-300 ease-in-out container-type-inline-size
            
            /* Mobile Layout (Default) */
            w-full h-[100dvh] bg-black flex flex-col justify-end pb-safe safe-area-inset-bottom
            
            /* Tablet Layout */
            md:w-auto md:h-auto md:bg-black md:rounded-[40px] md:shadow-2xl md:p-6 md:pb-6 md:scale-105 md:aspect-[3/4]
            
            /* Desktop Layout */
            lg:scale-100 lg:w-[360px] lg:rounded-[32px] lg:p-4 lg:pb-5 lg:shadow-[0_20px_50px_rgba(0,0,0,0.5)] lg:border lg:border-white/10
        ">
            <Display value={displayValue} />

            {/* Grid with fluid gap (gap-3 is usually fine, but gap-2 on very small screens helps) */}
            <div className="grid grid-cols-4 place-items-center gap-3 px-4 md:px-0 w-full h-auto">
                {/* Row 1 */}
                <CalcButton
                    label={displayValue !== "0" ? "C" : "AC"}
                    type="function"
                    onClick={displayValue !== "0" ? clearEntry : clearAll}
                />
                <CalcButton label="+/-" type="function" onClick={inputSign} />
                <CalcButton label="%" type="function" onClick={inputPercent} />
                <CalcButton
                    label="÷"
                    type="accent"
                    className="text-4xl pb-2 md:pb-3 lg:pb-2"
                    onClick={() => performOperation('÷')}
                    active={activeOperator === '÷'}
                />

                {/* Row 2 */}
                <CalcButton label="7" onClick={() => inputDigit(7)} />
                <CalcButton label="8" onClick={() => inputDigit(8)} />
                <CalcButton label="9" onClick={() => inputDigit(9)} />
                <CalcButton
                    label="×"
                    type="accent"
                    className="text-4xl pb-2 md:pb-3 lg:pb-2"
                    onClick={() => performOperation('×')}
                    active={activeOperator === '×'}
                />

                {/* Row 3 */}
                <CalcButton label="4" onClick={() => inputDigit(4)} />
                <CalcButton label="5" onClick={() => inputDigit(5)} />
                <CalcButton label="6" onClick={() => inputDigit(6)} />
                <CalcButton
                    label="-"
                    type="accent"
                    className="text-4xl pb-1 md:pb-2 lg:pb-1"
                    onClick={() => performOperation('-')}
                    active={activeOperator === '-'}
                />

                {/* Row 4 */}
                <CalcButton label="1" onClick={() => inputDigit(1)} />
                <CalcButton label="2" onClick={() => inputDigit(2)} />
                <CalcButton label="3" onClick={() => inputDigit(3)} />
                <CalcButton
                    label="+"
                    type="accent"
                    className="text-4xl pb-1 md:pb-2 lg:pb-1"
                    onClick={() => performOperation('+')}
                    active={activeOperator === '+'}
                />

                {/* Row 5 */}
                <CalcButton label="0" onClick={() => inputDigit(0)} />
                <CalcButton label="." onClick={inputDecimal} />
                <CalcButton label="=" type="accent" onClick={handleEquals} />
            </div>

        </div>
    );
};

export default Calculator;

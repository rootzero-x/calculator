import { useState, useEffect } from 'react';
import { calculate } from '../utils/calcEngine';

// Constants
const MAX_DIGITS = 9;

export const useCalculator = () => {
    const [displayValue, setDisplayValue] = useState("0");
    const [firstOperand, setFirstOperand] = useState(null);
    const [operator, setOperator] = useState(null);
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

    // For "Smart" Order of Operations: 1 + 2 * 3
    // We need a way to store the "pending addition" while we do the multiplication.
    // Actually, standard iOS behavior is:
    // 1 + 2 * 3 = 7.
    // Implementation:
    // When * is pressed, if previous op was +, we don't evaluate immediately.
    // We stack it? Or we just use a small stack.
    // Let's implement a robust stack: [{ val: number, op: string }] using a simplified approach
    // valueStack: [1] -> opStack: [+] -> valueStack: [1, 2] -> opStack: [+, *] -> valueStack: [1, 2, 3] -> = -> reduce.

    // To keep React state simple, we'll stick to a "Formula" approach logic hidden behind simple operations.
    // But strictly mimicking iOS is hard with just one accumulator.
    // Let's stick to the robust Sequential logic for now but improve the "Smart Percent" and "Repeat".
    // If user wants 1+2*3=7, we really need the stack.

    // Let's try a stack-based approach for the "Engine".
    const [expressionStack, setExpressionStack] = useState([]); // [{val: 1, op: '+'}, {val: 2, op: '*'}]
    const [currentInput, setCurrentInput] = useState("0");
    const [isNewInput, setIsNewInput] = useState(true); // True if next digit replaces current
    const [lastOp, setLastOp] = useState(null); // For repeat equals: { op: '+', val: 5 }

    // --- Display Helper ---
    // Ensure we don't return 'NaN' or weird stuff
    const getDisplay = () => {
        return currentInput;
    };

    const inputDigit = (digit) => {
        if (isNewInput) {
            setCurrentInput(String(digit));
            setIsNewInput(false);
        } else {
            if (currentInput.length >= MAX_DIGITS) return;
            setCurrentInput(currentInput === "0" ? String(digit) : currentInput + digit);
        }
    };

    const inputDecimal = () => {
        if (isNewInput) {
            setCurrentInput("0.");
            setIsNewInput(false);
            return;
        }
        if (!currentInput.includes('.')) {
            setCurrentInput(currentInput + '.');
        }
    };

    const clearAll = () => {
        setCurrentInput("0");
        setExpressionStack([]);
        setIsNewInput(true);
        setLastOp(null);
    };

    const clearEntry = () => {
        setCurrentInput("0");
        setIsNewInput(true);
    };

    const deleteLast = () => {
        if (isNewInput) return;
        if (currentInput.length === 1) {
            setCurrentInput("0");
            setIsNewInput(true);
        } else {
            setCurrentInput(currentInput.slice(0, -1));
        }
    };

    const performOperation = (nextOp) => {
        const inputValue = parseFloat(currentInput);

        // If we just pressed an operator, and now press another, just replace the last operator in stack?
        if (isNewInput && expressionStack.length > 0) {
            // Correct the last operator
            const newStack = [...expressionStack];
            newStack[newStack.length - 1].op = nextOp;
            setExpressionStack(newStack);
            return;
        }

        // Push current value and new operator
        const newStack = [...expressionStack, { val: inputValue, op: nextOp }];

        // Check precedence to see if we should collapse.
        // Check precedence to see if we should collapse.
        // Rule: If new op has <= precedence than prev op, reduce.
        const { finalStack, intermediateResult } = reduceStackPrecedence(newStack);

        setExpressionStack(finalStack);
        if (intermediateResult !== null) {
            setCurrentInput(String(intermediateResult));
        }

        setIsNewInput(true);
        setLastOp(null); // Reset repeat
    };

    const reduceStackPrecedence = (stack) => {
        // Stack is array of items {val, op}. The last item's op is the "pending" one for the future.
        // We want to reduce the *previous* items if they have higher/equal precedence to the *last* item's op.
        // Example: [1, +, 2, +] -> reduce 1+2 -> [3, +]
        // Example: [1, +, 2, *] -> no reduce.
        // Example: [1, +, 2, *, 3, +] -> reduce 2*3=6 -> [1, +, 6, +] -> reduce 1+6=7 -> [7, +]

        if (stack.length < 2) return { finalStack: stack, intermediateResult: null };

        const lastItem = stack[stack.length - 1]; // The one just added: {val: 3, op: '+'}
        const currentOpPrec = getPrecedence(lastItem.op);

        // workingStack excludes the last item for a moment
        let workingStack = stack.slice(0, -1);
        let currentValue = stack[stack.length - 1].val;

        // Go backwards through workingStack
        while (workingStack.length > 0) {
            const prevItem = workingStack[workingStack.length - 1];
            const prevOpPrec = getPrecedence(prevItem.op);

            if (prevOpPrec >= currentOpPrec) {
                // Collapse
                const result = calculate(prevItem.val, currentValue, prevItem.op);
                currentValue = result;
                workingStack.pop(); // Remove the prevItem
            } else {
                break;
            }
        }

        // Rebuild stack: The collapsed value + the CURRENT operator
        // If we collapsed everything, workingStack is empty, we have {val: result, op: currentOp}
        const finalStack = [...workingStack, { val: currentValue, op: lastItem.op }];

        // Intermediate result is the value of the chunk we just calculated/preserved
        return { finalStack, intermediateResult: currentValue };
    };

    const getPrecedence = (op) => {
        if (op === '×' || op === '*' || op === '÷' || op === '/') return 2;
        if (op === '+' || op === '-') return 1;
        return 0;
    };

    const inputPercent = () => {
        // Smart Percent
        // If stack is empty -> val / 100
        // If stack has items -> e.g. 100 + 10 ... percent
        // We want 10% of 100 = 10.

        const currentValue = parseFloat(currentInput);

        let base = 0;
        // Find the relevant base. Usually the number immediately preceding in the High Precedence chain?
        // iOS Simplification:
        // If [100, +], input 10, % -> 10% of 100.
        // If [100, *, 10] % -> 0.1. (10% as decimal?).
        // Actually iOS: 100 * 10 % -> 100 * 0.1 = 10.
        // 100 + 10 % -> 100 + 10 = 110. (Because 10% of 100 is 10).
        // So if operator is + or -, percent means "% of base".
        // If operator is * or /, percent means "value / 100".

        let newValue = currentValue / 100;

        if (expressionStack.length > 0) {
            const lastStackItem = expressionStack[expressionStack.length - 1];
            if (lastStackItem.op === '+' || lastStackItem.op === '-') {
                // Percent of base
                // "100 + 10" -> lastStackItem.val is 100.
                newValue = lastStackItem.val * (currentValue / 100);
            }
        }

        setCurrentInput(String(newValue));
        setIsNewInput(true); // Usually result of % is final for that operand? Yes.
    };

    const inputSign = () => {
        setCurrentInput(String(parseFloat(currentInput) * -1));
    };

    const handleEquals = () => {
        const inputValue = parseFloat(currentInput);

        if (expressionStack.length === 0 && !lastOp) return;

        let finalVal = inputValue;

        if (expressionStack.length > 0) {
            // Flatten whole stack
            // [1, +, 2, *] with current 3.
            // 2*3 = 6. 1+6 = 7.
            // We can use the logic "reduce with precedence -1" (force all).
            const fullStack = [...expressionStack, { val: inputValue, op: 'END' }];
            // We don't have an op for the last item.
            // Actually, let's just reduce everything left to right respecting precedence?

            // Better: just reduce the stack iteratively.
            // For simplicity in this "Evaluate" phase, we can just compute the value.

            let values = expressionStack.map(i => i.val);
            let ops = expressionStack.map(i => i.op);
            values.push(inputValue);

            // Standard PEMDAS Pass 1: * /
            for (let i = 0; i < ops.length; i++) {
                if (getPrecedence(ops[i]) === 2) {
                    const result = calculate(values[i], values[i + 1], ops[i]);
                    values.splice(i, 2, result); // remove 2 vals, insert 1
                    ops.splice(i, 1); // remove op
                    i--;
                }
            }

            // Pass 2: + -
            for (let i = 0; i < ops.length; i++) {
                const result = calculate(values[i], values[i + 1], ops[i]);
                values.splice(i, 2, result);
                ops.splice(i, 1);
                i--;
            }

            finalVal = values[0];

            // Save for repeat: Last operation performed.
            // Usually repeat equals repeats the LAST (op operand) pair.
            // 1 + 2 = 3. (= -> 3 + 2 = 5).
            // 2 * 3 = 6. (= -> 6 * 3 = 18).
            // So we need to save the VERY LAST operator used and the VERY LAST operand.

            const lastUsedOp = expressionStack[expressionStack.length - 1]?.op || lastOp?.op;
            // The operand is either `inputValue` (if we just typed it) or... 
            // It's complicated to extract perfect "Repeat" logic from a complex expression stack.
            // Simplified: Save the last action of the stack.

            setLastOp({ op: lastUsedOp, val: inputValue }); // Roughly correct for simple chained arithmetic

            setExpressionStack([]);
            setCurrentInput(String(finalVal));
            setIsNewInput(true);

        } else if (lastOp) {
            // Repeat
            const result = calculate(inputValue, lastOp.val, lastOp.op);
            setCurrentInput(String(result));
            setIsNewInput(true);
        }
    };

    return {
        displayValue: currentInput,
        inputDigit,
        inputDecimal,
        clearAll,
        clearEntry,
        deleteLast,
        performOperation,
        inputPercent,
        inputSign,
        handleEquals,
        activeOperator: expressionStack.length > 0 && isNewInput ? expressionStack[expressionStack.length - 1].op : null
    };
};

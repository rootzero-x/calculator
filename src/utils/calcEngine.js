// src/utils/calcEngine.js

export const calculate = (a, b, operation) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) return "";

    let result = 0;
    switch (operation) {
        case "+":
            result = numA + numB;
            break;
        case "-":
            result = numA - numB;
            break;
        case "×":
        case "*":
            result = numA * numB;
            break;
        case "÷":
        case "/":
            if (numB === 0) return "Error";
            result = numA / numB;
            break;
        default:
            return b;
    }

    // Handle floating point precision issues (e.g., 0.1 + 0.2 = 0.300000004)
    // We use a precision safe approach
    const precision = 1000000000000;
    return Math.round(result * precision) / precision;
};

export const formatDisplay = (val) => {
    if (val === "Error") return "Error";
    if (!val) return "0";

    const strVal = String(val);

    // Split into integer and decimal parts
    const parts = strVal.split('.');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

    // Avoid formatting if it allows typing (like '0.' or '12.')
    // Only format the integer part if it's a completed number in some contexts, but for live typing
    // we usually just want to format the integer part with commas.

    // Regex to add commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Implementation note: Ideally we shouldn't format scientific notation automatically if user is typing
    // But for result display, we might want scientific notation for very large numbers.
    if (Math.abs(parseFloat(val)) > 1e16) {
        return parseFloat(val).toExponential(6);
    }

    return formattedInteger + decimalPart;
};

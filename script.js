class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.readyToReset = false;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.readyToReset = false;
    }

    delete() {
        if (this.readyToReset) {
            this.clear();
            return;
        }
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;

        if (this.readyToReset) {
            this.currentOperand = number.toString();
            this.readyToReset = false;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') {
            // Allow changing the operation if user clicked the wrong one
            if (this.previousOperand !== '') {
                this.operation = operation;
            }
            return;
        }
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.readyToReset = false;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
            case '*':
                computation = prev * current;
                break;
            case '÷':
            case '/':
                if (current === 0) return; // Prevent divide by zero
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.readyToReset = true;
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText =
            this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// --- Button Clicks ---
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
        animateButton(button);
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
        animateButton(button);
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
    animateButton(equalsButton);
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
    animateButton(allClearButton);
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
    animateButton(deleteButton);
});

// --- Keyboard Support ---
document.addEventListener('keydown', (e) => {
    const key = e.key;

    // Numbers
    if ((key >= '0' && key <= '9') || key === '.') {
        calculator.appendNumber(key);
        calculator.updateDisplay();
        highlightButtonByContent(key);
    }

    // Operators
    if (key === '+' || key === '-' || key === '*' || key === '/') {
        // Map * and / to display symbols
        let opSymbol = key;
        if (key === '/') opSymbol = '÷';
        if (key === '*') opSymbol = '×';

        calculator.chooseOperation(opSymbol);
        calculator.updateDisplay();
        highlightButtonByContent(opSymbol);
    }

    // Equals (Enter or =)
    if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculator.compute();
        calculator.updateDisplay();
        animateButton(equalsButton);
    }

    // Backspace (Delete)
    if (key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
        animateButton(deleteButton);
    }

    // Escape (All Clear)
    if (key === 'Escape' || key === 'Delete') {
        calculator.clear();
        calculator.updateDisplay();
        animateButton(allClearButton);
    }
});

// --- Helper for Visual Feedback on Keypress ---
function highlightButtonByContent(content) {
    // Find button with matching text
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.innerText === content);
    if (btn) {
        animateButton(btn);
    }
}

function animateButton(button) {
    button.classList.add('active-manual');
    // Simulate active state style
    const originalTransform = button.style.transform;
    button.style.transform = 'scale(0.95)';
    button.style.background = 'rgba(255, 255, 255, 0.15)';

    setTimeout(() => {
        button.style.transform = originalTransform;
        button.style.background = ''; // Revert to CSS rule
        button.classList.remove('active-manual');
    }, 100);
}

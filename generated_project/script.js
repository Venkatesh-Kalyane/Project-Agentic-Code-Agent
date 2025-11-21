// Calculator UI and logic implementation
// This script sets up event listeners for the calculator UI and defines the Calculator class.

// Calculator class encapsulating the calculation logic
class Calculator {
  /**
   * @param {HTMLInputElement} displayElement - The display element where the calculator shows values.
   */
  constructor(displayElement) {
    this.display = displayElement;
    this.reset();
  }

  /**
   * Reset the calculator to its initial state.
   * Clears the current input, operator and operand but does NOT update the display.
   */
  reset() {
    this.current = '';
    this.operator = null;
    this.operand = null;
  }

  /**
   * Update the calculator display with the given value.
   * @param {string} value
   */
  updateDisplay(value) {
    this.display.value = value;
  }

  /**
   * Append a digit (0-9) to the current input.
   * @param {string} digit
   */
  inputDigit(digit) {
    if (this.current === '' || this.current === 'Error') {
      this.current = digit;
    } else if (this.current.length < 12) { // limit input length
      this.current += digit;
    }
    this.updateDisplay(this.current);
  }

  /**
   * Append a decimal point to the current input.
   * If the current input is empty or an error, start with "0.".
   */
  inputDecimal() {
    if (this.current === '' || this.current === 'Error') {
      this.current = '0.';
    } else if (!this.current.includes('.')) {
      this.current += '.';
    }
    this.updateDisplay(this.current);
  }

  /**
   * Handle operator input. Stores the operator, moves the current input to operand, and resets current.
   * @param {string} op - One of 'add', 'subtract', 'multiply', 'divide', 'pow'.
   */
  inputOperator(op) {
    // If an operator is already pending and a new value has been entered, compute first.
    if (this.operator && this.current !== '') {
      this.compute();
    }
    this.operand = this.current;
    this.operator = op;
    this.current = '';
  }

  /**
   * Perform the calculation based on the stored operator, operand and current input.
   * Handles division by zero by displaying "Error" and resetting internal state.
   */
  compute() {
    if (!this.operator || this.operand === '' || this.current === '') return;

    const a = parseFloat(this.operand);
    const b = parseFloat(this.current);
    let result;

    switch (this.operator) {
      case 'add':
        result = a + b;
        break;
      case 'subtract':
        result = a - b;
        break;
      case 'multiply':
        result = a * b;
        break;
      case 'divide':
        if (b === 0) {
          // Division by zero: show error and reset state
          this.updateDisplay('Error');
          this.reset();
          return;
        }
        result = a / b;
        break;
      case 'pow':
        result = Math.pow(a, b);
        break;
      default:
        result = this.current;
    }

    this.current = String(result);
    this.operator = null;
    this.operand = null;
    this.updateDisplay(this.current);
  }

  /**
   * Clear the calculator to its initial state and update the display.
   */
  clear() {
    this.reset();
    this.updateDisplay('');
  }

  /**
   * Remove the last character from the current input.
   */
  backspace() {
    if (this.current.length > 0) {
      this.current = this.current.slice(0, -1);
      this.updateDisplay(this.current);
    }
  }

  /**
   * Calculate the square root of the current input.
   */
  sqrt() {
    const val = parseFloat(this.current);
    if (!isNaN(val) && val >= 0) {
      this.current = String(Math.sqrt(val));
      this.updateDisplay(this.current);
    }
  }

  /**
   * Calculate exponentiation using the stored operand as base and current input as exponent.
   * This method mirrors the behaviour of the "pow" operator.
   */
  pow() {
    if (this.operand !== '' && this.current !== '') {
      const base = parseFloat(this.operand);
      const exponent = parseFloat(this.current);
      const result = Math.pow(base, exponent);
      this.current = String(result);
      this.operator = null;
      this.operand = null;
      this.updateDisplay(this.current);
    }
  }

  /**
   * Convert the current input to a percentage (divide by 100).
   */
  percent() {
    const val = parseFloat(this.current);
    if (!isNaN(val)) {
      this.current = String(val / 100);
      this.updateDisplay(this.current);
    }
  }
}

// Wait for the DOM to load before accessing elements
document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.keypad button');
  const calculator = new Calculator(display);

  // Helper to attach click handlers to all buttons
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const op = btn.dataset.op;
      switch (op) {
        case 'digit':
          calculator.inputDigit(btn.textContent);
          break;
        case 'decimal':
          calculator.inputDecimal();
          break;
        case 'equals':
          calculator.compute();
          break;
        case 'clear':
          calculator.clear();
          break;
        case 'backspace':
          calculator.backspace();
          break;
        case 'sqrt':
          calculator.sqrt();
          break;
        case 'percent':
          calculator.percent();
          break;
        default: // Operators (add, subtract, multiply, divide, pow)
          calculator.inputOperator(op);
      }
    });
  });

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key >= '0' && key <= '9') {
      calculator.inputDigit(key);
    } else if (key === '.') {
      calculator.inputDecimal();
    } else if (key === '+') {
      calculator.inputOperator('add');
    } else if (key === '-') {
      calculator.inputOperator('subtract');
    } else if (key === '*') {
      calculator.inputOperator('multiply');
    } else if (key === '/') {
      calculator.inputOperator('divide');
    } else if (key === '^') {
      calculator.inputOperator('pow');
    } else if (key === '%') {
      // Treat % key as percent conversion
      calculator.percent();
    } else if (key === 'Enter') {
      calculator.compute();
    } else if (key === 'Backspace') {
      calculator.backspace();
    } else if (key === 'Delete') {
      calculator.clear();
    }
  });
});

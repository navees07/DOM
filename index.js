const display = document.getElementById("display");

let expression = "0";

const operators = ["+", "-", "*", "/"];

function updateDisplay() {
  // Show * and / as x and / the way the physical keys look
  const shown = expression.replace(/\*/g, "\u00d7").replace(/\//g, "\u00f7");
  display.textContent = shown;
}

function isOperator(ch) {
  return operators.includes(ch);
}

function appendDigit(digit) {
  if (expression === "0") {
    expression = digit;
  } else {
    expression += digit;
  }
}

function appendOperator(op) {
  const lastChar = expression.slice(-1);

  if (isOperator(lastChar)) {
    // Replace the previous operator instead of stacking two in a row
    expression = expression.slice(0, -1) + op;
  } else {
    expression += op;
  }
}

function clearAll() {
  expression = "0";
}

function backspace() {
  if (expression.length <= 1) {
    expression = "0";
  } else {
    expression = expression.slice(0, -1);
  }
}

function calculate() {
  // Strip a trailing operator, if any, before evaluating
  let toEval = expression;
  if (isOperator(toEval.slice(-1))) {
    toEval = toEval.slice(0, -1);
  }

  // Only allow digits, decimal points, parentheses, and the four operators
  if (!/^[0-9+\-*/.\s]+$/.test(toEval)) {
    expression = "Error";
    updateDisplay();
    return;
  }

  try {
    const result = Function(`"use strict"; return (${toEval})`)();
    if (!isFinite(result)) {
      expression = "Error";
    } else {
      expression = String(result);
    }
  } catch (err) {
    expression = "Error";
  }
}

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const { action, value } = btn.dataset;

    if (expression === "Error" && action !== "clear") {
      expression = "0";
    }

    if (action === "clear") {
      clearAll();
    } else if (action === "backspace") {
      backspace();
    } else if (action === "equals") {
      calculate();
    } else if (value !== undefined) {
      if (isOperator(value)) {
        appendOperator(value);
      } else {
        appendDigit(value);
      }
    }

    updateDisplay();
  });
});

updateDisplay();
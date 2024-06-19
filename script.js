class Calculator {
  constructor() {
    this.operations = {
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '*': (a, b) => a * b,
      '/': (a, b) => a / b,
      '^': (a, b) => a ** b,
    };
    this.operators = ['^', '/', '*', '+', '-'];
  }

  operate(arr) {
    let a, b, ans;

    for (const operator of this.operators) {
      while (arr.includes(operator)) {
        const opIndex = arr.indexOf(operator);
        const op = arr[opIndex];
        a = +arr[opIndex - 1];
        b = +arr[opIndex + 1];

        ans = this.operations[op](a, b);
        arr.splice(opIndex - 1, 3, ans);
      }
    }

    return ans;
  }
}

const calc = new Calculator();
const REGEX = /(\d*\.?\d+|[\+\-\*\/\^])/g;
const MAX_LENGTH = 15;

let result = 0;
let finishCalculation = false;

const entryLine = document.querySelector('.entry-line');
const outputDisplay = document.querySelector('.output-display');

function updateEntryLength() {
  entryLine.dataset.length = entryLine.textContent.length;
}

function init() {
  updateEntryLength();
  setupKeyboardInput();
  setupClearFunctions();
}

function setupKeyboardInput() {
  document.addEventListener('keydown', handleKeyboardInput);
}

function handleKeyboardInput(e) {
  const key = e.key;
  if (calc.operators.includes(key)) {
    handleOperatorInput(key);
  } else if (key >= '0' && key <= '9') {
    handleNumberInput(key);
  } else if (key === 'Enter') {
    handleEnterInput();
  }
}

function setupClearFunctions() {
  document.addEventListener('click', (e) => {
    const func = e.target.getAttribute('data-function');
    if (func === 'clear-all') {
      clearAll();
    } else if (func === 'delete') {
      deleteLastEntry();
    }
  });
}

function clearAll() {
  entryLine.textContent = '';
  outputDisplay.textContent = '';
  updateEntryLength();
  finishCalculation = false;
}

function deleteLastEntry() {
  entryLine.textContent = entryLine.textContent.slice(0, -1);
  updateEntryLength();
}

function handleOperatorInput(key) {
  const recentEntry = entryLine.textContent.slice(-1);
  if (recentEntry >= '0' && recentEntry <= '9') {
    appendToEntryLine(key);
  } else if (calc.operators.includes(recentEntry)) {
    entryLine.textContent = entryLine.textContent.slice(0, -1) + key;
  }
}

function handleNumberInput(key) {
  if (finishCalculation) {
    clearAll();
  }
  appendToEntryLine(key);
}

function appendToEntryLine(entry) {
  if (entryLine.dataset.length < MAX_LENGTH) {
    entryLine.textContent += entry;
    updateEntryLength();
  } else if (entryLine.dataset.length === MAX_LENGTH) {
    entryLine.style.fontSize = '30px';
    entryLine.textContent += entry;
    updateEntryLength();
  }
}

function handleEnterInput() {
  if (!finishCalculation) {
    result = calc.operate(entryLine.textContent.match(REGEX));
    if (result !== null) {
      outputDisplay.textContent = result;
      finishCalculation = true;
    }
  } else {
    entryLine.textContent = result;
    outputDisplay.textContent = '';
  }
}

init();

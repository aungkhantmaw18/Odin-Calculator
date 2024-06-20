class Calculator {
  constructor() {
    this.operations = {
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '*': (a, b) => a * b,
      '/': (a, b) => a / b,
      '^': (a, b) => a ** b,
    };
    this.operatorSets = [['^'], ['/', '*'], ['+', '-']]; // For operator precedence
    this.operators = ['^', '/', '*', '+', '-']; // For validation of operator inputs
  }

  operate(arr) {
    let a, b, ans;

    for (const operatorSet of this.operatorSets) {
      let index = 0;
      while (index < arr.length) {
        while (operatorSet.includes(arr[index])) {
          const op = arr[index];
          const a = +arr[index - 1];
          const b = +arr[index + 1];

          if (op === '/' && b === 0) return 'Zero Division Error';

          ans = this.operations[op](a, b);
          arr.splice(index - 1, 3, ans);
        }
        index++;
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
const answer = document.querySelector('.answer');

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
  } else if (key === 'Backspace') {
    deleteLastEntry();
  }
}

function setupClearFunctions() {
  document.addEventListener('click', (e) => {
    const func = e.target.getAttribute('data-function');
    if (func === 'clear-all') {
      clearAll();
    } else if (func === 'clear-entry') {
      clearEntry();
    } else if (func === 'delete') {
      deleteLastEntry();
    }
  });
}

function clearAll() {
  entryLine.textContent = '';
  answer.textContent = '';
  entryLine.style.fontSize = '32px';
  updateEntryLength();
  finishCalculation = false;
}

function clearEntry() {
  let arr = entryLine.textContent.match((REGEX));
  if (arr.length === 1) {
    entryLine.textContent = '';
  } else {
    arr.splice(-1, 1);
    entryLine.textContent = arr.join('');
  }
  updateEntryLength();
}

function deleteLastEntry() {
  entryLine.textContent = entryLine.textContent.slice(0, -1);
  updateEntryLength();
}

function handleOperatorInput(key) {
  const recentEntry = entryLine.textContent.slice(-1);
  if ((recentEntry >= '0' && recentEntry <= '9')) {
    if (finishCalculation) {
      entryLine.textContent = result;
      finishCalculation = false;
    }
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
  if (entryLine.textContent.length < MAX_LENGTH) {
    entryLine.textContent += entry;
    updateEntryLength();
  } else if (entryLine.textContent.length === MAX_LENGTH) {
    entryLine.style.fontSize = '30px';
    entryLine.textContent += entry;
    updateEntryLength();
  }
}

function handleEnterInput() {
  if (!finishCalculation) {
    const expression = entryLine.textContent.match(REGEX)
    validateExpression(expression);
    if (expression) {
      result = calc.operate(expression);
      if (result !== null) {
        answer.textContent = result;
        finishCalculation = true;
      }
    }
  }
}

function validateExpression(exp) {
  let operators = [];
  let operands = [];
  exp.forEach(element => {
    if (calc.operators.includes(element)) operators.push(element);
    else operands.push(element);
  });  

  console.log(operators, operators.length);
  console.log(operands, operands.length);
  // TODO check opd len & opt len to make sure the exp is valid
}

init();

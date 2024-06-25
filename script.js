class Calculator {
  constructor() {
    this.operations = {
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '×': (a, b) => a * b,
      '÷': (a, b) => a / b,
      '^': (a, b) => a ** b,
      '√': (a) => Math.sqrt(a),
    };
    this.operatorSets = [['^', '√'], ['÷', '×'], ['+', '-']]; // For operator precedence
    this.operators = ['^', '√', '÷', '/', '*', '×', '+', '-']; // For validation of operator inputs
  }

  evaluateBasicExpression(exp) {
    if (exp.length === 1) {
      return parseFloat(exp[0]);
    }
    
    let a, b, ans;

    for (const operatorSet of this.operatorSets) {
      let index = 0;
      while (index < exp.length) {
        if (exp[index] === '√') {
          ans = this.operations['√'](+exp[index+1]);
          exp.splice(index, 2, ans);
          continue;
        }
        while (operatorSet.includes(exp[index])) {
          const op = exp[index];
          a = +exp[index - 1];
          b = +exp[index + 1];

          if (op === '÷' && b === 0) return 'Zero Division Error';

          ans = this.operations[op](a, b);
          exp.splice(index - 1, 3, ans);
        }
        index++;
      }
    }

    return parseFloat(ans.toPrecision(15));
  }

  evaluateExpression(exp) {
    let openBracketIndex, closeBracketIndex;

    if (exp.includes('(') && exp.includes(')')) {
      openBracketIndex = exp.lastIndexOf('(');
      closeBracketIndex = exp.indexOf(')', openBracketIndex);
      
      let subExp = exp.slice(openBracketIndex+1, closeBracketIndex);
      let ans = this.evaluateBasicExpression(subExp);
      
      exp.splice(openBracketIndex, closeBracketIndex - openBracketIndex + 1, ans);
      return this.evaluateExpression(exp);
    } 
    return this.evaluateBasicExpression(exp);
  }
}

const calc = new Calculator();

const REGEX = /(\d*\.?\d+|[\+\-\×\*\/\÷\^\√\(\)])/g;
const MAX_LENGTH = 15;

let openBracketCount = 0;
let closeBracketCount = 0;
let result = 0;
let finishCalculation = false;

const outputDisplay = document.querySelector('.output-display');
const entryLine = document.querySelector('.entry-line');
const answer = document.querySelector('.answer-display');
const ans = document.querySelector('.ans');

function updateEntryLength() {
  entryLine.dataset.length = entryLine.textContent.length;
}

function init() {
  updateEntryLength();
  setupButtonInput();
  setupKeyboardInput();
  setupClearFunctions();
}

function setupButtonInput() {
  document.addEventListener('click', handleButtonInput);
}

function handleButtonInput(e) {
  const type = e.target.getAttribute('data-type');
  if (type === 'operation') {
    const operation = e.target.getAttribute('data-operation');
    if (operation === '√') {
      let arr = entryLine.textContent.match((REGEX));
      if (arr[arr.length - 2] !== '√') {
        arr.splice(-1, 0, '√');
        entryLine.textContent = arr.join('');
      }
      
    }
  }
}

function setupKeyboardInput() {
  document.addEventListener('keydown', handleKeyboardInput);
}

function handleKeyboardInput(e) {
  const key = e.key;
  if (calc.operators.includes(key)) {
    handleOperatorInput(changeToSymbol(key));
  } else if (key >= '0' && key <= '9') {
    handleNumberInput(key);
  } else if (key === 'Enter') {
    handleEnterInput();
  } else if (key === 'Backspace') {
    deleteLastEntry();
  } else if (key === '(' || key === ')') {
    handleBrackets(key);
  }
}

function changeToSymbol(operator) {
  if (operator === '*') return '×';
  else if (operator === '/') return '÷';
  return operator;
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
  entryLine.style.color = '#C5C6C7';
  outputDisplay.style.color = '#A5A6A7';

  entryLine.style.fontSize = '32px';
  entryLine.style.justifyContent = 'flex-start';
  entryLine.textContent = '';

  answer.style.flex = 1;
  ans.textContent = 'Ans:';
  answer.textContent = '';

  openBracketCount = 0;
  closeBracketCount = 0;

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
  if (entryLine.textContent.slice(-1) === '(') {
    openBracketCount--;
  } else if (entryLine.textContent.slice(-1) === ')') {
    closeBracketCount--;
  }
  entryLine.textContent = entryLine.textContent.slice(0, -1);
  updateEntryLength();
}

function handleBrackets(key) {
  if (key === '(') {
    appendToEntryLine(key);
    openBracketCount++;
  } else {
    if (closeBracketCount < openBracketCount) {
      appendToEntryLine(key);
      closeBracketCount++;
    }
  }
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
    let expression = entryLine.textContent.match(REGEX);

    if (validateExpression(expression)) {
      expression = preprocessExpression(expression);
      result = calc.evaluateExpression(expression);

      if (result !== null) {
        answer.textContent = result;
        finishCalculation = true;
      }
    } else {
      error();
    }
  }
}

function preprocessExpression(exp) {
  for (let i = 0; i < exp.length; i++) {
    if (exp[i] === ')') {
      let j = i + 1;
      if (exp[j] === '(') {
        exp.splice(j, 0, '×');
      }
    }
  }
  return exp;
}

function validateExpression(exp) {
  if (!exp || exp.length === 0) return false;

  if (exp[0] === '√' && !isNaN(exp[1])) return true;

  if (calc.operators.includes(exp[0]) || calc.operators.includes(exp[exp.length - 1])) {
    return false;
  }

  let operators = 0;
  let operands = 0;

  for (let i = 0; i < exp.length; i++) {
    const element = exp[i];

    if (calc.operators.includes(element)) {
      operators++;
      // Check for consecutive operators (invalid)
      if (i > 0 && calc.operators.includes(exp[i - 1])) {
        return false;
      }
    } else {
      operands++;
    }
  }

  // The number of operators should be one less than the number of operands
  return operators === operands - 1 || operators < operands;
}

function error() {
  entryLine.style.color = '#66FCF1';
  outputDisplay.style.color = '#66FCF1';

  entryLine.style.fontSize = '26px';
  entryLine.style.justifyContent = 'Center';
  entryLine.textContent = 'Error: Invalid Expression';

  answer.style.flex = 0;
  outputDisplay.style.justifyContent = 'center';
  ans.textContent = '[AC]:';
  answer.textContent = 'Cancel';

  finishCalculation = true;
}


init();

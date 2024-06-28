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
          index--;
        }
        index++;
      }
    }
    // return exp.length === 1 ? parseFloat(exp[0]) : parseFloat(ans.toPrecision(15));
    return parseFloat(ans.toPrecision(12));
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

function parse(exp) {
  const REGEX = /(\d*\.?\d+|[\+\-\×\*\/\÷\^\√\(\)])/g;
  exp = exp.match(REGEX);
  let parsedExp = [];
  for (let i = 0; i < exp.length; i++) {
    if (i === 0 && exp[i] === '-' || exp[i] === '-' && calc.operators.includes(exp[i-1])) {
      exp[i+1] = exp[i] + exp[i+1];
      continue;
    }
    parsedExp.push(exp[i]);
  }
  return parsedExp;
}

// TODO: Modify entry line display: wrap to another line
// TODO: Refactor
const MAX_LENGTH = 19;

let openBracketCount = 0;
let closeBracketCount = 0;
let result = 0;
let bracketBtnCount = 0;
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
}

function setupButtonInput() {
  document.addEventListener('click', handleButtonInput);
}

function handleButtonInput(e) {
  const btn = e.target;
  const type = btn.getAttribute('data-type');
  if (type === 'operation') {
    handleOperationButtons(btn);
  } else if (type === 'function') {
    handleFunctionButtons(btn);
  } else if (type === 'number') {
    handleNumberButtons(btn);
  }
}

function handleOperationButtons(btn) {
  const operation = btn.getAttribute('data-operation');
  if (operation === '√') {
    // let arr = entryLine.textContent.match((REGEX));
    if (finishCalculation) {
      const tempResult = result;
      clearAll();
      appendToEntryLine(tempResult);
    } 
    let arr = parse(entryLine.textContent);
    if (arr[arr.length - 2] !== '√' && entryLine.textContent.length <= 15) {
      if (!isNaN(arr[arr.length - 1])) {
        arr.splice(-1, 0, '√');
        entryLine.textContent = arr.join('');
        updateEntryLength();
      }
    }
  } else if (operation === '+/-') {
    if (!finishCalculation) {
      let arr = parse(entryLine.textContent);
      if (arr.length === 1) {
        arr.splice(0, 0, '-');
        entryLine.textContent = arr.join('');
        updateEntryLength();
        return;
      }

      if (!isNaN(arr[arr.length - 1])) {
        if (!arr[arr.length - 1].startsWith('-')) {
          arr[arr.length - 1] = '-' + arr[arr.length - 1];
        } else if (arr[arr.length - 1].startsWith('-')) {
            arr[arr.length - 1] = arr[arr.length - 1].slice(1, );
        }
        entryLine.textContent = arr.join('');
        updateEntryLength();
      }
    }
  } else if (operation === '(' || operation === ')') {
    handleBrackets(operation);
  } else {
    handleOperatorInput(operation);
  }
}

function handleFunctionButtons(btn) {
  const func = btn.getAttribute('data-function');
  // const arr = entryLine.textContent.match(REGEX);
  
  if (func === 'clear-all') {
    clearAll();
  } else if (func === 'delete') {
    deleteLastEntry();
  } else if (func === 'dot') {
    let arr = parse(entryLine.textContent);
    const recentEntry = entryLine.textContent.slice(-1);
    if (!arr[arr.length-1].includes('.') && recentEntry !== '.') {
      appendToEntryLine('.');
    }
  } else if (func === 'equal') {
    handleEnterInput();
  }
}

function handleNumberButtons(btn) {
  const num = btn.getAttribute('data-number');
  handleNumberInput(num);
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

function clearAll() {
  entryLine.style.color = '#C5C6C7';
  outputDisplay.style.color = '#A5A6A7';

  entryLine.style.fontSize = '26px';
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

function deleteLastEntry() {
  if (finishCalculation) {
    clearAll();
    return;
  }

  if (entryLine.textContent.slice(-1) === '(') {
    openBracketCount--;
  } else if (entryLine.textContent.slice(-1) === ')') {
    closeBracketCount--;
  }
  entryLine.textContent = entryLine.textContent.slice(0, -1);
  updateEntryLength();
}

function handleBrackets(key) {
  if (finishCalculation) clearAll();
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
  if (finishCalculation) {
    const tempResult = result;
    clearAll();
    appendToEntryLine(tempResult);
  } 

  if (!entryLine.textContent) {
    if (key === '-') appendToEntryLine(key);
    return;
  } else if (entryLine.textContent.length === 1 && entryLine.textContent[0] === '-') {
    clearAll();
  }
  
  const recentEntry = entryLine.textContent.slice(-1);
  let arr = parse(entryLine.textContent);
  if ((recentEntry >= '0' && recentEntry <= '9') || recentEntry === ')') {
    appendToEntryLine(key);
  } else if (calc.operators.includes(recentEntry)) {
    if (arr.length === 1 && isNaN(arr[0])) {
      if (key === '+') entryLine.textContent = entryLine.textContent.slice(0, -1) + key;
      else if (key === '-') entryLine.textContent = entryLine.textContent.slice(0, -1) + key;
      return;
    }
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
    if (entry === '^') handleBrackets('(');
  } else if (entryLine.textContent.length === MAX_LENGTH) {
    entryLine.style.fontSize = '23px';
    entryLine.textContent += entry;
  }
  updateEntryLength();
}

function handleEnterInput() {
  if (!finishCalculation) {
    // let expression = entryLine.textContent.match(REGEX);
    let expression = parse(entryLine.textContent);

    if (validateExpression(expression)) {
      expression = preprocessExpression(expression);
      result = calc.evaluateExpression(expression);

      if (isNaN(result)) {
        error();
      } else if (result !== null) {
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
      } else if (exp[j] >= '0' && exp[j] <= 9) {
        exp.splice(j, 0, '×');
      }
    }
  }
  return exp;
}

function validateExpression(exp) {
  if (!exp || exp.length === 0) return false;
  if (exp.length === 1 && !isNaN(exp[1])) return false;

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

  entryLine.style.fontSize = '24px';
  entryLine.style.justifyContent = 'Center';
  entryLine.textContent = 'Error: Invalid Expression';

  answer.style.flex = 0;
  outputDisplay.style.justifyContent = 'center';
  ans.textContent = '[AC]:';
  answer.textContent = 'Cancel';

  finishCalculation = true;
}


init();

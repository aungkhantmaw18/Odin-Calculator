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
          console.log(ans);
          continue;
        }
        while (operatorSet.includes(exp[index])) {
          const op = exp[index];
          const a = +exp[index - 1];
          const b = +exp[index + 1];

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

let result = 0;
let finishCalculation = false;

const outputDisplay = document.querySelector('.output-display');
const entryLine = document.querySelector('.entry-line');
const answer = document.querySelector('.answer');

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
      let lastEntry = arr.splice(-1, 0, '√');
      entryLine.textContent = arr.join('');
    }
  }
}

function setupKeyboardInput() {
  document.addEventListener('keydown', handleKeyboardInput);
}

function handleKeyboardInput(e) {
  const key = e.key;
  console.log(key);
  if (calc.operators.includes(key)) {
    handleOperatorInput(changeToSymbol(key));
  } else if (key >= '0' && key <= '9') {
    handleNumberInput(key);
  } else if (key === 'Enter') {
    handleEnterInput();
  } else if (key === 'Backspace') {
    deleteLastEntry();
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

// function handleEnterInput() {
//   if (!finishCalculation) {
//     const expression = entryLine.textContent.match(REGEX);
//     if (validateExpression(expression)) {
//       result = calc.operate(expression);
//       if (result !== null) {
//         answer.textContent = result;
//         finishCalculation = true;
//       }
//     } else {
//       entryLine.textContent = 'Error: Invalid Expression';
//       entryLine.style.color = 'red';
//       setTimeout(() => {
//         entryLine.textContent = '';
//         entryLine.style.color = 'black';
//         updateEntryLength();
//       }, 2000); // Clear the error message after 2 seconds
//     }
//   }
// }
function handleEnterInput() {
  const expression = entryLine.textContent.match(REGEX);
  result = calc.evaluateExpression(expression);
  answer.textContent = result;
  finishCalculation = true;
}


// function validateExpression(exp) {
//   // Ensure expression is not null or empty
//   if (!exp || exp.length === 0) return false;

//   // Check if the first or last element is an operator (invalid)
//   if (calc.operators.includes(exp[0]) || calc.operators.includes(exp[exp.length - 1])) {
//     return false;
//   }

//   // Track counts of operands and operators
//   let operators = 0;
//   let operands = 0;

//   for (let i = 0; i < exp.length; i++) {
//     const element = exp[i];

//     if (calc.operators.includes(element)) {
//       operators++;
//       // Check for consecutive operators (invalid)
//       if (i > 0 && calc.operators.includes(exp[i - 1])) {
//         return false;
//       }
//     } else {
//       operands++;
//     }
//   }

//   // The number of operators should be one less than the number of operands
//   return operators === operands - 1;
// }


init();

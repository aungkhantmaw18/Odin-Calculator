function Calculator() {
  this.operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '^': (a, b) => a ** b,
  };

  // BODMAS: Bracket Order Divide Multiply Add Subtract
  this.operators = ['^', '/', '*', '+', '-'];

  this.operate = function (arr) {
    let a, b, ans;

    for (let i = 0; i < this.operators.length; i++) {
      let j = 0;

      while (j < arr.length) {
        if (arr.includes(this.operators[i])) {

          let opIndex = arr.indexOf(this.operators[i]);
          let op = arr[opIndex];
          a = +arr[opIndex - 1];
          b = +arr[opIndex + 1];

          ans = this.operations[op](a, b);
          arr.splice(opIndex - 1, 3, ans);
        }

        j++;
      }
    }

    return ans;
  };
}


const calc = new Calculator();
const REGEX = /(\d*\.?\d+|[\+\-\*\/\^])/g;
const MAX_LENGTH = 15;

let result = 0;
let finishCalculation = false;

const entryLine = document.querySelector('.entry-line');
const outputDisplay = document.querySelector('.output-display');

let entryLength;
function updateEntLen() {
  entryLength = entryLine.textContent.length;
}

// Initialize entry length on page load
updateEntLen();

keyboardInput();
clear();

/* ***KEYBOARD INPUT HANDLING*** */
function keyboardInput() {
  document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (calc.operators.includes(key)) {
      operatorInput(key);
    } else if (key >= '0' && key <= '9') {
      numInput(key);
    } else if (e.key === 'Enter') {
      enterInput();
    }
  });
  // backspaceDel();
}

/* ***BUTTONS INPUT HANDLING*** */


// Clear functions
function clear() {
  document.addEventListener('click', (e) => {
    const origin = e.target;
    const func = origin.getAttribute('data-function');
    
    if (func === 'clear-all') {
      clearAll();
    } else if (func === 'delete') {
      deleteLeft();
    }
  })
}

function clearAll() {
  entryLine.textContent = '';
  outputDisplay.textContent = '';
  entryLine.style.fontSize = '32px';
  updateEntLen();
  finishCalculation = false;
}

function clearEntry() {

}

function deleteLeft() {
  let entryTextArray = Array.from(entryLine.textContent); 
  entryTextArray.splice(-1, 1);
  entryLine.textContent = entryTextArray.join('');
  updateEntLen();
}



function operatorInput(key) {
  const operator = key; 
  const recentEntry = entryLine.textContent.slice(-1);

  if (recentEntry >= '0' && recentEntry <= '9') {
    appendEntry(operator);
  } else if (calc.operators.includes(recentEntry)) {
    let entLineArr = entryLine.textContent.split('');
    entLineArr.splice(-1, 1, key);
    entryLine.textContent = entLineArr.join('');
  }
}


function numInput(key) {
  const number = key;
  if (!finishCalculation) {
    appendEntry(number);
  } else {
    clearAll();
    appendEntry(number);
  }
}


// APPEND TO ENTRY LINE
function appendEntry(entry) {
  if (entryLength < 15) {
    entryLine.textContent += entry;
    updateEntLen();
  } else if (entryLength === 15) {
    entryLine.style.fontSize = '30px';
    entryLine.textContent += entry;
    updateEntLen();
  }
}


// KEYBOARD ENTER INPUT
function enterInput() {
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



// BACKSPACE DELETE FEATURE
function backspaceDel() {
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Backspace') {
      entryLine.textContent = '';
    } else if (e.key === 'Backspace') {
      deleteLeft();
    }
  });
}


/* SYMBOLS 
Plus: + (U+002B)
Minus: − (U+2212)
Multiplication: × (U+00D7)
Division: ÷ (U+00F7)
*/

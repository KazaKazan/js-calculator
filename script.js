/* ==ELEMS== */
/* Containers */

/* Buttons */
const ALLBUTTONS = Array.from(document.querySelectorAll("input[type='button']"))
const NUMBERBUTTONS = Array.from(document.querySelectorAll(".number"));
const OPERATORBUTTONS = Array.from(document.querySelectorAll(".operator"));
const FUNCTIONBUTTONS = Array.from(document.querySelectorAll(".function"));
const DISPLAYTOP = document.getElementById("displayTop")
const DISPLAYBOTTOM = document.getElementById("displayBot")

/* ==FUNCTIONS== */
/* Page Preparation */

function addButtonMethod () {
    ALLBUTTONS.forEach(function(element) {
        element.onclick = getButtonValue;
    });
}

/* Operation Functions */
let add = (numA,numB) => numA + numB;
let substract = (numA,numB) => numA - numB;
let multiply = (numA,numB) => numA * numB;

function divide (numA,numB) {
    if (numA === 0 && numB != 0) return 0; /* 0 divided by a number is 0, necessary because otherwise returns undefined. */
    else if (numA === 0 && numB === 0) return "UNDEFINED"; /* 0 divided by 0 is undefined. */
    else if (numB != 0) return numA / numB; /* This one just returns number divided by number. */
    else return("JUST NO."); /* Snarky comment for number divided by 0 as per assignment. */
};

function operate (operationArray) {
    let solution;
    
    if(operationArray.length===2) return operationArray[1];

    switch(operationArray[1]){
        case "+":
            solution = add(operationArray[0],operationArray[2]);
            break
        case "-":
            solution = substract(operationArray[0],operationArray[2]);
            break
        case "*":
            solution = multiply(operationArray[0],operationArray[2]);
            break 
        case "/":
            solution = divide(operationArray[0],operationArray[2]);
            break 
    }

    return solution
};

/* I/O functions & vars */
const textLimit = 17;

let previousValue = "";
let currentValue = "";

let previousState;

function getButtonValue () {
    if (OPERATORBUTTONS.includes(this)) {
        calculatorLogic(this.value,this.className);
    }
    else {
        calculatorLogic(this.id,this.className);
    }
}

/* Will check a given string to see if it contains operators. Excludes optional arguments from search. */
function checkString (string) {
    const opArray = [".","+","-","*","/"];
    let excArray = Array.from(arguments);
    excArray.shift();
    for (let i = 0; i < opArray.length; i++) {
        if (excArray.includes(opArray[i])) {
            continue;
        }
        else if (string.includes(opArray[i])) {
            return true
        }
    }
    return false
};

function trimAndRound () {

};

/* The main calculator logic. Handles the button presses and sends the inputs to the respective functions. */
function calculatorLogic(inputValue,inputOperation) {
    switch(inputOperation){
        /* If the button pressed is a number button, check if the last press was the = operator. */
        /* If the above condition is true, start inputting the new value, if not, continue inputting the current value. */
        /* Also checks for input length */
        case "number":
            if (previousState === "operated"){
                currentValue = "";
                currentValue += inputValue
            }
            else if (currentValue.length < textLimit){
                currentValue += inputValue;
            };
            previousState = inputOperation;
            break
        /* If the button pressed is an operator, check its value. If it's the equals button, carry out the operation. */
        /* Decimal doesn't change calculator state. Also doesn't insert itself if the current value has a decimal.*/
        /* Other operators will act like = if the previous value has an operator. */
        case "operator":
            switch(inputValue){
                case ".":
                    if(checkString(currentValue)) break;
                    currentValue += `${inputValue}`;
                    break
                case "=":
                    let opArray = previousValue.split(" ");
                    opArray[0] = Number(opArray[0])
                    opArray.push(Number(currentValue));
                    currentValue = operate(opArray);
                    previousValue = "";
                    previousState = "operated";
                    break
                default:
                    if (previousState != inputOperation){
                        if (checkString(previousValue,".")) {
                            calculatorLogic("=","operator")
                        }; 
                        previousValue = currentValue + ` ${inputValue}`;
                        currentValue = ""
                        previousState = inputOperation;
                }
                    break
            }
            break
        /* Function Buttons */
            case "function":
                if (inputValue == "clear"){
                    previousValue = "";
                    currentValue = "";
                    previousState = "";
                }
                else {
                    currentValue = currentValue.slice(0,-1)
                }
    }
    DISPLAYTOP.textContent = previousValue;
    DISPLAYBOTTOM.textContent = currentValue;
}

/* TEST STUFF */

/* SCRIPT BODY */

addButtonMethod()
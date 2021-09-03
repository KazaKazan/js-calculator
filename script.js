/* ==ELEMS== */
/* Containers */

/* Buttons */
const ALLBUTTONS = Array.from(document.querySelectorAll("input[type='button']"))
const OPERATORBUTTONS = Array.from(document.querySelectorAll(".operator"));
const INFOBUTTON = document.getElementById("infoButton");
const DISPLAYTOP = document.getElementById("displayTop")
const DISPLAYBOTTOM = document.getElementById("displayBot")

/* ==FUNCTIONS== */
/* Page Preparation */
window.onresize = sizeLimiter;

function addButtonMethod () {
    ALLBUTTONS.forEach(function(element) {
        if (element === INFOBUTTON) element.onclick = toggleCard;
        else element.onclick = getButtonValue;
    });
};

document.addEventListener("keydown", function(event){
    let button = findButton(event.key);
    if (button != null){
        button.onclick();
        button.classList.add("active")
    }
});

document.addEventListener("keyup", function(event){
    let button = findButton(event.key);
    if (button != null){
        button.classList.remove("active")
    }
});

/* Operation Functions */
let add = (numA,numB) => numA + numB;
let substract = (numA,numB) => numA - numB;
let multiply = (numA,numB) => numA * numB;

function divide (numA,numB) {
    if (numA === 0 && numB != 0) return 0; /* 0 divided by a number is 0, necessary because otherwise returns undefined. */
    else if (numA === 0 && numB === 0) return "NOT RAD!"; /* 0 divided by 0 is undefined. */
    else if (numB != 0) return numA / numB; /* This one just returns number divided by number. */
    else divideByZero(); /* Division by zero easter egg. */
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
    };

    return solution
};

/* I/O functions & vars */
let textLimit = 17;

let previousValue = "";
let currentValue = "";

let previousState;

function getButtonValue () {
    if (OPERATORBUTTONS.includes(this)) {
        calculatorLogic(this.value,this.className);
    }
    else {
        calculatorLogic(this.id,this.className);
    };
};

function findButton (key) {
    let button = null;
    if (!Number.isNaN(Number(key)) || checkString(key,"=")) button = document.getElementById(key);
    else {
        switch(key){
            case "Enter":
                button = document.getElementById("operate");
                break
            case "Backspace":
                button = document.getElementById("remove");
                break
            case "Delete":
                button = document.getElementById("clear");
                break
        }
    }
    return button
}

function sizeLimiter () {
    if(window.innerWidth <= 500) {
        textLimit = 9;
    }
    else textLimit = 13;
};

function toggleCard() {
    const calcFrame = document.getElementById("calculatorFrame");
    const infoFrame = document.getElementById("infoFrame");

    calcFrame.classList.toggle("hidden");
    console.log(calcFrame)
    infoFrame.classList.toggle("hidden");
    console.log(infoFrame)
};

/* Calculator Functions */

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
        };
    };
    return false
};

function trimAndRound () {
    let valType = typeof currentValue
    if (valType === "number"){
        if (currentValue.toString().length > textLimit){
            currentValue = currentValue.toExponential(2)
        };
    };
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
                    if(isNaN(opArray[0])){
                        currentValue = "DUDE NOT COOL!"
                        break
                    }
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
                };
                    break
            };
            break
        /* Function Buttons */
            case "function":
                if (inputValue == "clear"){
                    previousValue = "";
                    currentValue = "";
                    previousState = "";
                }
                else {
                    if(previousState != "operated" && typeof currentValue === "string") currentValue = currentValue.slice(0,-1);
                };
    };

    trimAndRound()

    DISPLAYTOP.textContent = previousValue;
    DISPLAYBOTTOM.textContent = currentValue;
}

/* EASTER EGG */

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
};

function divideByZero() {
    const mainDiv = document.getElementById("main");
    const animDiv = document.getElementById("animation");
    mainDiv.classList.add("downscale");
    wait(1000).then(() => mainDiv.style.setProperty("display","none"));
    wait(1500).then(() => animDiv.style.setProperty("display","flex"));
    wait(1600).then(() => animDiv.style.setProperty("transform","scale(1)"))
}

/* SCRIPT BODY */
addButtonMethod()
sizeLimiter()
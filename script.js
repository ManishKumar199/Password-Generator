const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const upperCheck = document.querySelector("#uppercase");
const lowerCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_+=-,./[{]}<?>|?/';


// initially

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

//set strength color 
setIndicator("#ccc");

//set passwordLength

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRanNum() {
    return getRandomInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (upperCheck.checked) hasUpper = true;
    if (lowerCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    // to make copy span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    //fisher yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    })

    //special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value);
    copyContent();
})

generateBtn.addEventListener('click', () => {
    //None of the checkbox are selected
    if (checkCount <= 0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //Let's find new password
    console.log("Starts Here")
    //Remove old passsword
    password = "";

    let funcArr = [];

    if (upperCheck.checked)
        funcArr.push(generateUpperCase);

    if (lowerCheck.checked)
        funcArr.push(generateLowerCase);

    if (numberCheck.checked)
        funcArr.push(generateRanNum);

    if (symbolCheck.checked)
        funcArr.push(generateSymbol);


    //Compulsory addition

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();

    }
    console.log("Compulsory done");

    //Remaining addtion
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRandomInteger(0, funcArr.length);
        console.log("randIndex" + randIndex);

        password += funcArr[randIndex]();
    }
    console.log("Remaining done");

    // Shuffle the password
    password = shufflePassword(Array.from(password));

    // Show in UI
    passwordDisplay.value = password;
    // Calculate strength
    calcStrength();

});





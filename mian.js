const progress_line = document.getElementById('progress-line');
//let passLab = document.getElementById('passLab');
let passPara = document.getElementById('passPara');

// ceate the progress bar
for (let i = 0; i < 6; i++) {
    const progress_bar = document.createElement('div');
    progress_bar.style.width = `25px`;
    progress_bar.style.height = `20px`
    progress_bar.style.margin = `4px`;
    progress_bar.style.border = `1px solid black`;
    progress_bar.style.borderRadius = `5px`;
    progress_bar.style.backgroundColor = `white`;
    progress_bar.className = `progress-bar-${i}`;
    progress_line.appendChild(progress_bar);
}


// create function to rest progress bar
function resetProgressBar() {
    for (let i = 0; i < 6; i++) {
        const progress_bar = document.querySelector(`.progress-bar-${i}`);
        progress_bar.style.backgroundColor = `white`;
    }
}

const entropyThreshold = 36;
const varianceThreshold = 400; 

// Function to calculate entropy of a password
function calculateEntropy(password) {
    const uniqueCharacters = [...new Set(password)];
    const passwordLength = password.length;
    const characterSetSize = uniqueCharacters.length;

    // Calculate entropy using the formula: H = log2(S^L)
    const entropy = Math.log2(Math.pow(characterSetSize, passwordLength));

    return entropy;
}

// Function to calculate variance of a password
function calculateVariance(password) {
    const passwordLength = password.length;

    // Calculate the mean of the ASCII values of characters in the password
    const mean = password.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) / passwordLength;

    // Calculate the sum of squared differences from the mean
    const squaredDifferencesSum = password.split('').reduce((sum, char) => {
        const diff = char.charCodeAt(0) - mean;
        return sum + diff * diff;
    }, 0);

    // Calculate the variance using the formula: Variance = sum of squared differences / N
    const variance = squaredDifferencesSum / passwordLength;

    return variance;
}

function containsAllProperties(inputString) {
    // Check for numbers, capital letters, and special characters
    var containsNumber = /\d/.test(inputString);
    var containsCapitalLetter = /[A-Z]/.test(inputString);
    var containsSpecialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(inputString);

    // Return true only if all conditions are met
    return containsNumber && containsCapitalLetter && containsSpecialCharacter;
}

let password_suggestions = {}


// function to check if password weak 
function isWeak(password) {
    let is_weak = false;
    // check is password contain capital letter, special character and number
    if (!containsAllProperties(password)) {
        password_suggestions['password_rules'] = "please make sure your password contain capital letter, special character and numbers";
        is_weak = true;
        passPara.innerHTML="please make sure your password contain capital letter, special character and numbers";
    }
    // check if length of password is less than 5
    if (password.length <= 4) {
        password_suggestions['password_length'] = 'please make sure your password is at least 5 characters long';
        is_weak = true;
        passPara.innerHTML="please make sure your password is at least 5 characters long";
    }
    const entropy = calculateEntropy(password);
    const variance = calculateVariance(password);
    console.log(entropy, variance);
    if (entropy < entropyThreshold && variance < varianceThreshold) {
        password_suggestions['password_complexity'] = 'please make sure your password is complex enough, try adding more characters';
        is_weak = true;
        passPara.innerHTML="please make sure your password is complex enough, try adding more characters";
    }
    return is_weak;
}
// Function to check if password is medium
function isMedium(password) {
    let is_medium = false;
    // check if length of password is between 5 and 7
    if (password.length > 4 && password.length < 8) {
        password_suggestions['password_length'] = 'password length is good, but try adding more characters to make it stronger';
        is_medium = true;
        passPara.innerHTML = "password length is good, but try adding more characters to make it stronger";
    }
    const entropy = calculateEntropy(password);
    const variance = calculateVariance(password);
    if ((entropy >= entropyThreshold && entropy < entropyThreshold + 14)|| (variance >= varianceThreshold && variance < varianceThreshold + 200)) {
        password_suggestions['password_complexity'] = 'password complexity is good, but try adding more characters to make it stronger';
        is_medium = true;
        passPara.innerHTML = "password complexity is good, but try adding more characters to make it stronger";
    }
    return is_medium;
}

// Function to check if password is strong
function isStrong(password) {
    let is_strong = false;
    const entropy = calculateEntropy(password);
    const variance = calculateVariance(password);
    if (entropy >= entropyThreshold + 14 || variance >= varianceThreshold + 200) {
        password_suggestions['password_complexity'] = 'Your password is strong, good job!, password with large entropy and variance are hard to crack';
        is_strong = true;
        passPara.innerHTML = "Your password is strong, good job!, password with large entropy and variance are hard to crack";
    }
    return is_strong;
}


// Function to assess password strength based on complexity rules
function assessPasswordStrength(password) {

    if (isWeak(password)) {
        return 'weak';
    }
    if (isMedium(password)) {
        return 'medium';
    }
    if (isStrong(password)) {
        return 'strong';
    }
}


// create function to customize the progress bar
function customizeProgressBar(password_type) {
    const strength_text = document.getElementById('strength-text');
    if (password_type == 'strong') {
        strength_text.innerText = `Strong`;
        strength_text.style.color = `green`;
        for (let i = 0; i < 6; i++) {
            const progress_bar = document.querySelector(`.progress-bar-${i}`);
            progress_bar.style.backgroundColor = `green`;
        }
    } else if (password_type == 'medium') {
        strength_text.innerText = `Meduim`;
        strength_text.style.color = `orange`;
        for (let i = 0; i < 4; i++) {
            const progress_bar = document.querySelector(`.progress-bar-${i}`);
            progress_bar.style.backgroundColor = `orange`;
        }
    } else if (password_type == 'weak') {
        strength_text.innerText = `Weak`;
        strength_text.style.color = `red`;
        for (let i = 0; i < 2; i++) {
            const progress_bar = document.querySelector(`.progress-bar-${i}`);
            progress_bar.style.backgroundColor = `red`;
        }
    } 
}


const form = document.getElementById('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    resetProgressBar();
    const password = form.password.value;
    let password_type =  assessPasswordStrength(password);
    customizeProgressBar(password_type);
});



// create show password button
const input_icon = document.querySelector('.input-icon');
const input = document.getElementById('password-input');

input_icon.addEventListener('click', () => {
    if (input.type === 'password') {
        input.type = 'text';
        input_icon.className = 'fa fa-eye-slash input-icon';
    } else {
        input.type = 'password';
        input_icon.className = 'fa fa-eye input-icon';
    }
});


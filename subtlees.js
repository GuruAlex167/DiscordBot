// subtleTest.js

// 1. Using loose equality instead of strict equality (eqeqeq rule)
function compareValues(a, b) {
    if (a == b) { // Should use ===
        return true
    }
    return false
}

// 2. Declaring a variable with var (no-var rule) and leaving it unused (no-unused-vars rule)
var unusedVar = 'I am not used anywhere';

// 3. A function that logs a message (potential no-console rule)
//    and processes an array in a slightly inconsistent way.
function doSomething() {
    console.log('Processing numbers...'); // might be flagged if no-console is enforced

    const numbers = [1, 2, 3];
    numbers.forEach(num => {
        // Inconsistent return behavior can trigger consistent-return rules in some setups:
        if (num === 2) {
            // No explicit return value here.
            return;
        }
        console.log('Number:', num);
    });
}

// 4. An arrow function that has an inconsistent return behavior, triggering consistent-return.
const subtleArrow = x => {
    if (x > 10) {
        return x * 2;
    } else {
        console.log('x is too small');
        // No return value here.
    }
};

// 5. A function that is defined but never used (unused function error).
function unusedFunction() {
    return 'I am defined but never called';
}

export { compareValues, doSomething, subtleArrow };

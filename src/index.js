function eval() {
    // Do not use eval!!!
    return;
}

const isOpenBracket = s => s === '(';
const isCloseBracket = s => s === ')';
const isSign = s => ['+', '-', '*', '/'].indexOf(s) !== -1;
const execOperation = (op1, sign, op2) => {
    const num1 = Number(op1);
    const num2 = Number(op2);
    switch (sign) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            if (num2 === 0) {
                throw new TypeError('TypeError: Division by zero.');
            }
            return num1 / num2;
    }
}

const calcSimpleExp = expr => {
    while (expr.indexOf('*') !== -1 || expr.indexOf('/') !== -1) {
        const multiplySignPos = expr.indexOf('*') === -1 ? Infinity : expr.indexOf('*');
        const divisionSignPos = expr.indexOf('/') === -1 ? Infinity : expr.indexOf('/')
        const signPos = Math.min(multiplySignPos, divisionSignPos);
        const operation = expr.slice(signPos - 1, signPos + 2);
        expr.splice(signPos - 1, 3, execOperation(...operation));
    }
    while (expr.length > 1) {
        const operation = expr.slice(0, 3);
        expr.splice(0, 3, execOperation(...operation));
    }
    return expr[0];
}

const parseExpr = str => {
    const result = [];
    let digits = '';

    for (let i = 0; i < str.length; i++) {
        const s = str[i];
        if (isOpenBracket(s) || isCloseBracket(s) || isSign(s) || s === ' ') {
            if (digits !== '') {
                result.push(digits);
                digits = '';
            }
            if (s !== ' ') {
                result.push(s);
            }
        } else {
            digits += s;
        }
    }

    if (digits !== '') {
        result.push(digits);
    }

    return result;
}

function expressionCalculator(expr) {
    const arr = parseExpr(expr);

    while (arr.lastIndexOf('(') !== -1) {
        const exprStart = arr.lastIndexOf('(');
        const exprEnd = arr.indexOf(')', exprStart);
        if (exprEnd === -1) {
            throw new Error('ExpressionError: Brackets must be paired');
        }
        const simpleExp = arr.slice(exprStart + 1, exprEnd);
        arr.splice(exprStart, simpleExp.length + 2, calcSimpleExp(simpleExp));
    }

    if (arr.indexOf(')') !== -1) {
        throw new Error('ExpressionError: Brackets must be paired');
    }

    return calcSimpleExp(arr);
}

module.exports = {
    expressionCalculator
}
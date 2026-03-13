export interface SecurityChallenge {
    question: string;
    answer: string;
}

export function generateSecurityChallenge(): SecurityChallenge {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operators = ['+', '-'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let question = '';
    let answer = '';

    if (operator === '+') {
        question = `What is ${num1} + ${num2}?`;
        answer = (num1 + num2).toString();
    } else {
        // Ensure result is positive for simplicity
        const [a, b] = num1 >= num2 ? [num1, num2] : [num2, num1];
        question = `What is ${a} - ${b}?`;
        answer = (a - b).toString();
    }

    return { question, answer };
}

export type Operator = '+' | '-' | '×' | '÷'

// Rundet auf 10 Nachkommastellen, damit 0.1 + 0.2 = 0.3 ergibt (statt 0.30000000000000004)
function round(value: number): number {
  return Number(value.toFixed(10))
}

export function calculate(a: number, operator: Operator, b: number): number {
  switch (operator) {
    case '+':
      return round(a + b)
    case '-':
      return round(a - b)
    case '×':
      return round(a * b)
    case '÷':
      if (b === 0) {
        throw new Error('Cannot divide by zero')
      }
      return round(a / b)
  }
}
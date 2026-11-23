export type Operator = '+' | '-' | '×' | '÷'

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

export function power(base: number, exponent: number): number {
  return round(base ** exponent)
}

export function root(x: number, degree: number): number {

  if (degree === 0 || (x < 0 && degree % 2 === 0)) {
    throw new Error('Invalid input')
  }
  return round(Math.sign(x) * Math.abs(x) ** (1 / degree))
}
import { useEffect, useState } from "react";
import { calculate, type Operator } from "../calculator.ts";
import "./Calculator.css";

type Plan = "free" | "premium" | "ultra";

const KEYPAD_BUTTONS = [
  "7",
  "8",
  "9",
  "÷",
  "4",
  "5",
  "6",
  "×",
  "1",
  "2",
  "3",
  "-",
  "0",
  ".",
  "C",
  "+",
  "=",
];

const SCIENTIFIC_BUTTONS = [
  "sin",
  "cos",
  "tan",
  "√",
  "x²",
  "xʸ",
  "ʸ√x",
  "x!",
  "RAD/DEG",
];

const PREMIUM_BUTTONS = ["xʸ", "ʸ√x", "x!"];

const OPERATORS: Operator[] = ["+", "-", "×", "÷"];

const KEYBOARD_TO_BUTTON: Record<string, string> = {
  "*": "×",
  "/": "÷",
  Enter: "=",
  Escape: "C",
};

function isOperator(button: string): button is Operator {
  return OPERATORS.includes(button as Operator);
}

function Calculator({ plan }: { plan: Plan }) {
  const [activeTab, setActiveTab] = useState<"calculator" | "graph">(
    "calculator",
  );

  const [firstNumber, setFirstNumber] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [currentInput, setCurrentInput] = useState("");
  const [result, setResult] = useState("0");
  const [lastExpression, setLastExpression] = useState<string | null>(null);

  const isFreeUser = plan === "free";
  const isUltraUser = plan === "ultra";

  function clear() {
    setFirstNumber(null);
    setOperator(null);
    setCurrentInput("");
    setResult("0");
    setLastExpression(null);
  }

  function pressDigit(digit: string) {
    if (digit === "." && currentInput.includes(".")) {
      return;
    }
    if (operator === null) {
      setFirstNumber(null);
    }
    setCurrentInput(currentInput + digit);
    setLastExpression(null);
  }

  function pressOperator(nextOperator: Operator) {
    if (currentInput === "") {
      if (firstNumber !== null) {
        setOperator(nextOperator);
      }
    } else if (firstNumber !== null && operator !== null) {
      pressEquals();
      setOperator(nextOperator);
    } else {
      setFirstNumber(Number(currentInput));
      setOperator(nextOperator);
      setCurrentInput("");
    }
    setLastExpression(null);
  }

  function pressEquals() {
    if (firstNumber === null || operator === null || currentInput === "") {
      return;
    }

    const secondNumber = Number(currentInput);
    setLastExpression(`${firstNumber} ${operator} ${secondNumber}`);

    try {
      const answer = calculate(firstNumber, operator, secondNumber);
      setResult(String(answer));
      setFirstNumber(answer);
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Error");
      setFirstNumber(null);
    }

    setOperator(null);
    setCurrentInput("");
  }

  function pressBackspace() {
    if (lastExpression !== null) {
      setFirstNumber(null);
    }
    setCurrentInput(currentInput.slice(0, -1));
    setLastExpression(null);
  }

  function pressButton(button: string) {
    if (button === "C") {
      clear();
    } else if (button === "=") {
      pressEquals();
    } else if (button === "Backspace") {
      pressBackspace();
    } else if (isOperator(button)) {
      pressOperator(button);
    } else if (/^[0-9.]$/.test(button)) {
      pressDigit(button);
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter") {
        event.preventDefault();
      }
      pressButton(KEYBOARD_TO_BUTTON[event.key] ?? event.key);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const inputText = [firstNumber, operator, currentInput]
    .filter((part) => part !== null && part !== "")
    .join(" ");

  return (
    <main className="calc">
      <nav>
        <button onClick={() => setActiveTab("calculator")}>Calculator</button>
        <button disabled={!isUltraUser} onClick={() => setActiveTab("graph")}>
          Graph {!isUltraUser && "🔒"}
        </button>
      </nav>

      {activeTab === "graph" && <p>Graph</p>}

      {activeTab === "calculator" && (
        <>
          <div className="display">
            <div className="input">{lastExpression ?? (inputText || "0")}</div>
            <div className="result">{result}</div>
          </div>

          <details open>
            <summary>Scientific</summary>
            <div className="grid">
              {SCIENTIFIC_BUTTONS.map((button) => {
                const isLocked = isFreeUser && PREMIUM_BUTTONS.includes(button);

                return (
                  <button key={button} disabled={isLocked}>
                    {button} {isLocked && "🔒"}
                  </button>
                );
              })}
            </div>
          </details>

          <div className="grid">
            {KEYPAD_BUTTONS.map((button) => (
              <button key={button} onClick={() => pressButton(button)}>
                {button}
              </button>
            ))}
          </div>

          <section className="history">
            <h3>History</h3>
          </section>
        </>
      )}
    </main>
  );
}

export default Calculator;

// src/components/GuidedStepView.tsx

import { useState } from 'react';
import type { GuidedStep } from '../types/scenario';
import { validateCommand } from '../utils/validation';
import './GuidedStepView.css';

interface GuidedStepViewProps {
  step: GuidedStep;
  isCompleted: boolean;
  onComplete: (stepOrder: number) => void;
}

type Status = 'idle' | 'correct' | 'incorrect';

export function GuidedStepView({
  step,
  isCompleted,
  onComplete,
}: GuidedStepViewProps) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isCompleted) return;

    const correct = validateCommand(input, step);

    if (correct) {
      setStatus('correct');
      onComplete(step.order);
    } else {
      setStatus('incorrect');
    }
  };

  const handleReset = () => {
    setInput('');
    setStatus('idle');
  };

  const containerClass = [
    'guided-step',
    isCompleted && 'guided-step--completed',
    status === 'incorrect' && !isCompleted && 'guided-step--incorrect',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClass}>
      <div className="guided-step__head">
        <span
          className={`guided-step__number${
            isCompleted ? ' guided-step__number--completed' : ''
          }`}
        >
          {isCompleted ? '✓' : step.order}
        </span>
        <p className="guided-step__prompt">{step.prompt}</p>
      </div>

      {!isCompleted && (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="guided-step__input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (status !== 'idle') setStatus('idle');
              }}
              placeholder="Type your CLI command here..."
              autoComplete="off"
              spellCheck={false}
            />
            <div className="guided-step__actions">
              <button type="submit" className="btn btn--primary">
                Submit Command
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setShowHint((v) => !v)}
              >
                {showHint ? 'Hide Hint' : 'Need a Hint?'}
              </button>
            </div>
          </form>

          {showHint && (
            <div className="guided-step__hint">
              <strong>Hint: </strong>
              {step.hint}
            </div>
          )}

          {status === 'incorrect' && (
            <div className="guided-step__error">
              Not quite. Check your command syntax, or try the hint.
            </div>
          )}
        </>
      )}

      {isCompleted && (
        <div className="guided-step__correct">
          <span>
            <strong>Correct:</strong> <code>{step.expectedCommand}</code>
          </span>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={handleReset}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
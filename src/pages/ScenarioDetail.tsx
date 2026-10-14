// src/pages/ScenarioDetail.tsx

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getScenarioById } from '../data/scenarios';
import { GuidedStepView } from '../components/GuidedStepView';
import { difficultyLabel } from '../utils/difficulty';
import { useProgress } from '../hooks/useProgress';
import './ScenarioDetail.css';

export function ScenarioDetail() {
  const { id } = useParams<{ id: string }>();
  const scenario = id ? getScenarioById(id) : undefined;

  const { getScenarioProgress, completeStep, completeScenario, resetScenario } =
    useProgress();

  const scenarioProgress = id
    ? getScenarioProgress(id)
    : { completed: false, completedSteps: [], lastAttempt: '' };

  useEffect(() => {
    if (!scenario || !id) return;

    const allDone =
      scenarioProgress.completedSteps.length === scenario.steps.length;

    if (allDone && !scenarioProgress.completed) {
      completeScenario(id);
    }
  }, [
    scenario,
    id,
    scenarioProgress.completed,
    scenarioProgress.completedSteps.length,
    completeScenario,
  ]);

  if (!scenario) {
    return (
      <div className="not-found">
        <h1 className="not-found__title">Scenario not found</h1>
        <p className="not-found__body">
          The scenario ID "{id}" does not exist in the library.
        </p>
        <Link to="/" className="back-link">
          ← Back to scenarios
        </Link>
      </div>
    );
  }

  const totalSteps = scenario.steps.length;
  const completedSteps = scenarioProgress.completedSteps;
  const completedCount = completedSteps.length;
  const allCompleted = completedCount === totalSteps;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const handleStepComplete = (stepOrder: number) => {
    if (!id) return;
    completeStep(id, stepOrder);
  };

  const handleReset = () => {
    if (!id) return;
    if (
      window.confirm('Reset progress for this scenario? This cannot be undone.')
    ) {
      resetScenario(id);
    }
  };

  return (
    <div className="page page--narrow">
      <Link to="/" className="back-link">
        ← Back to scenarios
      </Link>

      <header className="scenario-header">
        <div className="meta-row">
          <span className="topic-label">{scenario.topic}</span>
          <span className={`badge badge--${scenario.difficulty}`}>
            {difficultyLabel[scenario.difficulty]}
          </span>
          {scenarioProgress.completed && (
            <span className="badge badge--completed">✓ Completed</span>
          )}
        </div>

        <h1 className="scenario-header__title">{scenario.title}</h1>
      </header>

      <section className="symptoms-panel">
        <h2 className="symptoms-panel__title">Reported Symptoms</h2>
        <ul className="symptoms-list">
          {scenario.symptoms.map((symptom, i) => (
            <li key={i}>{symptom}</li>
          ))}
        </ul>
      </section>

      <div className="progress-block">
        <div className="progress-block__meta">
          <span className="progress-block__label">Progress</span>
          <span>
            {completedCount} / {totalSteps} steps ({progressPercent}%)
          </span>
        </div>
        <div className="progress-block__bar">
          <div
            className={`progress-block__fill${
              allCompleted ? ' progress-block__fill--completed' : ''
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <section className="steps-section">
        <div className="steps-section__head">
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Guided Troubleshooting Path
          </h2>
          {(completedCount > 0 || scenarioProgress.completed) && (
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={handleReset}
            >
              Reset Progress
            </button>
          )}
        </div>

        <div className="steps-list">
          {scenario.steps.map((step) => (
            <GuidedStepView
              key={step.order}
              step={step}
              isCompleted={completedSteps.includes(step.order)}
              onComplete={handleStepComplete}
            />
          ))}
        </div>
      </section>

      {allCompleted && (
        <section className="root-cause-panel">
          <h2 className="root-cause-panel__title">
            ✓ Scenario Complete — Root Cause
          </h2>
          <p className="root-cause-panel__body">{scenario.rootCause}</p>
        </section>
      )}
    </div>
  );
}
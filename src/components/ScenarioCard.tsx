// src/components/ScenarioCard.tsx

import { Link } from 'react-router-dom';
import type { Scenario } from '../types/scenario';
import { difficultyLabel } from '../utils/difficulty';
import { useProgress } from '../hooks/useProgress';
import { useLicense } from '../hooks/useLicense';
import './ScenarioCard.css';

interface ScenarioCardProps {
  scenario: Scenario;
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  const { getScenarioProgress } = useProgress();
  const { isPremium } = useLicense();

  const progress = getScenarioProgress(scenario.id);
  const isLocked = scenario.premium && !isPremium;

  const totalSteps = scenario.steps.length;
  const completedCount = progress.completedSteps.length;
  const percent = Math.round((completedCount / totalSteps) * 100);
  const inProgress = completedCount > 0 && !progress.completed;

  const progressMetaClass = progress.completed
    ? 'scenario-card__progress-meta--completed'
    : inProgress
      ? 'scenario-card__progress-meta--in-progress'
      : 'scenario-card__progress-meta--not-started';

  const cardClass = [
    'scenario-card',
    progress.completed && !isLocked && 'scenario-card--completed',
    isLocked && 'scenario-card--locked',
  ]
    .filter(Boolean)
    .join(' ');

  const progressLabel = isLocked
    ? '🔒 Premium'
    : progress.completed
      ? '✓ Completed'
      : inProgress
        ? `In Progress — ${completedCount}/${totalSteps}`
        : 'Not started';

  const CardWrapper = isLocked
    ? ({ children }: { children: React.ReactNode }) => (
        <div className={cardClass} aria-disabled="true">
          {children}
        </div>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <Link to={`/scenario/${scenario.id}`} className={cardClass}>
          {children}
        </Link>
      );

  return (
    <CardWrapper>
      <div className="scenario-card__top">
        <span className="topic-label">{scenario.topic}</span>
        <span className={`badge badge--${scenario.difficulty}`}>
          {difficultyLabel[scenario.difficulty]}
        </span>
      </div>

      <h3 className="scenario-card__title">{scenario.title}</h3>

      <p className="scenario-card__symptom">{scenario.symptoms[0]}</p>

      <div>
        <div className={`scenario-card__progress-meta ${progressMetaClass}`}>
          <span>{progressLabel}</span>
          <span>{isLocked ? '' : `${percent}%`}</span>
        </div>
        <div className="scenario-card__progress-bar">
          <div
            className={`scenario-card__progress-fill${
              progress.completed && !isLocked
                ? ' scenario-card__progress-fill--completed'
                : ''
            }`}
            style={{ width: isLocked ? '100%' : `${percent}%` }}
          />
        </div>
      </div>
    </CardWrapper>
  );
}
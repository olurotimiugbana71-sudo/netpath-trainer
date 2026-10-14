// src/pages/ScenarioSelector.tsx

import { Link } from 'react-router-dom';
import { scenarios } from '../data/scenarios';
import { ScenarioCard } from '../components/ScenarioCard';
import { useProgress } from '../hooks/useProgress';
import { useLicense } from '../hooks/useLicense';
import './ScenarioSelector.css';

export function ScenarioSelector() {
  const { progress, resetAll } = useProgress();
  const { isPremium, license } = useLicense();

  const completedCount = Object.values(progress).filter(
    (p) => p.completed
  ).length;
  const totalCount = scenarios.length;

  const handleResetAll = () => {
    if (
      window.confirm(
        'Reset ALL progress across every scenario? This cannot be undone.'
      )
    ) {
      resetAll();
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">NetPath Trainer</h1>
        <p className="page-tagline">
          Don't just configure. Diagnose. Pick a scenario, follow the guided
          troubleshooting path, and master real-world fault diagnosis.
        </p>

        <div className="selector-header-actions">
          <span className="stat-pill">
            {completedCount} / {totalCount} completed
          </span>

          {isPremium ? (
            <span className="stat-pill stat-pill--premium">
              ✓ Premium ({license?.tier === 'team' ? 'Team' : 'Personal'})
            </span>
          ) : (
            <Link to="/activate" className="btn btn--primary btn--sm">
              🔓 Activate Premium
            </Link>
          )}

          {completedCount > 0 && (
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={handleResetAll}
            >
              Reset All Progress
            </button>
          )}
        </div>
      </header>

      <section>
        <h2 className="section-title">Available Scenarios</h2>

        <div className="card-grid">
          {scenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </div>
      </section>
    </div>
  );
}
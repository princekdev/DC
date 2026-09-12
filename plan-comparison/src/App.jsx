import { useMemo, useState } from "react";
import DiffToggle from "./components/DiffToggle";
import ComparisonTable from "./components/ComparisonTable";
import { plans } from "./data/plans";
import { featureGroups } from "./data/features";
import { isSameAcrossPlans } from "./utils/featureUtils";
import "./styles/App.css";

function App() {
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

  const { totalCount, differingCount } = useMemo(() => {
    const allItems = featureGroups.flatMap((group) => group.items);
    return {
      totalCount: allItems.length,
      differingCount: allItems.filter((item) => !isSameAcrossPlans(item)).length,
    };
  }, []);

  return (
    <div className="page">
      <a className="skip-link" href="#comparison">
        Skip to comparison table
      </a>

      <header className="hero">
        <p className="hero__eyebrow">Pricing</p>
        <h1 className="hero__title">Compare Lattice plans</h1>
        <p className="hero__subtitle">
          Basic, Pro, and Premium side by side, across storage, collaboration, security, and
          support. Switch on differences only to skip the features every plan already shares.
        </p>
      </header>

      <section className="controls" aria-label="Comparison options">
        <DiffToggle pressed={showDifferencesOnly} onChange={setShowDifferencesOnly} />
        <p className="controls__status" role="status">
          {showDifferencesOnly
            ? `Showing ${differingCount} of ${totalCount} features that differ between plans.`
            : `Showing all ${totalCount} features.`}
        </p>
      </section>

      <main id="comparison" className="comparison" tabIndex={-1}>
        <ComparisonTable
          plans={plans}
          featureGroups={featureGroups}
          showDifferencesOnly={showDifferencesOnly}
        />
      </main>

      <footer className="page-footer">
        <p>
          Prices shown in USD. Need something in between? Every plan can be upgraded or
          downgraded at any time.
        </p>
      </footer>
    </div>
  );
}

export default App;

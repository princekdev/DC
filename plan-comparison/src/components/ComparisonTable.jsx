import { isSameAcrossPlans, formatValue } from "../utils/featureUtils";

/**
 * Renders the plan comparison as one real <table>.
 *
 * The same markup serves both the desktop grid layout and the mobile
 * stacked-card layout: CSS alone switches the presentation (see
 * ComparisonTable.css). To keep the table's row/column relationships
 * available to screen readers even after CSS turns rows into blocks,
 * every structural element also carries the matching ARIA table role
 * (role="table", role="rowgroup", role="row", role="columnheader",
 * role="rowheader", role="cell"). This is the standard technique for
 * responsive tables: changing `display` can make browsers drop the
 * implicit table semantics, so the explicit roles restore them.
 */
export default function ComparisonTable({ plans, featureGroups, showDifferencesOnly }) {
  const visibleGroups = featureGroups
    .map((group) => ({
      ...group,
      items: showDifferencesOnly
        ? group.items.filter((item) => !isSameAcrossPlans(item))
        : group.items,
    }))
    .filter((group) => group.items.length > 0);

  const hasAnyVisibleFeature = visibleGroups.length > 0;

  return (
    <table className="compare-table" role="table">
      <caption>
        Feature comparison of the Basic, Pro, and Premium plans.
        {showDifferencesOnly
          ? " Only features where the plans differ are shown."
          : " All features are shown."}
      </caption>

      <thead role="rowgroup">
        <tr role="row">
          <th role="columnheader" scope="col" className="feature-col-head">
            Feature
          </th>
          {plans.map((plan) => (
            <th
              key={plan.id}
              role="columnheader"
              scope="col"
              className={`plan-head${plan.highlighted ? " plan-head--highlighted" : ""}`}
            >
              <div className="plan-head__inner">
                {plan.badge && <span className="plan-head__badge">{plan.badge}</span>}
                <span className="plan-head__name">{plan.name}</span>
                <span className="plan-head__price">
                  {plan.price}
                  <span className="plan-head__period"> {plan.period}</span>
                </span>
                <p className="plan-head__tagline">{plan.tagline}</p>
                <button type="button" className="plan-head__cta">
                  {plan.cta}
                </button>
              </div>
            </th>
          ))}
        </tr>
      </thead>

      {visibleGroups.map((group) => (
        <tbody role="rowgroup" key={group.category}>
          <tr role="row" className="group-row">
            <th role="columnheader" scope="colgroup" colSpan={plans.length + 1}>
              {group.category}
            </th>
          </tr>

          {group.items.map((item) => (
            <tr role="row" key={item.id} className="feature-row">
              <th role="rowheader" scope="row" className="feature-name">
                {item.name}
              </th>
              {plans.map((plan) => {
                const value = formatValue(item, plan.id);
                const isBool = item.type === "bool";
                const isNo = isBool && !item[plan.id];
                return (
                  <td
                    role="cell"
                    key={plan.id}
                    data-label={plan.name}
                    className={`feature-value${plan.highlighted ? " col-highlight" : ""}${
                      isBool ? (isNo ? " value--no" : " value--yes") : ""
                    }`}
                  >
                    <span className="feature-value__inner">
                      {isBool && (
                        <svg
                          className="value-icon"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                          focusable="false"
                        >
                          {isNo ? (
                            <path
                              d="M5 5l10 10M15 5L5 15"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              fill="none"
                            />
                          ) : (
                            <path
                              d="M4 10.5l4 4 8-9"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="none"
                            />
                          )}
                        </svg>
                      )}
                      <span>{value}</span>
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      ))}

      {!hasAnyVisibleFeature && (
        <tbody role="rowgroup">
          <tr role="row">
            <td role="cell" colSpan={plans.length + 1} className="empty-state">
              All plans match on every feature. Turn off "Show differences only" to see the
              full list.
            </td>
          </tr>
        </tbody>
      )}
    </table>
  );
}

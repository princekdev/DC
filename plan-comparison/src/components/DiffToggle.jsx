/**
 * A single, real <button> with aria-pressed communicates a two-state
 * toggle to assistive technology without needing any extra ARIA roles.
 * It is focusable and activatable with both Enter and Space by default,
 * since it is a native button rather than a styled <div>.
 */
export default function DiffToggle({ pressed, onChange }) {
  return (
    <button
      type="button"
      className="diff-toggle"
      aria-pressed={pressed}
      onClick={() => onChange(!pressed)}
    >
      <span className="diff-toggle__track" aria-hidden="true">
        <span className="diff-toggle__thumb" />
      </span>
      <span className="diff-toggle__label">
        {pressed ? "Showing differences only" : "Show differences only"}
      </span>
    </button>
  );
}

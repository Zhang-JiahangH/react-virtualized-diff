const FEATURES = [
  {
    title: 'Virtualized rendering',
    description:
      'Keeps rendering smooth by only mounting the visible diff rows instead of the entire file.',
  },
  {
    title: 'Large file friendly',
    description:
      'Built for scenarios where traditional diff viewers start to struggle with line count and memory pressure.',
  },
  {
    title: 'Developer focused API',
    description:
      'Designed for React integration, so it is easy to plug into internal tools, editors, or review workflows.',
  },
  {
    title: 'Interactive playground',
    description:
      'Try different file sizes, viewport heights, and context settings from the demo page.',
  },
];

export default function FeatureGrid() {
  return (
    <section className="feature-section">
      <div className="page-shell">
        <div className="section-heading">
          <h2>Why this exists</h2>
          <p>
            Standard diff experiences get rough when the input becomes large. This project focuses
            on keeping the UI responsive while still showing meaningful context.
          </p>
        </div>

        <div className="feature-grid">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
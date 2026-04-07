import { Link } from 'react-router-dom';
import FeatureGrid from '../components/FeatureGrid';
import HeroSection from '../components/HeroSection';
import SiteHeader from '../components/SiteHeader';

export default function HomePage() {
  return (
    <div className="site-page">
      <SiteHeader />
      <HeroSection />
      <FeatureGrid />

      <section className="content-section">
        <div className="page-shell content-grid">
          <div className="content-card">
            <h2>Quick usage</h2>
            <pre className="code-block">
              <code>{`import { DiffViewer } from 'react-virtualized-diff';

<DiffViewer
  oldText={oldText}
  newText={newText}
  height={560}
  contextLines={3}
/>`}</code>
            </pre>
          </div>

          <div className="content-card">
            <h2>What to try</h2>
            <ul className="feature-list">
              <li>Open the demo and switch between 1k, 10k, 50k, and 100k lines.</li>
              <li>Adjust context lines to see how the diff density changes.</li>
              <li>Resize the viewer height and check how the interaction feels.</li>
              <li>Use it as a reference implementation for your own app integration.</li>
            </ul>

            <div className="content-card__actions">
              <Link to="/demo" className="button button--primary">
                Try demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
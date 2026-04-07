import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="page-shell hero__inner">
        <div className="hero__badge">Virtualized diff viewer for large text files</div>

        <h1 className="hero__title">Render large diffs without making the browser cry</h1>

        <p className="hero__description">
          A high-performance React diff viewer designed for large text comparison. It focuses on
          virtualization, responsive rendering, and an experience that still feels usable when the
          file size gets serious.
        </p>

        <div className="hero__actions">
          <Link to="/demo" className="button button--primary">
            Open live demo
          </Link>
          <a
            className="button button--secondary"
            href="https://github.com/Zhang-JiahangH/react-virtualized-diff"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
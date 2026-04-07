import { Link, NavLink } from 'react-router-dom';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="page-shell site-header__inner">
        <Link to="/" className="site-header__brand">
          react-virtualized-diff
        </Link>

        <nav className="site-header__nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'site-header__link site-header__link--active' : 'site-header__link'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/demo"
            className={({ isActive }) =>
              isActive ? 'site-header__link site-header__link--active' : 'site-header__link'
            }
          >
            Demo
          </NavLink>
          <a
            className="site-header__link"
            href="https://github.com/Zhang-JiahangH/react-virtualized-diff"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
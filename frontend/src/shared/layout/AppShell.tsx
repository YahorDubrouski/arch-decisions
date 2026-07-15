import {ReactNode} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {LogoMark} from '@/shared/brand/LogoMark';
import {ContextIcon, DecisionsIcon, DocumentIcon, HomeIcon} from '@/shared/ui/icons/Icons';
import styles from './AppShell.module.css';

type AppShellProps = {
    children: ReactNode;
};

const NAV_ITEMS = [
    {to: '/', label: 'Home', Icon: HomeIcon, end: true},
    {to: '/context', label: 'Context', Icon: ContextIcon, end: false},
    {to: '/decisions', label: 'Decisions', Icon: DecisionsIcon, end: false},
    {to: '/architecture-decisions', label: 'Documents', Icon: DocumentIcon, end: false},
] as const;

export function AppShell({children}: AppShellProps) {
    const location = useLocation();

    return (
        <div className={styles.shell}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <Link to="/" className={styles.brand}>
                        <LogoMark size={40} className={styles.logoMark}/>
                        <span className={styles.brandText}>
                            <span className={styles.brandTitle}>Arch Decisions</span>
                            <span className={styles.brandSubtitle}>Portfolio demo</span>
                        </span>
                    </Link>

                    <nav className={styles.nav} aria-label="Main">
                        {NAV_ITEMS.map((item) => {
                            const isActive = item.end
                                ? location.pathname === item.to
                                : location.pathname === item.to ||
                                  location.pathname.startsWith(`${item.to}/`);

                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={isActive ? styles.navLinkActive : styles.navLink}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <item.Icon size={16} className={styles.navIcon}/>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>

            <main className={styles.main}>{children}</main>

            <footer className={styles.footer}>
                <LogoMark size={22} className={styles.footerLogo}/>
                <p>Structured architecture decisions · React + TypeScript portfolio project</p>
            </footer>
        </div>
    );
}

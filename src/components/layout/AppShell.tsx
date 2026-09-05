import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumbs } from './Breadcrumbs';
import { ContextBar } from './ContextBar';
import { GlobalSearchModal } from './GlobalSearchModal';

interface AppShellProps {
  children: ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="page-content">
          <Breadcrumbs />
          <ContextBar />
          {children}
        </main>
      </div>
      <GlobalSearchModal />
    </div>
  );
};

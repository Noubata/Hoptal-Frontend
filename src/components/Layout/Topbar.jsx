import { useMemo } from 'react';

function formatDate() {
  const now = new Date();
  return now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export default function Topbar({ title }) {
  const dateText = useMemo(() => formatDate(), []);

  return (
    <header className="app-topbar">
      <div>
        <h1>{title}</h1>
        <p className="topbar-label">Dashboard</p>
      </div>
      <div className="topbar-date">{dateText}</div>
    </header>
  );
}

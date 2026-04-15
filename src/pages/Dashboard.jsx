// src/pages/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './dashboard.style';
import Navbar from '../components/Navbar';

const toolCards = [
  {
    icon: '🧱',
    title: 'Pile Capacity',
    text: 'Determine axial capacity with skin friction & end bearing breakdowns.',
    cta: 'Open calculator',
    path: '/pile-calculator',
  },
  {
    icon: '🏗️',
    title: 'Shallow Foundations',
    text: 'Evaluate Terzaghi bearing capacity for isolated/strip footings.',
    cta: 'Shallow calc',
    path: '/shallow-foundation',
  },
  {
    icon: '📊',
    title: 'Soil Profiles',
    text: 'Visualise layer inputs, bearing strata, and effective stress trends.',
    cta: 'Build profile',
    path: '/soil-profile',
  },
];

const insightCards = [
  { value: '4.2x', label: 'faster preliminary sizing' },
  { value: '98%', label: 'input coverage for common soils' },
  { value: '< 3%', label: 'expected variance vs. field tests' },
];

function Dashboard() {
  const navigate = useNavigate();

  const handleScrollToTools = () => {
    const el = document.getElementById('tools');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <Navbar />
      <main style={styles.page}>
        <section style={styles.hero}>
          <span style={styles.badge}>
            <span role="img" aria-label="sparkles">✨</span> Geotechnical studio
          </span>
          <h1 style={styles.heroTitle}>Design smarter pile foundations</h1>
          <p style={styles.heroSubtitle}>
            Rapidly iterate axial pile capacity scenarios, capture every soil layer, and keep stakeholders aligned with a single engineering workspace.
          </p>
          <div style={styles.heroActions}>
            <button type="button" style={styles.primaryButton} onClick={() => navigate('/pile-calculator')}>
              Launch calculator
            </button>
            <button type="button" style={styles.secondaryButton} onClick={handleScrollToTools}>
              Explore tools
            </button>
          </div>
          <div style={styles.statsRow}>
            {[
              { label: 'Active projects', value: '12' },
              { label: 'Verified soil profiles', value: '38' },
              { label: 'Shared reports', value: '26' },
            ].map(({ label, value }) => (
              <div key={label} style={styles.statCard}>
                <div style={styles.statValue}>{value}</div>
                <div style={styles.statLabel}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="tools" style={styles.grid}>
          {toolCards.map((card) => (
            <article
              key={card.title}
              style={styles.card}
              onClick={() => navigate(card.path)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(card.path)}
              role="button"
              tabIndex={0}
            >
              <div style={styles.cardIcon}>{card.icon}</div>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardText}>{card.text}</p>
              <div style={styles.cardFooter}>
                {card.cta} →
              </div>
            </article>
          ))}
        </section>

        <section style={styles.insights}>
          {insightCards.map(({ value, label }) => (
            <div key={label} style={styles.insightCard}>
              <div style={styles.insightValue}>{value}</div>
              <div style={styles.insightLabel}>{label}</div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}

export default Dashboard;

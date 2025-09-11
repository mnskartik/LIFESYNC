import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMobile = windowWidth <= 768;

  // Header Styles
  const headerStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid #e5e7eb',
  };

  const navStyle = isMobile ? { display: 'none' } : { display: 'flex', alignItems: 'center', gap: '1.5rem' };
  const mobileMenuButtonStyle = isMobile ? { display: 'block', padding: '0.5rem', borderRadius: '0.375rem', color: '#6b7280' } : { display: 'none' };
  const mobileMenuStyle = {
    display: isMobileMenuOpen ? 'block' : 'none',
    width: '100%',
  };

  // Hero Section Styles
  const heroSectionStyle = {
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
    paddingTop: isMobile ? '5rem' : '8rem',
    paddingBottom: isMobile ? '5rem' : '8rem',
    textAlign: 'center',
  };
  const heroHeadingStyle = {
    fontSize: isMobile ? '2.25rem' : '3.75rem',
    fontWeight: '800',
    lineHeight: 1.25,
    color: '#111827',
    marginBottom: '1rem',
  };
  const heroParagraphStyle = {
    fontSize: isMobile ? '1.125rem' : '1.25rem',
    color: '#4b5563',
    marginBottom: '2rem',
    maxWidth: isMobile ? '100%' : '56rem',
    margin: '0 auto',
    lineHeight: 1.625,
  };
  const heroButtonsContainerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: isMobile ? '1rem' : '1rem',
    marginTop: isMobile ? '1rem' : '2rem',
  };
  
  // Features Section Styles
  const featuresSectionStyle = {
    paddingTop: '5rem',
    paddingBottom: '7rem',
    backgroundColor: '#fff',
  };
  const featureGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(1, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))',
    gap: '2rem',
  };
  const cardStyle = {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '1rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s ease',
    cursor: 'default',
  };
  const iconContainerStyle = {
    width: '3rem',
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    marginBottom: '1rem',
  };
  const cardHeadingStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#111827',
  };
  const cardParagraphStyle = {
    color: '#4b5563',
    fontSize: '0.875rem',
  };

  // About Section Styles
  const aboutSectionStyle = {
    paddingTop: '5rem',
    paddingBottom: '7rem',
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
    textAlign: 'center',
  };
  const aboutHeadingStyle = {
    fontSize: isMobile ? '1.875rem' : '2.25rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '1.5rem',
  };
  const aboutParagraphStyle = {
    fontSize: isMobile ? '1.125rem' : '1.25rem',
    color: '#4b5563',
    marginBottom: '2rem',
    lineHeight: 1.625,
  };

  // Footer Styles
  const footerStyle = {
    backgroundColor: '#1f2937',
    color: '#9ca3af',
    paddingTop: '2.5rem',
    paddingBottom: '2.5rem',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    textAlign: 'center',
  };
  const footerLinkStyle = {
    color: '#9ca3af',
    transition: 'color 0.3s ease',
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>LifeSync</h1>
          <nav style={navStyle}>
            <a href="#features" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', transition: 'color 0.3s ease', textDecoration: 'none' }}>Features</a>
            <a href="#about" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', transition: 'color 0.3s ease', textDecoration: 'none' }}>About</a>
            <a href="#contact" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', transition: 'color 0.3s ease', textDecoration: 'none' }}>Contact</a>
            <Link to="/signup" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: '600', borderRadius: '0.5rem', color: '#fff', backgroundColor: '#4f46e5', transition: 'all 0.3s ease', textDecoration: 'none' }}>Get Started</Link>
          </nav>
          <button style={mobileMenuButtonStyle} onClick={toggleMobileMenu}>
            <span style={{ display: 'none' }}>Open main menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        <div style={mobileMenuStyle}>
          <div style={{ padding: '0.5rem 0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            <a href="#features" onClick={toggleMobileMenu} style={{ display: 'block', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', color: '#374151', textDecoration: 'none' }}>Features</a>
            <a href="#about" onClick={toggleMobileMenu} style={{ display: 'block', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', color: '#374151', textDecoration: 'none' }}>About</a>
            <a href="#contact" onClick={toggleMobileMenu} style={{ display: 'block', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', color: '#374151', textDecoration: 'none' }}>Contact</a>
            <Link to="/signup" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: '600', borderRadius: '0.5rem', color: '#fff', backgroundColor: '#4f46e5', transition: 'all 0.3s ease', textDecoration: 'none' }}>Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={heroSectionStyle}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <h2 style={heroHeadingStyle}>Simplify Your Daily Life</h2>
          <p style={heroParagraphStyle}>Manage alarms, track calories, create schedules, and more. All in one personal app designed to ease your daily routine and help you stay organized and healthy.</p>
          <div style={heroButtonsContainerStyle}>
            <Link
  to="/signup"
  style={{
    padding: "0.75rem 2rem",
    borderRadius: "0.5rem",
    color: "#fff",
    fontWeight: "600",
    backgroundColor: "#4f46e5",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
    textDecoration: "none",
  }}
>
  Get Started Now
</Link>
            <a href="#features" style={{ padding: '0.75rem 2rem', borderRadius: '0.5rem', color: '#4f46e5', fontWeight: '600', backgroundColor: '#fff', border: '1px solid #d1d5db', transition: 'color 0.3s ease', textDecoration: 'none' }}>Learn More</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={featuresSectionStyle}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <h2 style={{ fontSize: isMobile ? '1.875rem' : '2.25rem', fontWeight: 'bold', textAlign: 'center', color: '#111827', marginBottom: '3rem' }}>Key Features</h2>
          <div style={featureGridStyle}>
            {/* Feature Card 1 */}
            <article style={cardStyle}>
              <div style={{ ...iconContainerStyle, backgroundColor: '#eef2ff', color: '#4f46e5' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              </div>
              <h3 style={cardHeadingStyle}>Alarms & Reminders</h3>
              <p style={cardParagraphStyle}>Set personalized alarms and reminders to never miss important tasks or events.</p>
            </article>
            {/* Feature Card 2 */}
            <article style={cardStyle}>
              <div style={{ ...iconContainerStyle, backgroundColor: '#e0f2fe', color: '#2563eb' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="6" y2="6"/><path d="m16 22 2-2 4 4"/><path d="m20 12 2 2"/></svg>
              </div>
              <h3 style={cardHeadingStyle}>Personalized Schedule</h3>
              <p style={cardParagraphStyle}>Create and customize your daily schedule with events, tasks, and priorities.</p>
            </article>
            {/* Feature Card 3 */}
            <article style={cardStyle}>
              <div style={{ ...iconContainerStyle, backgroundColor: '#dcfce7', color: '#16a34a' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44c-.45 0-.79.37-.77.82.02.43.37.78.82.78h.44c.45 0 .79-.37.77-.82-.02-.43-.37-.78-.82-.78z"/><path d="M19.1 19.88c-.62.5-1.4.82-2.1.82a4.4 4.4 0 0 1-2.22-.61c-.55-.38-1.25-.62-2.02-.62-.77 0-1.47.24-2.02.62a4.4 4.4 0 0 1-2.22.61c-.7 0-1.48-.32-2.1-.82-.57-.46-.88-1.07-.88-1.68V9.52c0-.62.31-1.23.88-1.68.62-.5 1.4-.82 2.1-.82a4.4 4.4 0 0 1 2.22.61c.55.38 1.25.62 2.02.62.77 0 1.47-.24 2.02-.62a4.4 4.4 0 0 1 2.22-.61c.7 0 1.48.32 2.1.82.57.46.88 1.07.88 1.68v8.72c0 .61-.31 1.22-.88 1.68z"/></svg>
              </div>
              <h3 style={cardHeadingStyle}>Calorie Tracker</h3>
              <p style={cardParagraphStyle}>Track your daily calorie intake with meal logging and nutritional insights.</p>
            </article>
            {/* Feature Card 4 */}
            <article style={cardStyle}>
              <div style={{ ...iconContainerStyle, backgroundColor: '#fee2e2', color: '#dc2626' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 16 2 2 4-4"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 15h4"/></svg>
              </div>
              <h3 style={cardHeadingStyle}>To-Do List</h3>
              <p style={cardParagraphStyle}>Manage tasks and productivity with an intuitive to-do list and progress tracking.</p>
            </article>
            {/* Feature Card 5 */}
            <article style={cardStyle}>
              <div style={{ ...iconContainerStyle, backgroundColor: '#fef3c7', color: '#f59e0b' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <h3 style={cardHeadingStyle}>Habit Tracker</h3>
              <p style={cardParagraphStyle}>Build and maintain positive habits with detailed tracking and reminders.</p>
            </article>
            {/* Feature Card 6 */}
            <article style={cardStyle}>
              <div style={{ ...iconContainerStyle, backgroundColor: '#f3e8ff', color: '#a855f7' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
              </div>
              <h3 style={cardHeadingStyle}>Various Trackers</h3>
              <p style={cardParagraphStyle}>Monitor water intake, expenses, and more with easy-to-use trackers.</p>
            </article>
            {/* Feature Card 7 */}
            <article style={cardStyle}>
              <div style={{ ...iconContainerStyle, backgroundColor: '#cffafe', color: '#06b6d4' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><path d="M7 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg>
              </div>
              <h3 style={cardHeadingStyle}>Notes & Journal</h3>
              <p style={cardParagraphStyle}>Keep personal notes and journal entries for reflection and organization.</p>
            </article>
            {/* Feature Card 8 */}
            <article style={cardStyle}>
              <div style={{ ...iconContainerStyle, backgroundColor: '#ede9fe', color: '#8b5cf6' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="6"/><path d="M12 3a1 1 0 0 0 0 2"/><path d="M12 19a1 1 0 0 0 0 2"/><path d="M20 12a1 1 0 0 0 2 0"/><path d="M2 12a1 1 0 0 0 2 0"/><path d="M18.364 5.636a1 1 0 0 0-1.414 1.414"/><path d="M6.023 17.977a1 1 0 0 0 1.414 1.414"/><path d="M17.977 17.977a1 1 0 0 0 1.414-1.414"/><path d="M5.636 6.023a1 1 0 0 0-1.414-1.414"/></svg>
              </div>
              <h3 style={cardHeadingStyle}>Weather & Quotes</h3>
              <p style={cardParagraphStyle}>Get daily weather updates and motivational quotes to start your day right.</p>
            </article>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={aboutSectionStyle}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <h2 style={aboutHeadingStyle}>About the App</h2>
          <p style={aboutParagraphStyle}>Personal Life Manager is your all-in-one companion for daily productivity and wellness. Whether you're setting alarms, planning your schedule, tracking calories, or building habits, our app simplifies life by putting everything you need in one place. Designed for personal use, it's intuitive, responsive, and helps you achieve your goals effortlessly.</p>
          <Link to="/signup" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: '600', borderRadius: '0.5rem', color: '#fff', backgroundColor: '#4f46e5', transition: 'all 0.3s ease', textDecoration: 'none' }}>Download</Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" style={footerStyle}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>&copy; 2023 Personal Life Manager. All rights reserved.</p>
          <div style={{ fontSize: '0.875rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button style={footerLinkStyle}>Privacy Policy</button>
<button style={footerLinkStyle}>Terms of Service</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

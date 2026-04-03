import React from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, BookOpen, Star, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={{ backgroundColor: '#fff' }}>
      {/* Navbar */}
      <nav className="flex justify-between items-center container" style={{ padding: '20px 24px' }}>
        <div className="flex items-center gap-4">
          <BookOpen color="var(--primary-navy)" size={28} />
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-navy)' }}>Shree Academy</span>
          <div className="flex gap-4" style={{ marginLeft: '40px', fontSize: '14px', fontWeight: '500', color: 'var(--text-light)' }}>
            <Link to="/courses" style={{ textDecoration: 'none', color: 'var(--text-light)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color='var(--primary-navy)'} onMouseOut={(e) => e.target.style.color='var(--text-light)'}>Courses</Link>
            <Link to="/faculty" style={{ textDecoration: 'none', color: 'var(--text-light)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color='var(--primary-navy)'} onMouseOut={(e) => e.target.style.color='var(--text-light)'}>Faculty</Link>
            <Link to="/about" style={{ textDecoration: 'none', color: 'var(--text-light)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color='var(--primary-navy)'} onMouseOut={(e) => e.target.style.color='var(--text-light)'}>About</Link>
            <Link to="/pricing" style={{ textDecoration: 'none', color: 'var(--text-light)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color='var(--primary-navy)'} onMouseOut={(e) => e.target.style.color='var(--text-light)'}>Pricing</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <User size={20} color="var(--text-dark)" />
          <Link to="/auth" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>Enroll Now</Link>
          <Link to="/auth" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '12px' }}>Teacher Login</Link>
          <Link to="/auth" style={{color: 'var(--text-light)'}}><Shield size={20} /></Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container flex justify-between items-center" style={{ padding: '80px 24px', minHeight: '70vh' }}>
        <div style={{ flex: 1, paddingRight: '40px' }}>
          <div className="badge badge-blue" style={{ marginBottom: '24px' }}>EXCELLENCE IN EDUCATION</div>
          <h1 style={{ fontSize: '56px', lineHeight: '1.2', marginBottom: '24px' }}>
            Unlock Your <br />
            Potential <br />
            at <span style={{ color: 'var(--accent-gold)' }}>Shree Academy</span>
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '18px', marginBottom: '32px', maxWidth: '450px' }}>
            Where academic rigor meets personalized mentorship. Join the elite cohort of students preparing for JEE, NEET, and Foundation programs.
          </p>
          <div className="flex gap-4">
            <button className="btn btn-primary">Book a Free Demo</button>
            <button className="btn btn-outline">View Curriculum</button>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', height: '400px', backgroundColor: 'var(--primary-navy)', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
            {/* Mock Image Placeholder */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.8, background: 'linear-gradient(45deg, #0F203C 0%, #1A3A6C 100%)' }}></div>
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#fff', fontWeight: 'bold' }}>Interactive Live Classes</div>
          </div>
        </div>
      </section>

      {/* Specialized Programs */}
      <section style={{ backgroundColor: 'var(--bg-color)', padding: '80px 0' }}>
        <div className="container">
          <div className="flex justify-between items-center" style={{ marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Our Specialized Programs</h2>
              <p style={{ color: 'var(--text-light)' }}>Structured pathways designed by industry veterans to take you from fundamentals to mastery.</p>
            </div>
            <a href="#" style={{ color: 'var(--text-dark)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
              Compare all programs <ArrowRight size={16} />
            </a>
          </div>

          <div className="flex gap-4">
            {[ 
              { title: 'JEE Main & Advanced', color: '#1E3A8A', icon: '📐' },
              { title: 'NEET (Medical)', color: '#991B1B', icon: '🧬' },
              { title: 'Foundation (8th-10th)', color: '#D97706', icon: '📚' }
            ].map((prog, i) => (
              <div key={i} className="card interactive-card" style={{ flex: 1, border: '1px solid var(--border-color)' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: prog.color, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '24px', boxShadow: `0 4px 12px ${prog.color}40` }}>
                  {prog.icon}
                </div>
                <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{prog.title}</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '24px' }}>
                  Comprehensive curriculum focusing on deep conceptual clarity and problem-solving speed.
                </p>
                <button className="btn btn-outline" style={{ width: '100%' }}>Learn More</button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--primary-navy)', color: '#fff', padding: '40px 0' }}>
         <div className="container flex justify-between items-center">
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Shree Academy</span>
            <div className="flex gap-4" style={{ fontSize: '14px', color: '#CBD5E1' }}>
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, BookOpen, Star, ArrowRight, X } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const LandingPage = () => {
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', course: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'enquiries'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'New'
      });
      setSuccess(true);
      setTimeout(() => {
        setShowEnquiry(false);
        setSuccess(false);
        setFormData({ name: '', email: '', phone: '', course: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("Failed to submit. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div style={{ backgroundColor: '#fff' }}>
      {/* Navbar */}
      <nav className="flex justify-between items-center container" style={{ padding: '20px 24px' }}>
        <div className="flex items-center gap-4">
          <BookOpen color="var(--primary-navy)" size={28} />
          <span style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary-navy)', letterSpacing: '-0.5px' }}>Shree Classes</span>
          <div className="flex gap-4" style={{ marginLeft: '40px', fontSize: '14px', fontWeight: '500', color: 'var(--text-light)' }}>
            <Link to="/courses" style={{ textDecoration: 'none', color: 'var(--text-light)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-navy)'} onMouseOut={(e) => e.target.style.color = 'var(--text-light)'}>Courses</Link>
            <Link to="/faculty" style={{ textDecoration: 'none', color: 'var(--text-light)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-navy)'} onMouseOut={(e) => e.target.style.color = 'var(--text-light)'}>Faculty</Link>
            <Link to="/about" style={{ textDecoration: 'none', color: 'var(--text-light)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-navy)'} onMouseOut={(e) => e.target.style.color = 'var(--text-light)'}>About Us</Link>
            <Link to="/pricing" style={{ textDecoration: 'none', color: 'var(--text-light)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-navy)'} onMouseOut={(e) => e.target.style.color = 'var(--text-light)'}>Pricing</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <User size={20} color="var(--text-dark)" />
          <button onClick={() => setShowEnquiry(true)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>Enroll Now</button>
          <Link to="/auth" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '12px' }}>Login / Sign Up Now</Link>
          <Link to="/auth" style={{ color: 'var(--text-light)' }}><Shield size={20} /></Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container flex justify-between items-center" style={{ padding: '80px 24px', minHeight: '70vh' }}>
        <div style={{ flex: 1, paddingRight: '40px', animation: 'fadeIn 0.8s ease-out' }}>
          <div style={{ marginBottom: '24px', backgroundColor: '#FEF08A', color: '#854D0E', fontWeight: 'bold', padding: '6px 16px', borderRadius: '99px', display: 'inline-block', fontSize: '12px', letterSpacing: '1px', boxShadow: '0 2px 10px rgba(254, 240, 138, 0.5)' }}>✨ EXCELLENCE IN EDUCATION</div>
          <h1 style={{ fontSize: '64px', lineHeight: '1.1', marginBottom: '24px', fontWeight: '900', color: 'var(--primary-navy)' }}>
            Elevate Your <br />
            Learning at <br />
            <span style={{ background: 'linear-gradient(90deg, #F59E0B, #EA580C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Shree Classes</span>
          </h1>
          <p style={{ color: '#475569', fontSize: '18px', marginBottom: '36px', maxWidth: '480px', lineHeight: '1.6' }}>
            Where academic rigor meets personalized mentorship. Join the elite cohort of students preparing for Marathi & English medium excellence.
          </p>
          <div className="flex gap-4">
            <button onClick={() => setShowEnquiry(true)} className="btn btn-primary" style={{ color: '#fff', padding: '16px 32px', fontSize: '16px', background: 'linear-gradient(90deg, var(--primary-navy), #1E3A8A)', border: 'none', boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.4)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>Enroll Now</button>
            <Link to="/courses" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', backgroundColor: '#fff' }} onMouseOver={e => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseOut={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.transform = 'translateY(0)'; }}>View Courses</Link>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', height: '480px', borderRadius: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', transform: 'perspective(1000px) rotateY(-5deg)', transition: 'transform 0.5s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg)'} onMouseOut={e => e.currentTarget.style.transform = 'perspective(1000px) rotateY(-5deg)'}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'url(https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop) center/cover' }}></div>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(15, 32, 60, 0.9) 0%, rgba(15, 32, 60, 0.1) 60%)' }}></div>
            <div style={{ position: 'absolute', bottom: '30px', left: '30px', color: '#fff' }}>
              <div style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: '20px', display: 'inline-block', marginBottom: '12px', fontSize: '14px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.3)' }}>🔴 Live Interactive Classes</div>
              <h3 style={{ fontSize: '28px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)', color: '#fff' }}>Learn from the best educators</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Programs */}
      <section style={{ backgroundColor: '#F8FAFC', padding: '100px 0' }}>
        <div className="container">
          <div className="flex justify-between items-center" style={{ marginBottom: '56px' }}>
            <div>
              <h2 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '800', color: 'var(--primary-navy)' }}>Our Specialized Programs</h2>
              <p style={{ color: 'var(--text-light)', fontSize: '16px', maxWidth: '600px' }}>Structured pathways designed by proven educators to take you from fundamentals to complete mastery.</p>
            </div>
            <Link to="/courses" style={{ color: 'var(--accent-gold)', fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', padding: '12px 24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              Compare all programs <ArrowRight size={18} />
            </Link>
          </div>

          <div className="flex gap-6">
            {[
              { title: 'English Medium', subtitle: '8th to 10th Standard', color: '#3B82F6', bg: '#EFF6FF', icon: '🌍' },
              { title: 'Marathi Medium', subtitle: '3rd to 10th Standard', color: '#8B5CF6', bg: '#F5F3FF', icon: '📖' },
              { title: 'Foundation Program', subtitle: 'Conceptual Clarity', color: '#F59E0B', bg: '#FFFBEB', icon: '🏗️' }
            ].map((prog, i) => (
              <div key={i} className="card interactive-card hover-glow" style={{ flex: 1, backgroundColor: '#fff', border: 'none', borderRadius: '20px', padding: '32px', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ width: '64px', height: '64px', backgroundColor: prog.bg, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '24px', border: `1px solid ${prog.color}30` }}>
                  {prog.icon}
                </div>
                <h3 style={{ fontSize: '24px', marginBottom: '4px', fontWeight: '700', color: 'var(--primary-navy)' }}>{prog.title}</h3>
                <div style={{ fontSize: '14px', color: prog.color, fontWeight: '700', marginBottom: '16px', padding: '4px 12px', backgroundColor: prog.bg, display: 'inline-block', borderRadius: '99px' }}>{prog.subtitle}</div>
                <p style={{ color: 'var(--text-light)', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }}>
                  Comprehensive curriculum tailored for strict academic excellence and exceptional problem-solving.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', fontWeight: '600', color: 'var(--primary-navy)', gap: '8px' }}>
                  Explore Program <ArrowRight size={16} color={prog.color} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#091529', color: '#fff', padding: '80px 0 32px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '64px' }}>
          <div>
            <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
              <BookOpen color="var(--accent-gold)" size={28} />
              <span style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px' }}>Shree Classes</span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '15px', lineHeight: '1.7', maxWidth: '350px' }}>Empowering students to achieve academic excellence through premium education, tailored curricula, and highly dedicated instruction in Kalyan.</p>
          </div>

          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '24px', color: '#fff', letterSpacing: '1px' }}>Our Programs</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Link to="/courses" style={{ color: '#94A3B8', fontSize: '15px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#94A3B8'}>English Medium (8th-10th)</Link>
              <Link to="/courses" style={{ color: '#94A3B8', fontSize: '15px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#94A3B8'}>Marathi Medium (3rd-10th)</Link>
              <Link to="/courses" style={{ color: '#94A3B8', fontSize: '15px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#94A3B8'}>Foundation Courses</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '24px', color: '#fff', letterSpacing: '1px' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/courses" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '15px', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#94A3B8'}>Explore Courses</Link>
              <Link to="/faculty" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '15px', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#94A3B8'}>Expert Faculty</Link>
              <Link to="/about" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '15px', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#94A3B8'}>About Us</Link>
              <Link to="/auth" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '15px', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#94A3B8'}>Student Portal Login</Link>
            </div>
          </div>
        </div>
        <div className="container" style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', color: '#64748B', fontSize: '14px' }}>
          © {new Date().getFullYear()} Shree Classes. All rights reserved.
        </div>
      </footer>
      {/* Enquiry Modal */}
      {showEnquiry && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflow: 'auto', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '500px', position: 'relative' }}>
            <button onClick={() => setShowEnquiry(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={24} color="var(--text-light)" />
            </button>
            <h2 style={{ fontSize: '24px', marginBottom: '8px', color: 'var(--primary-navy)' }}>Enrollment Enquiry</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>Fill out the form below and our team will get back to you shortly.</p>

            {success ? (
              <div style={{ padding: '24px', backgroundColor: '#ECFDF5', color: '#047857', borderRadius: '8px', textAlign: 'center', fontWeight: '500' }}>
                Thank you! Your enquiry has been submitted successfully.
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Full Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }} placeholder="John Doe" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Email Address</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }} placeholder="john@example.com" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Phone Number</label>
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }} placeholder="+1234567890" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Course of Interest</label>
                  <select required value={formData.course} onChange={e => setFormData({ ...formData, course: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <option value="">Select a course</option>
                    <option value="English Medium (8th-10th)">English Medium (8th-10th)</option>
                    <option value="Marathi Medium (3rd-10th)">Marathi Medium (3rd-10th)</option>
                    <option value="Foundation">Foundation Course</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Message (Optional)</label>
                  <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', minHeight: '80px' }} placeholder="Any specific questions?"></textarea>
                </div>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                  {submitting ? 'Submitting...' : 'Submit Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

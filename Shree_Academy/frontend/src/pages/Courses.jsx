import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Courses = () => {
    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '60px 24px' }}>
             <div className="container" style={{ backgroundColor: '#fff', padding: '48px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                 <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '40px', fontWeight: '900', color: 'var(--primary-navy)', marginBottom: '16px' }}>Our Programs & Courses</h1>
                    <p style={{ color: 'var(--text-light)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>Explore our specialized medium courses structured meticulously for academic excellence at Shree Classes.</p>
                 </div>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '48px' }}>
                    
                    <div className="card interactive-card hover-glow" style={{ border: 'none', backgroundColor: '#EFF6FF', borderRadius: '20px', padding: '32px' }}>
                        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🌍</div>
                        <h3 style={{ color: 'var(--primary-navy)', fontSize: '24px', marginBottom: '8px' }}>English Medium</h3>
                        <div style={{ display: 'inline-block', backgroundColor: '#3B82F6', color: '#fff', padding: '6px 16px', borderRadius: '99px', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px' }}>8th to 10th Standard</div>
                        <p style={{ color: '#475569', lineHeight: '1.6' }}>Master the core concepts of Science, Mathematics, and Languages in our specialized English medium program designed to build strong fundamentals.</p>
                    </div>

                    <div className="card interactive-card hover-glow" style={{ border: 'none', backgroundColor: '#F5F3FF', borderRadius: '20px', padding: '32px' }}>
                        <div style={{ fontSize: '40px', marginBottom: '16px' }}>📖</div>
                        <h3 style={{ color: 'var(--primary-navy)', fontSize: '24px', marginBottom: '8px' }}>Marathi Medium</h3>
                        <div style={{ display: 'inline-block', backgroundColor: '#8B5CF6', color: '#fff', padding: '6px 16px', borderRadius: '99px', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px' }}>3rd to 10th Standard</div>
                        <p style={{ color: '#475569', lineHeight: '1.6' }}>A comprehensive and rigorous training program uniquely crafted to nurture Marathi medium students toward state board excellence.</p>
                    </div>

                    <div className="card interactive-card hover-glow" style={{ border: 'none', backgroundColor: '#FFFBEB', borderRadius: '20px', padding: '32px' }}>
                        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏗️</div>
                        <h3 style={{ color: 'var(--primary-navy)', fontSize: '24px', marginBottom: '8px' }}>Foundation Course</h3>
                        <div style={{ display: 'inline-block', backgroundColor: '#F59E0B', color: '#fff', padding: '6px 16px', borderRadius: '99px', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px' }}>Conceptual Clarity</div>
                        <p style={{ color: '#475569', lineHeight: '1.6' }}>Strengthen your logical and analytical reasoning early on! This program focuses purely on competitive readiness and critical thinking.</p>
                    </div>

                 </div>

                 <div style={{ textAlign: 'center' }}>
                    <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '16px', fontWeight: '600' }}>← Back to Home</Link>
                 </div>
             </div>
        </div>
    );
}

export default Courses;

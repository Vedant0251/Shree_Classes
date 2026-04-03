import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 24px' }}>
             <div className="container" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px' }}>
                 <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>About Apex Academy</h1>
                 <div style={{ width: '100%', height: '300px', backgroundColor: 'var(--primary-navy)', borderRadius: '12px', marginBottom: '24px' }}></div>
                 <p style={{ color: 'var(--text-light)', lineHeight: '1.8' }}>
                     Our legacy of success stems from decades of experience in shaping national toppers. 
                     We believe in personalized mentorship combined with academic rigor. Join the elite cohort.
                 </p>
                 <Link to="/" className="btn btn-outline" style={{ marginTop: '32px' }}>← Back to Home</Link>
             </div>
        </div>
    );
}

export default About;

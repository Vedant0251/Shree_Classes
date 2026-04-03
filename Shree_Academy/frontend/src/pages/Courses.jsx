import React from 'react';
import { Link } from 'react-router-dom';

const Courses = () => {
    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 24px' }}>
             <div className="container" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px' }}>
                 <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>Courses</h1>
                 <p style={{ color: 'var(--text-light)', marginBottom: '32px' }}>Explore all our available courses at Apex Academy.</p>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="card interactive-card" style={{ border: '1px solid var(--border-color)' }}>
                        <h3>JEE Main & Advanced</h3>
                        <p style={{ color: 'var(--text-light)', marginTop: '8px' }}>Comprehensive physics, chemistry, and maths preparation.</p>
                    </div>
                    <div className="card interactive-card" style={{ border: '1px solid var(--border-color)' }}>
                        <h3>NEET Curriculum</h3>
                        <p style={{ color: 'var(--text-light)', marginTop: '8px' }}>Specialized botany, zoology, physics and chemistry.</p>
                    </div>
                 </div>
                 <Link to="/" className="btn btn-outline" style={{ marginTop: '32px' }}>← Back to Home</Link>
             </div>
        </div>
    );
}

export default Courses;

import React from 'react';
import { Link } from 'react-router-dom';

const Faculty = () => {
    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 24px' }}>
             <div className="container" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px' }}>
                 <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>Our Faculty</h1>
                 <p style={{ color: 'var(--text-light)', marginBottom: '32px' }}>Meet the global architects of knowledge shaping our students.</p>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    {['Dr. Elias Vance', 'Dr. Sarah Mitchell', 'Prof. James Chen'].map((name, i) => (
                        <div key={i} className="card interactive-card" style={{ border: '1px solid var(--border-color)', textAlign: 'center' }}>
                            <div style={{ width: '80px', height: '80px', backgroundColor: '#E2E8F0', borderRadius: '50%', margin: '0 auto 16px' }}></div>
                            <h3 style={{ fontSize: '16px' }}>{name}</h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '4px' }}>Senior Faculty</p>
                        </div>
                    ))}
                 </div>
                 <Link to="/" className="btn btn-outline" style={{ marginTop: '32px' }}>← Back to Home</Link>
             </div>
        </div>
    );
}

export default Faculty;

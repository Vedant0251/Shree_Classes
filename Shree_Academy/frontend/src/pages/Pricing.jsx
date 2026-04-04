import React from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 24px' }}>
             <div className="container" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
                 <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Transparent Pricing</h1>
                 <p style={{ color: 'var(--text-light)', marginBottom: '40px' }}>Invest in your future with our specialized coaching plans.</p>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                     {[ 
                        { name: 'Foundation Track', price: '₹12,000/mo', features: ['8th-10th Curriculum', 'Weekly Tests', 'Core Mentorship'] },
                        { name: 'Professional Track', price: '₹24,000/mo', features: ['Advanced Curriculum', 'Daily Live Classes', 'Personal Planner'], highlight: true },
                        { name: 'Master Track', price: '₹35,000/mo', features: ['Rank Enhancement', '1-on-1 Sessions', 'Premium Resources'] }
                     ].map((plan, i) => (
                         <div key={i} className="card interactive-card" style={{ border: plan.highlight ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)', position: 'relative' }}>
                             {plan.highlight && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--accent-gold)', color: 'var(--primary-navy)', fontSize: '10px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '99px' }}>MOST POPULAR</div>}
                             <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{plan.name}</h3>
                             <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-navy)', marginBottom: '24px' }}>{plan.price}</div>
                             <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', textAlign: 'left', color: 'var(--text-light)', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                 {plan.features.map((f, j) => <li key={j}>✓ {f}</li>)}
                             </ul>
                             <button className={plan.highlight ? 'btn btn-primary' : 'btn btn-outline'} style={{ width: '100%' }}>Choose Plan</button>
                         </div>
                     ))}
                 </div>

                 <div style={{ marginTop: '40px', textAlign: 'left' }}>
                    <Link to="/" className="btn btn-outline">← Back to Home</Link>
                 </div>
             </div>
        </div>
    );
}

export default Pricing;

import React from 'react';
import { LayoutDashboard, Users, UserCheck, DollarSign, Settings, Bell, Search, BarChart, Download, Plus, MoreVertical, Eye, BookOpen, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-navy)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen color="#fff" size={16} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', margin: 0, fontWeight: '700' }}>Apex Academy</h2>
          </div>
        </div>

        <div style={{ padding: '0 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E2E8F0', flexShrink: 0 }}></div>
            <div>
                <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>Executive Portal</p>
                <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: 0 }}>Apex Academy Member</p>
            </div>
        </div>

        <div className="sidebar-nav">
          <Link to="#" className="nav-item active"><LayoutDashboard size={18} /> Dashboard</Link>
          <Link to="#" className="nav-item"><BookOpen size={18} /> My Courses</Link>
          <Link to="#" className="nav-item"><Users size={18} /> Schedule</Link>
          <Link to="#" className="nav-item"><BarChart size={18} /> Performance</Link>
          <Link to="#" className="nav-item"><Settings size={18} /> Resources</Link>
          <Link to="#" className="nav-item"><Settings size={18} /> Settings</Link>
        </div>

        <div style={{ marginTop: 'auto', padding: '24px' }}>
             <button className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }}>Upgrade Plan</button>
             <Link to="#" className="nav-item" style={{ padding: 0, marginBottom: '16px' }}><Settings size={18} /> Help Center</Link>
             <Link to="/" className="nav-item" style={{ padding: 0 }}><Settings size={18} /> Logout</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="flex justify-between items-center" style={{ marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', marginBottom: '4px' }}>Command Center</h1>
            <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Global Administrative Overview • Oct 24, 2024</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn btn-outline" style={{ backgroundColor: '#F1F5F9' }}><Download size={16} style={{ marginRight: '8px' }}/> Export Report</button>
            <button className="btn btn-secondary"><Plus size={16} style={{ marginRight: '8px' }}/> Quick Action</button>
          </div>
        </div>

        {/* Top Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div className="card" style={{ backgroundColor: 'var(--primary-navy)', color: '#fff', padding: '24px' }}>
                <div style={{ fontSize: '12px', letterSpacing: '1px', marginBottom: '8px', color: '#CBD5E1', fontWeight: '600' }}>TOTAL REVENUE</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>$842,900.00</div>
                <div style={{ fontSize: '12px', color: 'var(--accent-gold)' }}>↗ +12.4% from last quarter</div>
            </div>
            
            <div className="card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '12px', letterSpacing: '1px', marginBottom: '8px', color: 'var(--text-light)', fontWeight: '600' }}>NEW ENROLMENTS</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>1,284</div>
                <div style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={12} /> 86 students today
                </div>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--accent-gold)', padding: '24px' }}>
                <div style={{ fontSize: '12px', letterSpacing: '1px', marginBottom: '8px', color: '#92400E', fontWeight: '600' }}>AVG. TEACHER RATING</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-navy)', marginBottom: '16px' }}>4.92 <span style={{ fontSize: '16px', fontWeight: 'normal' }}>/ 5.0</span></div>
                <div style={{ fontSize: '12px', color: '#92400E' }}>Top 2% of Global Academies</div>
            </div>
        </div>

        {/* Middle Graph Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div className="card" style={{ padding: '24px' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '16px' }}>Student Engagement Trends</h3>
                    <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '6px', padding: '4px' }}>
                        <div style={{ padding: '4px 12px', fontSize: '10px', backgroundColor: 'var(--primary-navy)', color: '#fff', borderRadius: '4px', fontWeight: '600' }}>WEEKLY</div>
                        <div style={{ padding: '4px 12px', fontSize: '10px', color: 'var(--text-light)', fontWeight: '600' }}>MONTHLY</div>
                    </div>
                </div>
                {/* CSS Bar Chart */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '150px', gap: '16px', padding: '0 24px' }}>
                    {[50, 60, 100, 75, 45, 55, 65].map((h, i) => (
                        <div key={i} style={{ flex: 1, backgroundColor: '#E2E8F0', height: `${h}%`, borderRadius: '4px 4px 0 0' }}></div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', padding: '0 24px', fontSize: '10px', color: 'var(--text-light)', fontWeight: '600' }}>
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => <span key={day}>{day}</span>)}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="card" style={{ padding: '24px', flex: 1 }}>
                    <h3 style={{ fontSize: '12px', letterSpacing: '1px', marginBottom: '24px', color: 'var(--text-dark)' }}>COURSE PROGRESS OVERALL</h3>
                    <div className="flex items-center gap-16">
                         {/* Circle Gauge */}
                         <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '6px solid #F1F5F9', borderRightColor: 'var(--accent-gold)', borderTopColor: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                            74%
                         </div>
                         <div>
                             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>852</div>
                             <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>Modules Completed Today</div>
                         </div>
                    </div>
                </div>
                <div className="card" style={{ backgroundColor: '#0B1121', color: '#fff', padding: '24px', flex: 1 }}>
                    <h3 style={{ fontSize: '10px', letterSpacing: '1px', color: 'var(--text-light)', marginBottom: '8px' }}>LIVE NOW</h3>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        142 <span style={{ fontSize: '14px', color: 'var(--accent-gold)', fontWeight: 'normal' }}>Active Classes</span>
                    </div>
                </div>
            </div>
        </div>

        {/* User Management Row */}
        <div style={{ marginBottom: '32px' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '20px' }}>User Management</h3>
                <div style={{ position: 'relative' }}>
                    <Search size={16} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="text" placeholder="Search by name, ID, or course..." style={{ padding: '10px 16px 10px 36px', borderRadius: '6px', border: '1px solid var(--border-color)', width: '300px', backgroundColor: '#F8FAFC', fontSize: '14px' }} />
                </div>
            </div>
            
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead style={{ backgroundColor: '#F1F5F9' }}>
                        <tr style={{ color: 'var(--text-light)', textAlign: 'left' }}>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>USER DETAILS</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>CURRENT TRACK</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>STATUS</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>ACTIVITY</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600', textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { name: 'Elena Sterling', email: 'elena.s@apexacademy.com', track: 'MASTERING VENTURE CAPITAL', status: 'Active', statusColor: '#10B981', activity: '2h ago' },
                            { name: 'Julian Draxler', email: 'j.draxler@apexacademy.com', track: 'DIGITAL DIPLOMACY', status: 'Away', statusColor: '#F59E0B', activity: '14h ago' },
                            { name: 'Marcus Wright', email: 'm.wright@apexacademy.com', track: 'ADVANCED ETHICS', status: 'Inactive', statusColor: '#94A3B8', activity: '5 days ago' }
                        ].map((user, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', backgroundColor: '#E2E8F0', borderRadius: '50%' }}></div>
                                    <div>
                                        <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{user.name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>{user.email}</div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--primary-navy)', backgroundColor: '#E0E7FF', padding: '4px 12px', borderRadius: '99px', letterSpacing: '0.5px' }}>{user.track}</span>
                                </td>
                                <td style={{ padding: '16px 24px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: user.statusColor }}></div>
                                    {user.status}
                                </td>
                                <td style={{ padding: '16px 24px', color: 'var(--text-light)' }}>{user.activity}</td>
                                <td style={{ padding: '16px 24px', textAlign: 'right', color: 'var(--text-light)' }}><MoreVertical size={16} style={{ cursor: 'pointer' }}/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Financial & Invoicing Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
            {/* Financial Summary */}
            <div className="card" style={{ backgroundColor: 'var(--primary-navy)', color: '#fff', padding: '32px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '32px' }}>Financial Summary</h3>
                
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-light)', letterSpacing: '1px', marginBottom: '8px' }}>UNPAID INVOICES</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>$12,450.00</div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-light)', letterSpacing: '1px', marginBottom: '8px' }}>COLLECTION RATE</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>98.2%</div>
                </div>

                <button className="btn btn-primary" style={{ width: '100%' }}>Send Mass Reminders</button>
            </div>

            {/* Fee Management & Invoicing */}
            <div>
                <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Fee Management & Invoicing</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                        { id: 'INV-2024-0891', payee: 'Sarah Jenkins', course: 'Professional Track', amount: '$2,400.00', status: 'PAID', color: '#10B981', bgColor: '#D1FAE5' },
                        { id: 'INV-2024-0892', payee: 'David Miller', course: 'Leadership Coaching', amount: '$3,800.00', status: 'OVERDUE', color: '#EF4444', bgColor: '#FEE2E2' },
                        { id: 'INV-2024-0893', payee: 'Chloe Zhao', course: 'Strategy Fundamentals', amount: '$1,200.00', status: 'PENDING', color: '#F59E0B', bgColor: '#FEF3C7' }
                    ].map((inv, i) => (
                        <div key={i} className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', backgroundColor: '#F8FAFC', border: 'none' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px', border: '1px solid var(--border-color)' }}>
                                <FileText size={18} color="var(--primary-navy)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>{inv.id}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>Payee: {inv.payee} • {inv.course}</div>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', marginRight: '24px' }}>
                                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{inv.amount}</div>
                                <div style={{ fontSize: '9px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.5px', color: inv.color, backgroundColor: inv.bgColor }}>{inv.status}</div>
                            </div>
                            <Eye size={20} color="var(--text-dark)" style={{ cursor: 'pointer' }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

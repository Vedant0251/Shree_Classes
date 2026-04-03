import React from 'react';
import { LayoutDashboard, Calendar, Users, FileText, MessageSquare, BookOpen, Settings, Bell, Search, Play, Upload, TrendingUp, Star, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-navy)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen color="#fff" size={16} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', margin: 0 }}>Apex Academy</h2>
            <span style={{ fontSize: '10px', color: 'var(--text-light)', letterSpacing: '1px' }}>EXECUTIVE PORTAL</span>
          </div>
        </div>

        <div style={{ padding: '0 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E2E8F0', flexShrink: 0 }}></div>
            <div>
                <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>Dr. Elias Vance</p>
                <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: 0 }}>Apex Academy Member</p>
            </div>
        </div>

        <div className="sidebar-nav">
          <Link to="#" className="nav-item active"><LayoutDashboard size={18} /> Dashboard</Link>
          <Link to="#" className="nav-item"><Calendar size={18} /> Schedule</Link>
          <Link to="#" className="nav-item"><Users size={18} /> Attendance</Link>
          <Link to="#" className="nav-item"><Star size={18} /> Gradebook</Link>
          <Link to="#" className="nav-item"><MessageSquare size={18} /> Doubt Center</Link>
          <Link to="#" className="nav-item"><FileText size={18} /> Lesson Plan</Link>
        </div>

        <div style={{ marginTop: 'auto', padding: '24px' }}>
             <button className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }}>Upgrade Plan</button>
             <Link to="#" className="nav-item" style={{ padding: 0, marginBottom: '16px' }}><HelpCircle size={18} /> Help Center</Link>
             <Link to="/" className="nav-item" style={{ padding: 0 }}><Settings size={18} /> Logout</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="flex justify-between items-center" style={{ marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', marginBottom: '4px' }}>Executive Dashboard</h1>
            <p style={{ color: 'var(--text-light)', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Monday, October 21st</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn btn-secondary"><Play size={16} style={{ marginRight: '8px' }}/> Start Class</button>
            <button className="btn btn-primary"><Upload size={16} style={{ marginRight: '8px' }}/> Upload Notes</button>
            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><Bell size={20} color="var(--text-light)" /></button>
            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><Search size={20} color="var(--text-light)" /></button>
          </div>
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column */}
          <div className="flex" style={{ flexDirection: 'column', gap: '24px' }}>
            {/* Daily Schedule */}
            <div className="card">
                <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
                    <div>
                        <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Daily Schedule</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>You have 4 classes and 1 department meeting today.</p>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '600', borderBottom: '1px solid var(--text-dark)', cursor: 'pointer' }}>View Full Calendar</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                        { time: '09:00 AM', title: 'Advanced Macroeconomics', desc: 'Section A • Room 402 • 42 Students', status: 'LIVE NOW' },
                        { time: '11:30 AM', title: 'Data Structures & Algorithms', desc: 'Section C • Virtual Lab • 38 Students', status: 'UPCOMING' },
                        { time: '02:00 PM', title: 'Curriculum Review Meeting', desc: 'Faculty Lounge • Executive Board', status: 'UPCOMING' }
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '8px', borderLeft: item.status === 'LIVE NOW' ? '4px solid var(--accent-gold)' : '4px solid transparent', backgroundColor: item.status === 'LIVE NOW' ? '#FFFBEB' : '#F8FAFC' }}>
                            <div style={{ width: '80px', flexShrink: 0 }}>
                                <div style={{ fontSize: '14px', fontWeight: '600' }}>{item.time.split(' ')[0]}</div>
                                <div style={{ fontSize: '10px', color: 'var(--text-light)' }}>{item.time.split(' ')[1]}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>{item.title}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{item.desc}</div>
                            </div>
                            <div>
                                <div className="badge" style={{ backgroundColor: item.status === 'LIVE NOW' ? '#E0E7FF' : '#E2E8F0', color: item.status === 'LIVE NOW' ? '#3730A3' : '#64748B', fontSize: '10px', letterSpacing: '1px' }}>{item.status}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Student Gradebook */}
            <div className="card">
                <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px' }}>Student Gradebook</h3>
                    <div className="badge" style={{ backgroundColor: '#F1F5F9', color: 'var(--text-dark)' }}>Macroeconomics</div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-light)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', fontSize: '12px' }}>
                            <th style={{ padding: '12px 0', fontWeight: '600' }}>STUDENT NAME</th>
                            <th style={{ padding: '12px 0', fontWeight: '600', textAlign: 'center' }}>AVG. SCORE</th>
                            <th style={{ padding: '12px 0', fontWeight: '600', textAlign: 'center' }}>MIDTERM</th>
                            <th style={{ padding: '12px 0', fontWeight: '600', textAlign: 'center' }}>PROJECTS</th>
                            <th style={{ padding: '12px 0', fontWeight: '600', textAlign: 'right' }}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { init: 'JD', name: 'Julianna Devis', score: '98.5%', mid: '96/100', proj: '100/100', status: 'HONORS', color: '#FEF3C7', textColor: '#92400E' },
                            { init: 'MR', name: 'Marcus Rivera', score: '84.2%', mid: '82/100', proj: '88/100', status: 'STABLE', color: '#F1F5F9', textColor: '#475569' },
                            { init: 'SC', name: 'Sarah Chen', score: '72.0%', mid: '68/100', proj: '75/100', status: 'AT RISK', color: '#FEE2E2', textColor: '#991B1B' }
                        ].map((student, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '16px 0', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '32px', height: '32px', backgroundColor: '#E2E8F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', color: '#64748B' }}>{student.init}</div>
                                    {student.name}
                                </td>
                                <td style={{ padding: '16px 0', fontWeight: '600', textAlign: 'center' }}>{student.score}</td>
                                <td style={{ padding: '16px 0', color: 'var(--text-light)', textAlign: 'center' }}>{student.mid}</td>
                                <td style={{ padding: '16px 0', color: 'var(--text-light)', textAlign: 'center' }}>{student.proj}</td>
                                <td style={{ padding: '16px 0', textAlign: 'right' }}><span className="badge" style={{ backgroundColor: student.color, color: student.textColor, fontSize: '10px' }}>{student.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex" style={{ flexDirection: 'column', gap: '24px' }}>
            {/* Attendance Tracker */}
            <div className="card" style={{ backgroundColor: 'var(--primary-navy)', color: '#fff' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
                    Attendance Tracker <TrendingUp size={18} color="var(--accent-gold)" />
                </h3>
                <div style={{ fontSize: '10px', color: '#CBD5E1', letterSpacing: '1px', marginBottom: '8px', fontWeight: '600' }}>AVERAGE DAILY TURNOUT</div>
                <div style={{ fontSize: '40px', fontWeight: 'bold', color: 'var(--accent-gold)', marginBottom: '40px' }}>94.2%</div>
                <p style={{ fontSize: '12px', color: '#CBD5E1', fontStyle: 'italic', opacity: 0.8 }}>Real-time update: 3 students currently absent in Section A.</p>
            </div>

            {/* AI Lesson Planner */}
            <div className="card" style={{ backgroundColor: '#FDF7E1' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={18} fill="currentColor" color="#D97706" /> AI Lesson Planner
                </h3>
                <div className="card" style={{ marginBottom: '16px', border: '1px solid #FDE68A', backgroundColor: '#fff', padding: '16px' }}>
                    <div style={{ fontSize: '10px', color: '#92400E', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>NEXT SESSION DRAFT</div>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Keynesian Equilibrium Models</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>Generating visual aids for multiplier effects and government spending...</p>
                </div>
                <button className="btn btn-secondary" style={{ width: '100%', fontSize: '12px' }}>Review & Finalize →</button>
            </div>

            {/* Doubt Center */}
            <div className="card">
                <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px' }}>Doubt Center</h3>
                    <div className="badge" style={{ backgroundColor: '#EF4444', color: '#fff', fontSize: '10px', padding: '2px 6px' }}>12</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
                    {[
                        { id: '4092', time: '12m ago', text: '"Can we clarify the distinction between..."' },
                        { id: '4088', time: '1h ago', text: '"Problem set 4, question 3 - the limit..."' },
                        { id: '4080', time: '✓', text: '"Will the exam cover international trad..."', resolved: true }
                    ].map((inq, i) => (
                        <div key={i} style={{ opacity: inq.resolved ? 0.5 : 1 }}>
                            <div className="flex justify-between" style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                                <span>Inquiry #{inq.id}</span>
                                <span style={{ color: 'var(--text-light)', fontWeight: 'normal' }}>{inq.time}</span>
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{inq.text}</div>
                            {i < 2 && <div style={{ height: '1px', backgroundColor: 'var(--border-color)', marginTop: '16px' }}></div>}
                        </div>
                    ))}
                </div>
                <button className="btn btn-outline" style={{ width: '100%', fontSize: '10px', padding: '8px', letterSpacing: '1px', fontWeight: '600' }}>MANAGE ALL DOUBTS</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

import React from 'react';
import { Book, Calendar, TrendingUp, Folder, Settings, Bell, User, Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-navy)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Book color="#fff" size={16} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', margin: 0 }}>Shree Academy</h2>
            <span style={{ fontSize: '10px', color: 'var(--text-light)', letterSpacing: '1px' }}>STUDENT PORTAL</span>
          </div>
        </div>

        <div className="sidebar-nav">
          <Link to="#" className="nav-item active"><TrendingUp size={18} /> Dashboard</Link>
          <Link to="#" className="nav-item"><Book size={18} /> My Courses</Link>
          <Link to="#" className="nav-item"><Calendar size={18} /> Schedule</Link>
          <Link to="#" className="nav-item"><TrendingUp size={18} /> Performance</Link>
          <Link to="#" className="nav-item"><Folder size={18} /> Resources</Link>
          <Link to="#" className="nav-item"><Settings size={18} /> Settings</Link>
        </div>

        <div style={{ marginTop: 'auto', padding: '24px' }}>
             <button className="btn btn-primary" style={{ width: '100%' }}>Upgrade Plan</button>
             <Link to="/" className="nav-item" style={{ marginTop: '16px', padding: 0 }}><Settings size={18} /> Logout</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="flex justify-between items-center" style={{ marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', marginBottom: '4px' }}>Welcome back, Vedant</h1>
            <p style={{ color: 'var(--text-light)' }}>You have 2 live classes today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Search courses..." style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '250px' }} />
            </div>
            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><Bell size={20} color="var(--text-light)" /></button>
            <div style={{ width: '36px', height: '36px', backgroundColor: 'var(--border-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="var(--primary-navy)" />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column */}
          <div className="flex" style={{ flexDirection: 'column', gap: '24px' }}>
            {/* Hero Card */}
            <div className="card" style={{ backgroundColor: 'var(--primary-navy)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ maxWidth: '60%' }}>
                <div className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--accent-gold)', marginBottom: '16px' }}>CURRENT MILESTONE</div>
                <h2 style={{ fontSize: '28px', color: '#fff', marginBottom: '16px' }}>Mastering Thermodynamics</h2>
                <p style={{ color: '#CBD5E1', marginBottom: '24px', fontSize: '14px' }}>Keep it up! You're in the top 5% of students this month. Complete today's module to earn the "Heat Master" badge.</p>
                <div className="flex gap-4">
                  <button className="btn btn-primary" style={{ padding: '8px 24px' }}>Continue Course</button>
                  <button className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}>View Syllabus</button>
                </div>
              </div>
              <div style={{ position: 'relative', width: '150px', height: '150px', borderRadius: '50%', border: '8px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h2 style={{ fontSize: '32px', color: '#fff', margin: 0 }}>80%<span style={{ fontSize: '12px', display: 'block', textAlign: 'center', fontWeight: 'normal', color: '#CBD5E1' }}>DONE</span></h2>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', backgroundColor: 'var(--accent-gold)', borderRadius: '50%', padding: '8px' }}>
                    <Star size={16} color="var(--primary-navy)" fill="var(--primary-navy)" />
                </div>
              </div>
            </div>

            {/* My Courses */}
            <div>
              <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
                 <h3 style={{ fontSize: '18px' }}>My Courses</h3>
                 <span style={{ fontSize: '14px', color: 'var(--text-light)', cursor: 'pointer' }}>View All Trackers</span>
              </div>
              <div className="flex gap-4">
                {[
                  { name: 'Physics', sub: 'Quantum Mechanics', progress: 64, icon: '⚛️' },
                  { name: 'Chemistry', sub: 'Organic Synthesis', progress: 92, icon: '🧪' },
                  { name: 'Mathematics', sub: 'Vector Calculus', progress: 45, icon: '∑' }
                ].map((course, i) => (
                  <div key={i} className="card" style={{ flex: 1 }}>
                     <div style={{ width: '40px', height: '40px', backgroundColor: '#F1F5F9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>{course.icon}</div>
                     <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>{course.name}</h4>
                     <p style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '16px' }}>{course.sub}</p>
                     <div className="flex justify-between" style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '8px' }}>
                        <span>PROGRESS</span>
                        <span>{course.progress}%</span>
                     </div>
                     <div style={{ height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}>
                        <div style={{ height: '100%', width: `${course.progress}%`, backgroundColor: 'var(--primary-navy)', borderRadius: '2px' }}></div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
            
             {/* Mock Test Performance */}
            <div className="card">
                 <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Mock Test Performance</h3>
                 <p style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '24px' }}>Historical score trends for Semester 1</p>
                 <div style={{ height: '200px', backgroundColor: '#F8FAFC', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-color)' }}>
                    <span style={{ color: 'var(--text-light)', fontSize: '14px' }}>[Chart Placeholder]</span>
                 </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex" style={{ flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ backgroundColor: '#F8FAFC', border: 'none', padding: '24px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Upcoming Schedule</h3>
                {[
                    { date: '24', month: 'OCT', title: 'Advanced Dynamics Test', time: '10:00 AM - 12:30 PM' },
                    { date: '24', month: 'OCT', title: 'Live Coaching', time: 'Live with Prof. Aris', highlight: true }
                ].map((item, i) => (
                    <div key={i} className="card" style={{ display: 'flex', gap: '16px', padding: '16px', marginBottom: '12px', border: item.highlight ? '1px solid var(--accent-gold)' : 'none' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: 'var(--text-light)', fontWeight: 'bold' }}>{item.month}</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-navy)' }}>{item.date}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{item.title}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{item.time}</div>
                        </div>
                    </div>
                ))}
                <button className="btn btn-outline" style={{ width: '100%', marginTop: '8px' }}>Full Academic Calendar</button>
            </div>

            <div className="card" style={{ backgroundColor: '#0B1121', color: '#fff', padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '24px' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '16px' }}>Upcoming Live</h3>
                        <div style={{ width: '8px', height: '8px', backgroundColor: 'red', borderRadius: '50%' }}></div>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>STARTING IN 15 MINS</div>
                    <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Astrophysics: Galaxy Formation</h2>
                    <button className="btn btn-primary" style={{ width: '100%' }}><Play size={16} style={{ marginRight: '8px' }} /> Join Now</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

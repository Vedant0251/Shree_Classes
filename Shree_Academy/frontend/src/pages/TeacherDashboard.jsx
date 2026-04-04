import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, Users, FileText, BookOpen, Settings, Bell, Search, Upload, TrendingUp, Star, BarChart, LogOut, File, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, storage, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const TeacherDashboard = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [scheduleSubject, setScheduleSubject] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const [scheduleMedium, setScheduleMedium] = useState('English');
    const [scheduleClass, setScheduleClass] = useState('10th');
    
    const [resourceTitle, setResourceTitle] = useState('');
    const [resourceFile, setResourceFile] = useState(null);
    const [resourceMedium, setResourceMedium] = useState('English');
    const [resourceClass, setResourceClass] = useState('10th');
    const [uploading, setUploading] = useState(false);

    const [lectures, setLectures] = useState([]);
    const [resources, setResources] = useState([]);

    const [userProfile, setUserProfile] = useState(null);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [scheduleDateFilter, setScheduleDateFilter] = useState('');

    const userName = auth.currentUser?.displayName || 'Faculty Account';

    const fetchUserData = async () => {
        if (auth.currentUser) {
            try {
                const d = await getDoc(doc(db, 'users', auth.currentUser.uid));
                if (d.exists()) {
                    const data = d.data();
                    setUserProfile({ id: d.id, ...data });
                    setEditName(data.name || '');
                    setEditPhone(data.phone || '');
                }
            } catch (e) { console.error(e); }
        }
    };

    const fetchData = async () => {
        try {
            const qLec = query(collection(db, 'lectures'), orderBy('time', 'asc'), limit(20));
            const snap = await getDocs(qLec);
            const data = [];
            snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
            setLectures(data.filter(l => new Date(l.time) >= new Date(new Date().setHours(0,0,0,0))));

            const qRes = query(collection(db, 'resources'), orderBy('createdAt', 'desc'), limit(20));
            const snapRes = await getDocs(qRes);
            const rData = [];
            snapRes.forEach(doc => rData.push({ id: doc.id, ...doc.data() }));
            setResources(rData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
        if (activeTab === 'Dashboard' || activeTab === 'Schedule' || activeTab === 'Resources' || activeTab === 'Settings') {
            fetchData();
        }
    }, [activeTab]);

    const handleScheduleLecture = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'lectures'), {
                subject: scheduleSubject,
                time: scheduleTime,
                courseMedium: scheduleMedium,
                courseClass: scheduleClass,
                scheduledBy: userName,
                createdAt: serverTimestamp()
            });
            alert('Lecture Scheduled Successfully!');
            setScheduleSubject('');
            setScheduleTime('');
            fetchData();
        } catch(error) {
            console.error(error);
            alert('Failed to schedule lecture');
        }
    };

    const handleDeleteLecture = async (id) => {
        if(window.confirm('Delete this scheduled lecture?')) {
            try {
                await deleteDoc(doc(db, 'lectures', id));
                fetchData();
            } catch(e) { console.error(e); }
        }
    }

    const handleAddResource = async (e) => {
        e.preventDefault();
        if (!resourceFile) {
            alert('Please select a file to upload.');
            return;
        }
        
        try {
            setUploading(true);
            const fileRef = ref(storage, `resources/${Date.now()}_${resourceFile.name}`);
            const snapshot = await uploadBytes(fileRef, resourceFile);
            const downloadUrl = await getDownloadURL(snapshot.ref);

            await addDoc(collection(db, 'resources'), {
                title: resourceTitle,
                url: downloadUrl,
                storagePath: fileRef.fullPath,
                courseMedium: resourceMedium,
                courseClass: resourceClass,
                uploadedBy: userName,
                createdAt: serverTimestamp()
            });
            alert('Resource Uploaded Successfully!');
            setResourceTitle('');
            setResourceFile(null);
            fetchData();
        } catch(error) {
            console.error(error);
            alert('Failed to upload resource');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteResource = async (resObj) => {
        if(window.confirm('Delete this file permanently?')) {
            try {
                await deleteDoc(doc(db, 'resources', resObj.id));
                if (resObj.storagePath) {
                    await deleteObject(ref(storage, resObj.storagePath));
                }
                fetchData();
            } catch(e) { console.error(e); }
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
               name: editName,
               phone: editPhone
            });
            alert('Profile successfully updated!');
            fetchUserData();
        } catch (err) {
            console.error(err);
            alert('Failed to update profile.');
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <div className="sidebar">
                <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-navy)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen color="#fff" size={16} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '16px', margin: 0 }}>Shree Classes</h2>
                        <span style={{ fontSize: '10px', color: 'var(--text-light)', letterSpacing: '1px' }}>EXECUTIVE PORTAL</span>
                    </div>
                </div>

                <div style={{ padding: '0 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E2E8F0', flexShrink: 0 }}></div>
                    <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>{userName}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: 0 }}>Educator Portal</p>
                    </div>
                </div>

                <div className="sidebar-nav">
                    {['Dashboard', 'Schedule', 'Resources', 'Performance', 'Settings'].map(tab => (
                        <div 
                            key={tab} 
                            onClick={() => setActiveTab(tab)} 
                            className={`nav-item ${activeTab === tab ? 'active' : ''}`} 
                            style={{ cursor: 'pointer', position: 'relative' }}
                        >
                            {tab === 'Dashboard' && <LayoutDashboard size={18} />}
                            {tab === 'Schedule' && <Calendar size={18} />}
                            {tab === 'Performance' && <BarChart size={18} />}
                            {tab === 'Resources' && <BookOpen size={18} />}
                            {tab === 'Settings' && <Settings size={18} />}
                            {tab}
                            {/* Dynamic Red Dot Indicators */}
                            {tab === 'Schedule' && lectures.length > 0 && <div style={{ width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', position: 'absolute', right: '16px' }} />}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 'auto', padding: '24px' }}>
                    <Link to="/" className="nav-item" style={{ padding: 0 }}><LogOut size={18} /> Logout</Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <div className="flex justify-between items-center" style={{ marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', marginBottom: '4px' }}>{activeTab}</h1>
                        <p style={{ color: 'var(--text-light)', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Faculty Overview</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setActiveTab('Resources')} className="btn btn-primary"><Upload size={16} style={{ marginRight: '8px' }} /> Upload Notes</button>
                        
                        <div onClick={() => setActiveTab('Settings')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', backgroundColor: '#F8FAFC', padding: '8px 16px', borderRadius: '99px', border: '1px solid var(--border-color)', marginLeft: '12px' }}>
                            <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-navy)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '16px' }}>👨‍🏫</span>
                            </div>
                            <div style={{ paddingRight: '4px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{userName}</div>
                                <div style={{ fontSize: '10px', color: 'var(--text-light)' }}>View Profile</div>
                            </div>
                        </div>
                    </div>
                </div>

                {activeTab === 'Dashboard' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                        {/* Left Column */}
                        <div className="flex" style={{ flexDirection: 'column', gap: '24px' }}>
                            {/* Daily Schedule */}
                            <div className="card">
                                <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Upcoming Schedule</h3>
                                        <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>Your registered lectures.</p>
                                    </div>
                                    <span onClick={() => setActiveTab('Schedule')} style={{ fontSize: '14px', fontWeight: '600', borderBottom: '1px solid var(--text-dark)', cursor: 'pointer' }}>Manage Schedule</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {lectures.length > 0 ? lectures.map((item, i) => {
                                        const d = new Date(item.time);
                                        const timeStr = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                                        const isToday = d.toDateString() === new Date().toDateString();
                                        return (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '8px', borderLeft: isToday ? '4px solid var(--accent-gold)' : '4px solid transparent', backgroundColor: isToday ? '#FFFBEB' : '#F8FAFC' }}>
                                                <div style={{ width: '80px', flexShrink: 0 }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{timeStr}</div>
                                                    <div style={{ fontSize: '10px', color: 'var(--text-light)' }}>{d.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</div>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>{item.subject}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{item.courseMedium} • {item.courseClass} Standard</div>
                                                </div>
                                                <div>
                                                    <button onClick={() => handleDeleteLecture(item.id)} style={{ border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', padding: '8px' }} title="Delete Lecture"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        )
                                    }) : (
                                        <div style={{ padding: '16px', color: 'var(--text-light)', textAlign: 'center' }}>No upcoming schedules active.</div>
                                    )}
                                </div>
                            </div>

                            {/* Student Gradebook */}
                            <div className="card">
                                <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '18px' }}>Active Student Performance</h3>
                                </div>
                                <p style={{ color: 'var(--text-light)', fontSize: '13px' }}>System awaiting real data mapping.</p>
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
                            </div>
                        </div>
                    </div>
                )}

                {/* Schedule Tab */}
                {activeTab === 'Schedule' && (
                    <div className="card" style={{ maxWidth: '600px', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Schedule a New Lecture</h2>
                        <form onSubmit={handleScheduleLecture} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Subject / Topic</label>
                                <input required type="text" value={scheduleSubject} onChange={e => setScheduleSubject(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }} placeholder="E.g., Marathi Grammar" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Date & Time</label>
                                <input required type="datetime-local" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Medium Target</label>
                                    <select value={scheduleMedium} onChange={e => setScheduleMedium(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                                        <option value="English">English</option>
                                        <option value="Marathi">Marathi</option>
                                        <option value="Foundation">Foundation</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Class Standard Target</label>
                                    <select value={scheduleClass} onChange={e => setScheduleClass(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                                        <option value="3rd">3rd Standard</option>
                                        <option value="4th">4th Standard</option>
                                        <option value="5th">5th Standard</option>
                                        <option value="6th">6th Standard</option>
                                        <option value="7th">7th Standard</option>
                                        <option value="8th">8th Standard</option>
                                        <option value="9th">9th Standard</option>
                                        <option value="10th">10th Standard</option>
                                        <option value="General">General / All</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ padding: '14px' }}>Schedule Lecture</button>
                        </form>
                        
                        <div style={{ marginTop: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '18px' }}>Active Master Schedule</h3>
                                <input type="date" value={scheduleDateFilter} onChange={e => setScheduleDateFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {lectures.filter(l => scheduleDateFilter ? new Date(l.time).toISOString().split('T')[0] === scheduleDateFilter : true).length > 0 ? lectures.filter(l => scheduleDateFilter ? new Date(l.time).toISOString().split('T')[0] === scheduleDateFilter : true).map((item, i) => {
                                    const d = new Date(item.time);
                                    const isToday = d.toDateString() === new Date().toDateString();
                                    return (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '8px', borderLeft: isToday ? '4px solid var(--accent-gold)' : '4px solid transparent', backgroundColor: isToday ? '#FFFBEB' : '#F8FAFC', border: '1px solid var(--border-color)' }}>
                                            <div style={{ width: '80px', flexShrink: 0 }}>
                                                <div style={{ fontSize: '14px', fontWeight: '600' }}>{d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                                <div style={{ fontSize: '10px', color: 'var(--text-light)' }}>{d.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</div>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>{item.subject}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{item.courseMedium} • {item.courseClass} Standard</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div className="badge" style={{ backgroundColor: '#E0E7FF', color: 'var(--primary-navy)' }}>{item.scheduledBy || 'Faculty'}</div>
                                                <button onClick={() => handleDeleteLecture(item.id)} style={{ backgroundColor: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }} title="Delete Lecture"><Trash2 size={18}/></button>
                                            </div>
                                        </div>
                                    )
                                }) : (
                                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>No upcoming lectures for this date.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Resources Tab */}
                {activeTab === 'Resources' && (
                    <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1fr 1fr' }}>
                        <div className="card">
                            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Upload Material / Notes</h2>
                            <p style={{ color: 'var(--text-light)', fontSize: '13px', marginBottom: '24px' }}>Distribute files directly to students via the portal.</p>
                            <form onSubmit={handleAddResource} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Material Title</label>
                                    <input required type="text" value={resourceTitle} onChange={e => setResourceTitle(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }} placeholder="E.g., Chapter 1 Algebra Notes" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Browse File</label>
                                    <input required type="file" onChange={e => setResourceFile(e.target.files[0])} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px dashed var(--border-color)', fontSize: '14px', outline: 'none', backgroundColor: '#F8FAFC', cursor: 'pointer' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Target Medium</label>
                                        <select value={resourceMedium} onChange={e => setResourceMedium(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                                            <option value="English">English</option>
                                            <option value="Marathi">Marathi</option>
                                            <option value="Foundation">Foundation</option>
                                        </select>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Target Class</label>
                                        <select value={resourceClass} onChange={e => setResourceClass(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                                            <option value="3rd">3rd Standard</option>
                                            <option value="4th">4th Standard</option>
                                            <option value="5th">5th Standard</option>
                                            <option value="6th">6th Standard</option>
                                            <option value="7th">7th Standard</option>
                                            <option value="8th">8th Standard</option>
                                            <option value="9th">9th Standard</option>
                                            <option value="10th">10th Standard</option>
                                            <option value="General">General / All</option>
                                        </select>
                                    </div>
                                </div>
                                <button disabled={uploading} type="submit" className="btn btn-primary" style={{ padding: '14px' }}>{uploading ? 'Uploading...' : 'Distribute Material'}</button>
                            </form>
                        </div>
                        
                        <div className="card">
                            <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Active Uploads</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {resources.length > 0 ? resources.map((res, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '14px', fontWeight: '600' }}>{res.title}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>{res.courseMedium} • {res.courseClass} • {new Date(res.createdAt?.toDate()).toLocaleDateString()}</div>
                                        </div>
                                        <div>
                                            <button onClick={() => handleDeleteResource(res)} style={{ backgroundColor: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '8px' }} title="Delete Resource"><Trash2 size={16}/></button>
                                            <a href={res.url} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px', marginLeft: '8px' }}>Open</a>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-light)' }}>No active resources uploaded.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {['Performance'].includes(activeTab) && (
                    <div className="card" style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--border-color)' }}>
                        <div style={{ width: '64px', height: '64px', backgroundColor: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <BarChart size={32} color="var(--primary-navy)" />
                        </div>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--primary-navy)' }}>{activeTab} Module</h2>
                        <p style={{ color: 'var(--text-light)', maxWidth: '400px', margin: '0 auto' }}>
                            Real-time analytics for your class average marks and student progression tracking.
                        </p>
                    </div>
                )}
                
                {['Settings'].includes(activeTab) && (
                    <div className="card">
                        <h2 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Settings size={20} /> Portal Settings</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Edit Personal Profile</h3>
                                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-light)' }}>Full Name</label>
                                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-light)' }}>Contact Phone</label>
                                        <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
                                    </div>
                                    <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-light)' }}>Email Address (Read Only)</label>
                                        <div style={{ fontSize: '14px', color: 'var(--text-dark)' }}>{userProfile?.email || 'N/A'}</div>
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ padding: '12px', marginTop: '8px' }}>Save Profile Changes</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default TeacherDashboard;

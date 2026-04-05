import React, { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, Calendar, BookOpen, Settings, Bell, Search, Upload, TrendingUp, BarChart, LogOut, Trash2, ClipboardList } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db, storage, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, deleteDoc, doc, getDoc, updateDoc, where, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [accessOk, setAccessOk] = useState(false);
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
    const [notices, setNotices] = useState([]);
    
    const [noticeTitle, setNoticeTitle] = useState('');
    const [noticeContent, setNoticeContent] = useState('');
    const [noticeMedium, setNoticeMedium] = useState('English');
    const [noticeClass, setNoticeClass] = useState('10th');

    const [userProfile, setUserProfile] = useState(null);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [scheduleDateFilter, setScheduleDateFilter] = useState('');

    const [hwTitle, setHwTitle] = useState('');
    const [hwDescription, setHwDescription] = useState('');
    const [hwSubject, setHwSubject] = useState('');
    const [hwDueDate, setHwDueDate] = useState('');
    const [hwFile, setHwFile] = useState(null);
    const [hwTargetType, setHwTargetType] = useState('class');
    const [hwMedium, setHwMedium] = useState('English');
    const [hwClass, setHwClass] = useState('10th');
    const [hwSelectedStudentIds, setHwSelectedStudentIds] = useState([]);
    const [hwStudentSearch, setHwStudentSearch] = useState('');
    const [studentsList, setStudentsList] = useState([]);
    const [homeworkAssignments, setHomeworkAssignments] = useState([]);
    const [hwSubmitting, setHwSubmitting] = useState(false);

    const userName = auth.currentUser?.displayName || 'Faculty Account';

    const filteredStudentsForPicker = useMemo(() => {
        const q = hwStudentSearch.trim().toLowerCase();
        if (!q) return studentsList;
        return studentsList.filter((s) => {
            const label = `${s.name || ''} ${s.email || ''} ${s.courseMedium || ''} ${s.courseClass || ''}`.toLowerCase();
            return label.includes(q);
        });
    }, [studentsList, hwStudentSearch]);

    const loadTeacherAccess = async () => {
        if (!auth.currentUser) {
            navigate('/auth', { replace: true });
            return;
        }
        try {
            const d = await getDoc(doc(db, 'users', auth.currentUser.uid));
            const data = d.data();
            if (!d.exists() || data?.role !== 'teacher' || data?.status !== 'approved') {
                navigate('/auth', { replace: true });
                return;
            }
            setUserProfile({ id: d.id, ...data });
            setEditName(data.name || '');
            setEditPhone(data.phone || '');
            setAccessOk(true);
        } catch (e) {
            console.error(e);
            navigate('/auth', { replace: true });
        }
    };

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

    const fetchStudentsForHomework = async () => {
        try {
            const snap = await getDocs(collection(db, 'users'));
            const list = [];
            snap.forEach((d) => {
                const u = d.data();
                if (u.role === 'student' && u.status === 'approved') {
                    list.push({
                        id: d.id,
                        name: u.name || u.email || 'Student',
                        email: u.email || '',
                        courseMedium: u.courseMedium || '',
                        courseClass: u.courseClass || '',
                    });
                }
            });
            list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            setStudentsList(list);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchTeacherHomework = async () => {
        if (!auth.currentUser) return;
        try {
            const qHw = query(collection(db, 'homeworkAssignments'), where('teacherId', '==', auth.currentUser.uid));
            const snap = await getDocs(qHw);
            const rows = [];
            snap.forEach((d) => rows.push({ id: d.id, ...d.data() }));
            rows.sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0));
            setHomeworkAssignments(rows);
        } catch (e) {
            console.error(e);
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

            const qNot = query(collection(db, 'notices'), orderBy('createdAt', 'desc'), limit(20));
            const snapNot = await getDocs(qNot);
            const nData = [];
            snapNot.forEach(doc => nData.push({ id: doc.id, ...doc.data() }));
            setNotices(nData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        loadTeacherAccess();
    }, [navigate]);

    useEffect(() => {
        if (!accessOk) return;
        if (activeTab === 'Dashboard' || activeTab === 'Schedule' || activeTab === 'Resources' || activeTab === 'Settings' || activeTab === 'Notices') {
            fetchData();
        }
        if (activeTab === 'Homework') {
            fetchStudentsForHomework();
            fetchTeacherHomework();
        }
    }, [activeTab, accessOk]);

    const toggleHwStudent = (studentId) => {
        setHwSelectedStudentIds((prev) =>
            prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
        );
    };

    const handleAssignHomework = async (e) => {
        e.preventDefault();
        if (!auth.currentUser) return;
        if (!hwDueDate) {
            alert('Please set a due date.');
            return;
        }
        if (hwTargetType === 'students' && hwSelectedStudentIds.length === 0) {
            alert('Select at least one student, or switch to “Class / group”.');
            return;
        }
        setHwSubmitting(true);
        try {
            let attachmentUrl = null;
            let attachmentPath = null;
            let attachmentName = null;
            if (hwFile) {
                const safeName = hwFile.name.replace(/[^\w.-]+/g, '_');
                const path = `homework-attachments/${auth.currentUser.uid}/${Date.now()}_${safeName}`;
                const fileRef = ref(storage, path);
                await uploadBytes(fileRef, hwFile);
                attachmentUrl = await getDownloadURL(fileRef);
                attachmentPath = fileRef.fullPath;
                attachmentName = hwFile.name;
            }

            await addDoc(collection(db, 'homeworkAssignments'), {
                title: hwTitle.trim(),
                description: hwDescription.trim(),
                subject: hwSubject.trim(),
                dueDate: Timestamp.fromDate(new Date(hwDueDate)),
                teacherId: auth.currentUser.uid,
                teacherName: userName,
                targetType: hwTargetType,
                courseMedium: hwTargetType === 'class' ? hwMedium : null,
                courseClass: hwTargetType === 'class' ? hwClass : null,
                assignedStudentIds: hwTargetType === 'students' ? hwSelectedStudentIds : [],
                attachmentUrl,
                attachmentPath,
                attachmentName,
                createdAt: serverTimestamp(),
            });

            alert('Homework assigned successfully.');
            setHwTitle('');
            setHwDescription('');
            setHwSubject('');
            setHwDueDate('');
            setHwFile(null);
            setHwSelectedStudentIds([]);
            fetchTeacherHomework();
        } catch (err) {
            console.error(err);
            alert('Failed to assign homework.');
        } finally {
            setHwSubmitting(false);
        }
    };

    const handleDeleteHomework = async (row) => {
        if (!window.confirm('Remove this homework assignment? Students will no longer see it.')) return;
        try {
            await deleteDoc(doc(db, 'homeworkAssignments', row.id));
            if (row.attachmentPath) {
                try {
                    await deleteObject(ref(storage, row.attachmentPath));
                } catch (storageErr) {
                    console.warn(storageErr);
                }
            }
            fetchTeacherHomework();
        } catch (e) {
            console.error(e);
            alert('Could not delete assignment.');
        }
    };

    const handleAddNotice = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'notices'), {
                title: noticeTitle,
                content: noticeContent,
                courseMedium: noticeMedium,
                courseClass: noticeClass,
                postedBy: userName,
                createdAt: serverTimestamp()
            });
            alert('Notice Published Successfully!');
            setNoticeTitle('');
            setNoticeContent('');
            fetchData();
        } catch(error) { console.error(error); alert('Failed to publish notice.'); }
    };

    const handleDeleteNotice = async (id) => {
        if(window.confirm('Permanently delete this notice for students?')) {
            try {
                await deleteDoc(doc(db, 'notices', id));
                fetchData();
            } catch(e) { console.error(e); }
        }
    };

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

    if (!accessOk) {
        return (
            <div className="dashboard-layout" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--text-light)', fontSize: '15px' }}>Verifying faculty access…</p>
            </div>
        );
    }

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
                    {['Dashboard', 'Notices', 'Schedule', 'Resources', 'Homework', 'Performance', 'Settings'].map(tab => (
                        <div 
                            key={tab} 
                            onClick={() => setActiveTab(tab)} 
                            className={`nav-item ${activeTab === tab ? 'active' : ''}`} 
                            style={{ cursor: 'pointer', position: 'relative' }}
                        >
                            {tab === 'Dashboard' && <LayoutDashboard size={18} />}
                            {tab === 'Notices' && <Bell size={18} />}
                            {tab === 'Schedule' && <Calendar size={18} />}
                            {tab === 'Performance' && <BarChart size={18} />}
                            {tab === 'Resources' && <BookOpen size={18} />}
                            {tab === 'Homework' && <ClipboardList size={18} />}
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

                {/* Notices Tab */}
                {activeTab === 'Notices' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="card">
                            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Post a New Notice</h2>
                            <p style={{ color: 'var(--text-light)', fontSize: '13px', marginBottom: '24px' }}>Target notices to specific classes or mediums.</p>
                            <form onSubmit={handleAddNotice} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Notice Title</label>
                                    <input required type="text" value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }} placeholder="E.g., Tomorrow's class timing change" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Notice Content</label>
                                    <textarea required value={noticeContent} onChange={e => setNoticeContent(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none', minHeight: '120px' }} placeholder="Provide details about the notice..."></textarea>
                                </div>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Target Medium</label>
                                        <select value={noticeMedium} onChange={e => setNoticeMedium(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                                            <option value="English">English</option>
                                            <option value="Marathi">Marathi</option>
                                            <option value="Foundation">Foundation</option>
                                            <option value="General">General / All</option>
                                        </select>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Target Class</label>
                                        <select value={noticeClass} onChange={e => setNoticeClass(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
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
                                <button type="submit" className="btn btn-primary" style={{ padding: '14px' }}>Publish Notice</button>
                            </form>
                        </div>

                        <div className="card">
                            <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>History of Notices</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {notices.length > 0 ? notices.map((not, i) => (
                                    <div key={i} style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>
                                                    {not.createdAt ? new Date(not.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                                                </div>
                                                <div style={{ fontSize: '10px', color: 'var(--primary-navy)', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '2px' }}>
                                                    Target: {not.courseMedium} Medium • {not.courseClass}
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeleteNotice(not.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--primary-navy)', marginBottom: '4px' }}>{not.title}</h4>
                                        <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>{not.content}</p>
                                    </div>
                                )) : (
                                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-light)' }}>
                                        No notices found.
                                    </div>
                                )}
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

                {activeTab === 'Homework' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
                        <div className="card">
                            <h2 style={{ fontSize: '20px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ClipboardList size={22} color="var(--accent-gold)" /> Assign homework
                            </h2>
                            <p style={{ color: 'var(--text-light)', fontSize: '13px', marginBottom: '24px', lineHeight: 1.5 }}>
                                Create tasks for a class group or hand-pick students. Optional PDF or document attachment.
                            </p>
                            <form onSubmit={handleAssignHomework} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Title</label>
                                    <input required type="text" value={hwTitle} onChange={(e) => setHwTitle(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }} placeholder="E.g., Algebra problem set" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Description</label>
                                    <textarea required value={hwDescription} onChange={(e) => setHwDescription(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none', minHeight: '100px' }} placeholder="Instructions, chapter references, etc." />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Subject</label>
                                    <input required type="text" value={hwSubject} onChange={(e) => setHwSubject(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }} placeholder="E.g., Mathematics" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Due date & time</label>
                                    <input required type="datetime-local" value={hwDueDate} onChange={(e) => setHwDueDate(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Supporting file (optional)</label>
                                    <input type="file" accept=".pdf,.doc,.docx,application/pdf" onChange={(e) => setHwFile(e.target.files?.[0] || null)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px dashed var(--border-color)', fontSize: '14px', outline: 'none', backgroundColor: '#F8FAFC', cursor: 'pointer' }} />
                                    <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '6px' }}>PDF recommended; Word documents also accepted.</p>
                                </div>

                                <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>Who should receive this?</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
                                            <input type="radio" name="hwTarget" checked={hwTargetType === 'class'} onChange={() => setHwTargetType('class')} />
                                            Class / group (medium + standard)
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
                                            <input type="radio" name="hwTarget" checked={hwTargetType === 'students'} onChange={() => setHwTargetType('students')} />
                                            Specific students
                                        </label>
                                    </div>
                                </div>

                                {hwTargetType === 'class' && (
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Medium</label>
                                            <select value={hwMedium} onChange={(e) => setHwMedium(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                                                <option value="English">English</option>
                                                <option value="Marathi">Marathi</option>
                                                <option value="Foundation">Foundation</option>
                                                <option value="General">General / All</option>
                                            </select>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Standard</label>
                                            <select value={hwClass} onChange={(e) => setHwClass(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
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
                                )}

                                {hwTargetType === 'students' && (
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Search students</label>
                                        <div style={{ position: 'relative', marginBottom: '10px' }}>
                                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                            <input type="text" value={hwStudentSearch} onChange={(e) => setHwStudentSearch(e.target.value)} placeholder="Name, email, class…" style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }} />
                                        </div>
                                        <div style={{ maxHeight: '220px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#fff' }}>
                                            {filteredStudentsForPicker.length > 0 ? filteredStudentsForPicker.map((s) => (
                                                <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '13px' }}>
                                                    <input type="checkbox" checked={hwSelectedStudentIds.includes(s.id)} onChange={() => toggleHwStudent(s.id)} />
                                                    <span style={{ flex: 1 }}>
                                                        <span style={{ fontWeight: '600' }}>{s.name}</span>
                                                        <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '11px' }}>{s.courseMedium} • {s.courseClass}</span>
                                                    </span>
                                                </label>
                                            )) : (
                                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-light)', fontSize: '13px' }}>No approved students found.</div>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '8px' }}>{hwSelectedStudentIds.length} student(s) selected</p>
                                    </div>
                                )}

                                <button disabled={hwSubmitting} type="submit" className="btn btn-primary" style={{ padding: '14px' }}>
                                    {hwSubmitting ? 'Assigning…' : 'Assign homework'}
                                </button>
                            </form>
                        </div>

                        <div className="card">
                            <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Your assignments</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {homeworkAssignments.length > 0 ? homeworkAssignments.map((hw) => {
                                    const due = hw.dueDate?.toDate ? hw.dueDate.toDate() : null;
                                    return (
                                        <div key={hw.id} style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid var(--border-color)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600', marginBottom: '4px' }}>
                                                        {hw.subject} • Due {due ? due.toLocaleString() : '—'}
                                                    </div>
                                                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--primary-navy)', marginBottom: '6px' }}>{hw.title}</h4>
                                                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{hw.description}</p>
                                                    <div style={{ fontSize: '11px', color: 'var(--primary-navy)', fontWeight: '600', textTransform: 'uppercase', marginTop: '8px' }}>
                                                        {hw.targetType === 'class' ? `Class: ${hw.courseMedium} • ${hw.courseClass}` : `Students: ${(hw.assignedStudentIds || []).length}`}
                                                    </div>
                                                    {hw.attachmentUrl && (
                                                        <a href={hw.attachmentUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px', marginTop: '10px', display: 'inline-block', textDecoration: 'none' }}>Download attachment</a>
                                                    )}
                                                </div>
                                                <button type="button" onClick={() => handleDeleteHomework(hw)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', flexShrink: 0 }} title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-light)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                                        No homework assigned yet.
                                    </div>
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

import React, { useState, useEffect, useRef } from 'react';
import { Book, Calendar, Folder, Settings, Bell, User, Star, LogOut, LayoutDashboard, FileText, CreditCard, ScrollText, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import { collection, query, orderBy, getDocs, limit, where, getDoc, doc, addDoc, serverTimestamp, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [lectures, setLectures] = useState([]);
    const [resources, setResources] = useState([]);
    const [notices, setNotices] = useState([]);
    const [payments, setPayments] = useState([]);
    const [assignedHomework, setAssignedHomework] = useState([]);
    const [userProfile, setUserProfile] = useState(null);

    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');

    const [payAmount, setPayAmount] = useState('');
    const [uploading, setUploading] = useState(false);

    const [reportCardUpload, setReportCardUpload] = useState(null);
    const [homeworkSubmissionsMap, setHomeworkSubmissionsMap] = useState({});
    const [pdfUploading, setPdfUploading] = useState(null);
    const reportCardFileRef = useRef(null);
    const assignmentHwFileRef = useRef(null);
    const pendingHwAssignmentIdRef = useRef(null);

    const userName = auth.currentUser?.displayName || 'Student';

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

    const fetchContent = async () => {
        try {
            let qLec = query(collection(db, 'lectures'), orderBy('time', 'asc'), limit(20));
            let snapLec = await getDocs(qLec);
            let lecData = [];
            snapLec.forEach(d => lecData.push({ id: d.id, ...d.data() }));

            let qRes = query(collection(db, 'resources'), orderBy('createdAt', 'desc'), limit(20));
            let snapRes = await getDocs(qRes);
            let resData = [];
            snapRes.forEach(d => resData.push({ id: d.id, ...d.data() }));

            let qNot = query(collection(db, 'notices'), orderBy('createdAt', 'desc'), limit(20));
            let snapNot = await getDocs(qNot);
            let notData = [];
            snapNot.forEach(d => notData.push({ id: d.id, ...d.data() }));

            if (userProfile && userProfile.courseMedium && userProfile.courseClass) {
                lecData = lecData.filter(l => (l.courseMedium === userProfile.courseMedium || l.courseMedium === 'General') && (l.courseClass === userProfile.courseClass || l.courseClass === 'General'));
                resData = resData.filter(r => (r.courseMedium === userProfile.courseMedium || r.courseMedium === 'General') && (r.courseClass === userProfile.courseClass || r.courseClass === 'General'));
                notData = notData.filter(n => (n.courseMedium === userProfile.courseMedium || n.courseMedium === 'General') && (n.courseClass === userProfile.courseClass || n.courseClass === 'General'));
            }
            setLectures(lecData.filter(l => new Date(l.time) >= new Date(new Date().setHours(0, 0, 0, 0))));
            setResources(resData);
            setNotices(notData);

            if (auth.currentUser) {
                let qPay = query(collection(db, 'payments'), where('studentId', '==', auth.currentUser.uid));
                let snapPay = await getDocs(qPay);
                let pData = [];
                snapPay.forEach(d => pData.push({ id: d.id, ...d.data() }));
                // Order locally since compound query needs index
                pData.sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
                setPayments(pData);
            }

            let snapHw = await getDocs(collection(db, 'homeworkAssignments'));
            let hwData = [];
            snapHw.forEach((d) => hwData.push({ id: d.id, ...d.data() }));
            const uid = auth.currentUser?.uid;
            if (uid) {
                hwData = hwData.filter((hw) => {
                    if (hw.targetType === 'class') {
                        if (!userProfile?.courseMedium || !userProfile?.courseClass) return false;
                        return (hw.courseMedium === userProfile.courseMedium || hw.courseMedium === 'General')
                            && (hw.courseClass === userProfile.courseClass || hw.courseClass === 'General');
                    }
                    return Array.isArray(hw.assignedStudentIds) && hw.assignedStudentIds.includes(uid);
                });
            } else {
                hwData = [];
            }
            hwData.sort((a, b) => {
                const da = a.dueDate?.toDate ? a.dueDate.toDate() : new Date(0);
                const db = b.dueDate?.toDate ? b.dueDate.toDate() : new Date(0);
                return da - db;
            });
            setAssignedHomework(hwData);

            if (uid) {
                const subSnap = await getDocs(query(collection(db, 'homeworkSubmissions'), where('studentId', '==', uid)));
                const subMap = {};
                subSnap.forEach((d) => {
                    const data = d.data();
                    if (data.homeworkAssignmentId) subMap[data.homeworkAssignmentId] = data;
                });
                setHomeworkSubmissionsMap(subMap);
            } else {
                setHomeworkSubmissionsMap({});
            }
        } catch (error) {
            console.error("Error fetching content:", error);
        }
    };

    const fetchStudentUploads = async () => {
        if (!auth.currentUser) return;
        const uid = auth.currentUser.uid;
        try {
            const rSnap = await getDoc(doc(db, 'studentUploads', `${uid}_reportCard`));
            setReportCardUpload(rSnap.exists() ? rSnap.data() : null);
        } catch (e) {
            console.error(e);
        }
    };

    const handleReportCardPdfChange = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file || !auth.currentUser) return;
        const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
        if (!isPdf) {
            alert('Please choose a PDF file only (.pdf).');
            return;
        }
        setPdfUploading('reportCard');
        try {
            const uid = auth.currentUser.uid;
            const storagePath = `student-uploads/${uid}/report-card.pdf`;
            const storageRef = ref(storage, storagePath);
            await uploadBytes(storageRef, file, { contentType: 'application/pdf' });
            const fileUrl = await getDownloadURL(storageRef);
            const docId = `${uid}_reportCard`;
            await setDoc(doc(db, 'studentUploads', docId), {
                studentId: uid,
                kind: 'reportCard',
                fileName: file.name,
                fileUrl,
                uploadedAt: serverTimestamp(),
            });
            await fetchStudentUploads();
            alert('Report card PDF uploaded successfully.');
        } catch (err) {
            console.error(err);
            alert('Upload failed. Check your connection and try again.');
        } finally {
            setPdfUploading(null);
        }
    };

    const openAssignmentHomeworkUpload = (assignmentId) => {
        pendingHwAssignmentIdRef.current = assignmentId;
        assignmentHwFileRef.current?.click();
    };

    const handleAssignmentHomeworkChange = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        const assignmentId = pendingHwAssignmentIdRef.current;
        pendingHwAssignmentIdRef.current = null;
        if (!file || !auth.currentUser || !assignmentId) return;
        const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
        if (!isPdf) {
            alert('Please choose a PDF file only (.pdf).');
            return;
        }
        const uploadKey = `hwassign:${assignmentId}`;
        setPdfUploading(uploadKey);
        try {
            const uid = auth.currentUser.uid;
            const storagePath = `student-uploads/${uid}/by-assignment/${assignmentId}.pdf`;
            const storageRef = ref(storage, storagePath);
            await uploadBytes(storageRef, file, { contentType: 'application/pdf' });
            const fileUrl = await getDownloadURL(storageRef);
            const docId = `${uid}_${assignmentId}`;
            await setDoc(doc(db, 'homeworkSubmissions', docId), {
                studentId: uid,
                homeworkAssignmentId: assignmentId,
                fileName: file.name,
                fileUrl,
                uploadedAt: serverTimestamp(),
            });
            const saved = await getDoc(doc(db, 'homeworkSubmissions', docId));
            if (saved.exists()) {
                setHomeworkSubmissionsMap((prev) => ({ ...prev, [assignmentId]: saved.data() }));
            }
            alert('Your homework PDF was uploaded for this assignment.');
        } catch (err) {
            console.error(err);
            alert('Upload failed. Check your connection and try again.');
        } finally {
            setPdfUploading(null);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchStudentUploads();
    }, []);

    useEffect(() => {
        fetchContent();
    }, [userProfile, activeTab]);

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!payAmount || isNaN(payAmount) || Number(payAmount) <= 0) { alert('Please enter a valid amount.'); return; }

        try {
            setUploading(true);

            await addDoc(collection(db, 'payments'), {
                studentId: auth.currentUser.uid,
                studentName: userName,
                amount: Number(payAmount),
                status: 'pending',
                createdAt: serverTimestamp()
            });

            alert('Transaction logged successfully! Awaiting admin verification.');
            setPayAmount('');
            fetchContent();
        } catch (err) {
            console.error(err);
            alert('Failed to submit transaction.');
        } finally {
            setUploading(false);
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
                    {['Dashboard', 'Notices', 'My Courses', 'Schedule', 'Payments & Fees', 'Resources', 'My Homework', 'Report Card Upload', 'Settings'].map(tab => (
                        <div
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`nav-item ${activeTab === tab ? 'active' : ''}`}
                            style={{ cursor: 'pointer', position: 'relative' }}
                        >
                            {tab === 'Dashboard' && <LayoutDashboard size={18} />}
                            {tab === 'Notices' && <Bell size={18} />}
                            {tab === 'My Courses' && <Book size={18} />}
                            {tab === 'Schedule' && <Calendar size={18} />}
                            {tab === 'Payments & Fees' && <CreditCard size={18} />}
                            {tab === 'Resources' && <Folder size={18} />}
                            {tab === 'My Homework' && <ClipboardList size={18} />}
                            {tab === 'Report Card Upload' && <ScrollText size={18} />}
                            {tab === 'Settings' && <Settings size={18} />}
                            {tab}

                            {/* Dynamic Red Dot Indicators */}
                            {tab === 'Notices' && notices.length > 0 && <div style={{ width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', position: 'absolute', right: '16px' }} />}
                            {tab === 'Schedule' && lectures.length > 0 && <div style={{ width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', position: 'absolute', right: '16px' }} />}
                            {tab === 'Resources' && resources.length > 0 && <div style={{ width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', position: 'absolute', right: '16px' }} />}
                            {tab === 'My Homework' && assignedHomework.length > 0 && <div style={{ width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', position: 'absolute', right: '16px' }} />}
                            {tab === 'Payments & Fees' && userProfile && ((userProfile.totalFees || 0) > (userProfile.paidFees || 0)) && <div style={{ width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', position: 'absolute', right: '16px' }} />}
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
                        <h1 style={{ fontSize: '24px', marginBottom: '4px' }}>Welcome back, {userName}</h1>
                        <p style={{ color: 'var(--text-light)' }}>{userProfile ? `Enrolled in ${userProfile.courseMedium} Medium, ${userProfile.courseClass} ` : 'Academic Overview'}</p>
                    </div>
                    <div onClick={() => setActiveTab('Settings')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', backgroundColor: '#F8FAFC', padding: '8px 16px', borderRadius: '99px', border: '1px solid var(--border-color)' }}>
                        <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-navy)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={16} color="#fff" />
                        </div>
                        <div style={{ paddingRight: '4px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{userName}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-light)' }}>View Profile</div>
                        </div>
                    </div>
                </div>

                {activeTab === 'Dashboard' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                        {/* Left Column */}
                        <div className="flex" style={{ flexDirection: 'column', gap: '24px' }}>
                            {/* Hero Card */}
                            <div className="card" style={{ backgroundColor: 'var(--primary-navy)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ maxWidth: '60%' }}>
                                    <div className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--accent-gold)', marginBottom: '16px' }}>CURRENT MILESTONE</div>
                                    <h2 style={{ fontSize: '28px', color: '#fff', marginBottom: '16px' }}>Course Masterclass</h2>
                                    <p style={{ color: '#CBD5E1', marginBottom: '24px', fontSize: '14px' }}>Keep it up! Complete today's module to earn your badge.</p>
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
                                    <h3 style={{ fontSize: '18px' }}>Progress</h3>
                                </div>
                                <div className="flex gap-4">
                                    {[
                                        { name: 'Core Branch', sub: 'Current Subjects', progress: 64, icon: '🌍' }
                                    ].map((course, i) => (
                                        <div key={i} className="card" style={{ flex: 1 }}>
                                            <div style={{ width: '40px', height: '40px', backgroundColor: '#F1F5F9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '20px' }}>{course.icon}</div>
                                            <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>{userProfile ? `${userProfile.courseMedium} ${userProfile.courseClass}` : course.name}</h4>
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

                            <div className="card">
                                <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <ClipboardList size={20} color="var(--accent-gold)" /> Homework from faculty
                                    </h3>
                                    {assignedHomework.length > 0 && (
                                        <button type="button" onClick={() => setActiveTab('My Homework')} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '12px' }}>View all</button>
                                    )}
                                </div>
                                {assignedHomework.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {assignedHomework.slice(0, 3).map((hw) => {
                                            const due = hw.dueDate?.toDate ? hw.dueDate.toDate() : null;
                                            const overdue = due && due < new Date(new Date().setHours(0, 0, 0, 0));
                                            return (
                                                <div key={hw.id} style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: overdue ? '1px solid #F87171' : '1px solid var(--border-color)' }}>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600', marginBottom: '4px' }}>{hw.subject}{due ? ` • Due ${due.toLocaleString()}` : ''}</div>
                                                    <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--primary-navy)' }}>{hw.title}</div>
                                                    {hw.attachmentUrl && (
                                                        <a href={hw.attachmentUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--primary-navy)', marginTop: '8px', display: 'inline-block' }}>Attachment</a>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--text-light)', fontSize: '13px' }}>No assignments right now. Check back after your teacher posts homework.</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex" style={{ flexDirection: 'column', gap: '24px' }}>
                            <div className="card" style={{ backgroundColor: '#F8FAFC', border: 'none', padding: '24px' }}>
                                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Upcoming Schedule</h3>
                                {lectures.length > 0 ? lectures.map((item, i) => {
                                    const d = new Date(item.time);
                                    const isToday = d.toDateString() === new Date().toDateString();
                                    return (
                                        <div key={i} className="card" style={{ display: 'flex', gap: '16px', padding: '16px', marginBottom: '12px', border: isToday ? '1px solid var(--accent-gold)' : 'none' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '10px', color: 'var(--text-light)', fontWeight: 'bold', textTransform: 'uppercase' }}>{d.toLocaleDateString(undefined, { month: 'short' })}</div>
                                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-navy)' }}>{d.getDate()}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{item.subject}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </div>
                                        </div>
                                    )
                                }) : (
                                    <p style={{ color: 'var(--text-light)', fontSize: '13px' }}>You have no upcoming schedule for your course.</p>
                                )}
                                <button onClick={() => setActiveTab('Schedule')} className="btn btn-outline" style={{ width: '100%', marginTop: '8px' }}>Full Academic Calendar</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notices Tab */}
                {activeTab === 'Notices' && (
                    <div className="card">
                        <h2 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Bell size={24} color="var(--accent-gold)" /> Academic Notices
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {notices.length > 0 ? notices.map((not, i) => (
                                <div key={i} style={{ padding: '24px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--accent-gold)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>
                                                {not.createdAt ? new Date(not.createdAt.toDate()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recently'}
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'var(--primary-navy)', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '2px' }}>
                                                Posted by: {not.postedBy || 'Faculty'}
                                            </div>
                                        </div>
                                    </div>
                                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-navy)', marginBottom: '8px' }}>{not.title}</h4>
                                    <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{not.content}</p>
                                </div>
                            )) : (
                                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-light)', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                                    <Bell size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                                    <p style={{ fontSize: '16px' }}>No new notices for your class at this time.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Schedule Tab */}
                {activeTab === 'Schedule' && (
                    <div className="card">
                        <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Institute Lecture Schedule</h2>
                        {lectures.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {lectures.map((lec, i) => (
                                    <div key={i} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{lec.subject}</div>
                                            <div style={{ fontSize: '13px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={14} /> {new Date(lec.time).toLocaleString()}</div>
                                        </div>
                                        <div className="badge" style={{ backgroundColor: '#E0E7FF', color: 'var(--primary-navy)' }}>{lec.scheduledBy || 'Faculty'}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-light)' }}>No upcoming lectures scheduled yet for your enrolled standard.</p>
                        )}
                    </div>
                )}

                {/* Payments & Fees Tab */}
                {activeTab === 'Payments & Fees' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                            {/* Financial Overview Card */}
                            <div className="card" style={{ backgroundColor: 'var(--primary-navy)', color: '#fff' }}>
                                <h2 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CreditCard /> Financial Ledger
                                </h2>

                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ fontSize: '12px', color: '#CBD5E1', letterSpacing: '1px', marginBottom: '8px' }}>OUTSTANDING BALANCE</div>
                                    <div style={{ fontSize: '40px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                                        ₹{userProfile ? ((userProfile.totalFees || 0) - (userProfile.paidFees || 0)) : 0}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#CBD5E1' }}>
                                    <span>Total Enrolment Fee: ₹{userProfile?.totalFees || 0}</span>
                                    <span>Paid: ₹{userProfile?.paidFees || 0}</span>
                                </div>
                                <div style={{ height: '6px', backgroundColor: '#1E293B', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: userProfile?.totalFees ? `${(userProfile.paidFees / userProfile.totalFees) * 100}%` : '0%', backgroundColor: '#10B981' }}></div>
                                </div>
                            </div>

                            {/* Report Payment Form */}
                            <div className="card">
                                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Log New Payment</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '24px' }}>Log transactions directly via mathematical ledger. The admin will verify the amount and deduct it from your balance.</p>

                                <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Amount Paid (₹)</label>
                                        <input required type="number" min="1" value={payAmount} onChange={e => setPayAmount(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }} placeholder="E.g., 2000" />
                                    </div>
                                    <button disabled={uploading} type="submit" className="btn btn-primary" style={{ padding: '14px', marginTop: '8px' }}>
                                        {uploading ? 'Logging...' : 'Submit Transaction to Admin'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Submitted Receipts Ledger */}
                        <div className="card">
                            <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Transaction Log</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {payments.length > 0 ? payments.map((pay, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                                        <div>
                                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '4px' }}>₹{pay.amount}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>{pay.createdAt ? new Date(pay.createdAt.toDate()).toLocaleString() : 'Just now'}</div>
                                            <a href="#" style={{ fontSize: '12px', color: 'var(--primary-navy)', textDecoration: 'underline', marginTop: '4px', display: 'inline-block' }}>Digital Transfer</a>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '11px', fontWeight: '600', padding: '4px 12px', borderRadius: '99px', backgroundColor: pay.status === 'verified' ? '#D1FAE5' : '#FEF3C7', color: pay.status === 'verified' ? '#065F46' : '#D97706', textTransform: 'uppercase' }}>
                                                {pay.status}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-light)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>You have not submitted any physical receipts yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Resources Tab */}
                {activeTab === 'Resources' && (
                    <div className="card">
                        <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Study Materials & Notes</h2>
                        {resources.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                                {resources.map((res, i) => (
                                    <a href={res.url} target="_blank" rel="noreferrer" key={i} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div className="card interactive-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', backgroundColor: '#F8FAFC', border: '1px solid var(--border-color)' }}>
                                            <div style={{ width: '40px', height: '40px', backgroundColor: '#EEF2FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FileText size={20} color="var(--primary-navy)" />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{res.title}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>By {res.uploadedBy} • {res.courseMedium} - {res.courseClass}</div>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                                <Folder size={32} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
                                <p>No resources or notes have been uploaded for your profile class yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'My Homework' && (
                    <div className="card">
                        <h2 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ClipboardList size={24} color="var(--accent-gold)" /> My homework
                        </h2>
                        <input
                            ref={assignmentHwFileRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            style={{ display: 'none' }}
                            onChange={handleAssignmentHomeworkChange}
                        />
                        <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '24px', lineHeight: 1.6 }}>
                            Assignments from your teachers, ordered by due date. Upload your completed PDF for each task using the panel on the right.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {assignedHomework.length > 0 ? assignedHomework.map((hw) => {
                                const due = hw.dueDate?.toDate ? hw.dueDate.toDate() : null;
                                const overdue = due && due < new Date();
                                const submission = homeworkSubmissionsMap[hw.id];
                                const uploadKey = `hwassign:${hw.id}`;
                                const isUploadingThis = pdfUploading === uploadKey;
                                return (
                                    <div key={hw.id} style={{ padding: '24px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid var(--border-color)', borderLeft: `4px solid ${overdue ? '#EF4444' : 'var(--accent-gold)'}` }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'stretch', justifyContent: 'space-between' }}>
                                            <div style={{ flex: '1', minWidth: '240px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                                                    <div>
                                                        <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>
                                                            {hw.subject} • Due {due ? due.toLocaleString() : '—'}
                                                        </div>
                                                        <div style={{ fontSize: '11px', color: 'var(--primary-navy)', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '4px' }}>
                                                            Assigned by {hw.teacherName || 'Faculty'}
                                                        </div>
                                                    </div>
                                                    {overdue && <span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>Past due</span>}
                                                </div>
                                                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-navy)', marginBottom: '8px' }}>{hw.title}</h4>
                                                <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: hw.attachmentUrl ? '12px' : 0 }}>{hw.description}</p>
                                                {hw.attachmentUrl && (
                                                    <a href={hw.attachmentUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '8px 16px', marginTop: '8px', display: 'inline-block', textDecoration: 'none' }}>Open attachment</a>
                                                )}
                                            </div>
                                            <div style={{ width: '100%', maxWidth: '280px', flexShrink: 0, padding: '16px', borderRadius: '10px', backgroundColor: '#fff', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-navy)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your submission</div>
                                                {submission ? (
                                                    <>
                                                        <div style={{ fontSize: '13px', fontWeight: '600', wordBreak: 'break-word' }}>{submission.fileName}</div>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                                                            {submission.uploadedAt?.toDate ? new Date(submission.uploadedAt.toDate()).toLocaleString() : 'Uploaded'}
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                                                            <a href={submission.fileUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '13px', textDecoration: 'none', textAlign: 'center' }}>Open PDF</a>
                                                            <button type="button" className="btn btn-outline" style={{ padding: '8px 12px', fontSize: '13px' }} disabled={isUploadingThis} onClick={() => openAssignmentHomeworkUpload(hw.id)}>
                                                                {isUploadingThis ? 'Uploading…' : 'Replace PDF'}
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p style={{ fontSize: '12px', color: 'var(--text-light)', lineHeight: 1.5, margin: 0 }}>Submit one PDF for this assignment.</p>
                                                        <button type="button" className="btn btn-primary" style={{ padding: '10px 14px', fontSize: '13px', width: '100%' }} disabled={isUploadingThis} onClick={() => openAssignmentHomeworkUpload(hw.id)}>
                                                            {isUploadingThis ? 'Uploading…' : 'Upload homework PDF'}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-light)', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                                    <ClipboardList size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                                    <p style={{ fontSize: '16px' }}>You have no homework assigned yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'Report Card Upload' && (
                    <div className="card">
                        <h2 style={{ fontSize: '20px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ScrollText size={24} color="var(--accent-gold)" /> Report Card Upload
                        </h2>
                        <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '24px', lineHeight: 1.6 }}>
                            Upload your exam result or report card as a PDF. Uploading again replaces the previous file.
                        </p>
                        <input
                            ref={reportCardFileRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            style={{ display: 'none' }}
                            onChange={handleReportCardPdfChange}
                        />
                        {reportCardUpload ? (
                            <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                                    <div style={{ width: '48px', height: '48px', backgroundColor: '#EEF2FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <FileText size={22} color="var(--primary-navy)" />
                                    </div>
                                    <div style={{ flex: '1', minWidth: '200px' }}>
                                        <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px', wordBreak: 'break-word' }}>{reportCardUpload.fileName}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                                            Uploaded {reportCardUpload.uploadedAt?.toDate ? new Date(reportCardUpload.uploadedAt.toDate()).toLocaleString() : '—'}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '14px' }}>
                                            <a href={reportCardUpload.fileUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '8px 16px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Open PDF</a>
                                            <button type="button" className="btn btn-outline" style={{ padding: '8px 16px' }} disabled={pdfUploading === 'reportCard'} onClick={() => reportCardFileRef.current?.click()}>
                                                {pdfUploading === 'reportCard' ? 'Uploading…' : 'Replace PDF'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)', border: '1px dashed var(--border-color)', borderRadius: '12px', marginBottom: '20px' }}>
                                <ScrollText size={36} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
                                <p style={{ fontSize: '15px', marginBottom: '8px' }}>No report card PDF uploaded yet.</p>
                                <p style={{ fontSize: '13px' }}>PDF files only.</p>
                            </div>
                        )}
                        {!reportCardUpload && (
                            <button type="button" className="btn btn-primary" style={{ padding: '12px 24px' }} disabled={pdfUploading === 'reportCard'} onClick={() => reportCardFileRef.current?.click()}>
                                {pdfUploading === 'reportCard' ? 'Uploading…' : 'Upload report card PDF'}
                            </button>
                        )}
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
                
                {['My Courses'].includes(activeTab) && (
                    <div className="card" style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--border-color)' }}>
                        <div style={{ width: '64px', height: '64px', backgroundColor: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <Book size={32} color="var(--primary-navy)" />
                        </div>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--primary-navy)' }}>{activeTab} Portal</h2>
                        <p style={{ color: 'var(--text-light)', maxWidth: '400px', margin: '0 auto' }}>
                            Access your {activeTab.toLowerCase()} related materials and specific configurations from here.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default StudentDashboard;

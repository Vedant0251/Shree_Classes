import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Clock, Settings, UserCheck, BarChart, Download, BookOpen, FileText, LogOut, Trash2, CreditCard, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, getDocs, query, orderBy, limit, updateDoc, doc, addDoc, serverTimestamp, deleteDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const AdminDashboard = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('Dashboard');
    
    const [scheduleSubject, setScheduleSubject] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const [scheduleMedium, setScheduleMedium] = useState('English');
    const [scheduleClass, setScheduleClass] = useState('10th');
    const [scheduleDateFilter, setScheduleDateFilter] = useState('');
    const [lectures, setLectures] = useState([]);

    const [resourceTitle, setResourceTitle] = useState('');
    const [resourceFile, setResourceFile] = useState(null);
    const [resourceMedium, setResourceMedium] = useState('English');
    const [resourceClass, setResourceClass] = useState('10th');
    const [uploading, setUploading] = useState(false);
    const [resources, setResources] = useState([]);
    
    const [payments, setPayments] = useState([]);

    // Edit User Modal State
    const [editingUser, setEditingUser] = useState(null);

    const fetchData = async () => {
        try {
            const qEnq = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'), limit(50));
            const snapEnq = await getDocs(qEnq);
            const dataEnq = [];
            snapEnq.forEach((doc) => dataEnq.push({ id: doc.id, ...doc.data() }));
            setEnquiries(dataEnq);

            const qUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
            const snapUsers = await getDocs(qUsers);
            const dataUsers = [];
            snapUsers.forEach((doc) => dataUsers.push({ id: doc.id, ...doc.data() }));
            setUsers(dataUsers);

            const qLec = query(collection(db, 'lectures'), orderBy('time', 'asc'), limit(20));
            const snapLec = await getDocs(qLec);
            const dataLec = [];
            snapLec.forEach((doc) => dataLec.push({ id: doc.id, ...doc.data() }));
            setLectures(dataLec.filter(l => new Date(l.time) >= new Date(new Date().setHours(0,0,0,0))));

            const qRes = query(collection(db, 'resources'), orderBy('createdAt', 'desc'), limit(20));
            const snapRes = await getDocs(qRes);
            const rData = [];
            snapRes.forEach((doc) => rData.push({ id: doc.id, ...doc.data() }));
            setResources(rData);

            const qPay = query(collection(db, 'payments'), orderBy('createdAt', 'desc'), limit(50));
            const snapPay = await getDocs(qPay);
            const pData = [];
            snapPay.forEach((doc) => pData.push({ id: doc.id, ...doc.data() }));
            setPayments(pData);

        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApproveUser = async (userObj) => {
        try {
            let updatePayload = { status: 'approved' };
            
            if (userObj.role === 'student') {
                const feeInput = window.prompt(`Enter Total Expected Course Fee in ₹ for ${userObj.name}:`, "24000");
                if (feeInput === null) return;
                const numericFee = parseInt(feeInput);
                if (isNaN(numericFee) || numericFee < 0) {
                    alert('Invalid fee amount. Approval cancelled.');
                    return;
                }
                updatePayload.totalFees = numericFee;
                updatePayload.paidFees = 0;
            }

            await updateDoc(doc(db, 'users', userObj.id), updatePayload);
            alert(`User ${userObj.name} approved successfully.`);
            fetchData();
        } catch (error) { console.error(error); }
    };

    const handleRejectUser = async (userId) => {
        try {
            await updateDoc(doc(db, 'users', userId), { status: 'rejected' });
            fetchData();
        } catch (error) { console.error(error); }
    };

    const handleDeleteUser = async (userId, userName) => {
        if(window.confirm(`Are you absolutely sure you want to permanently delete ${userName}? This action removes their access completely.`)) {
            try {
                await deleteDoc(doc(db, 'users', userId));
                fetchData();
            } catch(e) { console.error(e); alert('Error deleting user'); }
        }
    };

    const handleSaveUserEdit = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, 'users', editingUser.id), {
                name: editingUser.name,
                courseMedium: editingUser.courseMedium,
                courseClass: editingUser.courseClass,
                totalFees: Number(editingUser.totalFees),
                paidFees: Number(editingUser.paidFees)
            });
            alert('User profile updated successfully!');
            setEditingUser(null);
            fetchData();
        } catch(err) {
            console.error(err);
            alert('Failed to update user parameters.');
        }
    };
    
    const handleVerifyPayment = async (paymentObj) => {
        if(window.confirm(`Verify payment of ₹${paymentObj.amount} for ${paymentObj.studentName}? This will permanently update their balance.`)) {
            try {
                await updateDoc(doc(db, 'payments', paymentObj.id), { status: 'verified' });
                await updateDoc(doc(db, 'users', paymentObj.studentId), { 
                    paidFees: increment(Number(paymentObj.amount)) 
                });
                alert('Payment Verified & Balance Deducted!');
                fetchData();
            } catch (err) { console.error("Error processing transaction:", err); alert('Failed to verify.'); }
        }
    }

    const handleUpdateEnquiry = async (enqId, newStatus) => {
        try {
            await updateDoc(doc(db, 'enquiries', enqId), { status: newStatus });
            fetchData();
        } catch (error) { console.error(error); }
    };

    const handleScheduleLecture = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'lectures'), {
                subject: scheduleSubject,
                time: scheduleTime,
                courseMedium: scheduleMedium,
                courseClass: scheduleClass,
                scheduledBy: 'Admin',
                createdAt: serverTimestamp()
            });
            alert('Lecture Scheduled Successfully!');
            setScheduleSubject('');
            setScheduleTime('');
            fetchData();
        } catch(error) { console.error(error); }
    };

    const handleDeleteLecture = async (id) => {
        if(window.confirm('Delete this scheduled lecture globally?')) {
            try {
                await deleteDoc(doc(db, 'lectures', id));
                fetchData();
            } catch(e) { console.error(e); }
        }
    };

    const handleAddResource = async (e) => {
        e.preventDefault();
        if (!resourceFile) { alert('Please select a file.'); return; }
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
                uploadedBy: 'Admin',
                createdAt: serverTimestamp()
            });
            alert('Resource Uploaded Successfully!');
            setResourceTitle('');
            setResourceFile(null);
            fetchData();
        } catch(error) { console.error(error); } finally { setUploading(false); }
    };

    const handleDeleteResource = async (resObj) => {
        if(window.confirm('Delete this resource permanently?')) {
            try {
                await deleteDoc(doc(db, 'resources', resObj.id));
                if (resObj.storagePath) {
                    await deleteObject(ref(storage, resObj.storagePath));
                }
                fetchData();
            } catch(e) { console.error(e); }
        }
    };

    const handleExportReport = () => {
        const headers = "Name,Email,Role,Status,Medium,Class,Total Fee,Paid Fee\n";
        const rows = users.map(u => `"${u.name || ''}","${u.email || ''}","${u.role || ''}","${u.status || ''}","${u.courseMedium || 'NA'}","${u.courseClass || 'NA'}","${u.totalFees || 0}","${u.paidFees || 0}"`).join('\n');
        const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "shree_users_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const pendingUsers = users.filter(u => u.status === 'pending');
    const approvedTeachers = users.filter(u => u.status === 'approved' && u.role === 'teacher');
    const approvedStudents = users.filter(u => u.status === 'approved' && u.role === 'student');
    const pendingPayments = payments.filter(p => p.status === 'pending');
    const verifiedPayments = payments.filter(p => p.status === 'verified');

    const groupedStudents = approvedStudents.reduce((acc, student) => {
        const key = `${student.courseMedium || 'Unassigned'} - ${student.courseClass || 'N/A'}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(student);
        return acc;
    }, {});

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <div className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-navy)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen color="#fff" size={16} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '16px', margin: 0, fontWeight: '700' }}>Shree Classes</h2>
                    </div>
                </div>

                <div style={{ padding: '0 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E2E8F0', flexShrink: 0 }}></div>
                    <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>Admin Portal</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: 0 }}>System Administrator</p>
                    </div>
                </div>

                <div className="sidebar-nav">
                    {['Dashboard', 'All Users', 'Payments & Fees', 'Enquiries', 'Schedule', 'Resources', 'Settings'].map(tab => (
                        <div 
                            key={tab} 
                            onClick={() => setActiveTab(tab)} 
                            className={`nav-item ${activeTab === tab ? 'active' : ''}`} 
                            style={{ cursor: 'pointer', position: 'relative' }}
                        >
                            {tab === 'Dashboard' && <LayoutDashboard size={18} />}
                            {tab === 'All Users' && <UserCheck size={18} />}
                            {tab === 'Payments & Fees' && <CreditCard size={18} />}
                            {tab === 'Enquiries' && <FileText size={18} />}
                            {tab === 'Schedule' && <Clock size={18} />}
                            {tab === 'Resources' && <BookOpen size={18} />}
                            {tab === 'Settings' && <Settings size={18} />}
                            {tab}
                            
                            {/* Dynamic Red Dot Indicators */}
                            {tab === 'All Users' && pendingUsers.length > 0 && <div style={{ width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', position: 'absolute', right: '16px' }} />}
                            {tab === 'Payments & Fees' && pendingPayments.length > 0 && <div style={{ width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', position: 'absolute', right: '16px' }} />}
                            {tab === 'Enquiries' && enquiries.some(e => (!e.status || e.status === 'New')) && <div style={{ width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', position: 'absolute', right: '16px' }} />}
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
                        <h1 style={{ fontSize: '32px', marginBottom: '4px' }}>{activeTab}</h1>
                        <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Global Administrative Overview</p>
                    </div>
                    {activeTab === 'All Users' && (
                        <div className="flex items-center gap-4">
                            <button onClick={handleExportReport} className="btn btn-outline" style={{ backgroundColor: '#F1F5F9' }}>
                                <Download size={16} style={{ marginRight: '8px' }} /> Export Report
                            </button>
                        </div>
                    )}
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'Dashboard' && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                            <div className="card" style={{ backgroundColor: 'var(--primary-navy)', color: '#fff', padding: '24px' }}>
                                <div style={{ fontSize: '12px', letterSpacing: '1px', marginBottom: '8px', color: '#CBD5E1', fontWeight: '600' }}>PENDING TRANSACTIONS</div>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CreditCard size={28} /> {pendingPayments.length}
                                </div>
                                <div onClick={() => setActiveTab('Payments & Fees')} style={{ fontSize: '12px', color: 'var(--accent-gold)', cursor: 'pointer', textDecoration: 'underline' }}>Review →</div>
                            </div>
                            <div className="card" style={{ padding: '24px' }}>
                                <div style={{ fontSize: '12px', letterSpacing: '1px', marginBottom: '8px', color: 'var(--text-light)', fontWeight: '600' }}>TOTAL ENROLMENTS</div>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--primary-navy)' }}>{users.filter(u => u.role === 'student').length}</div>
                                <div style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Users size={12} /> {pendingUsers.filter(u => u.role==='student').length} pending approval
                                </div>
                            </div>
                            <div className="card" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '24px' }}>
                                <div style={{ fontSize: '12px', letterSpacing: '1px', marginBottom: '8px', color: '#166534', fontWeight: '600' }}>TOTAL REVENUE COLLECTED</div>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#15803D', marginBottom: '16px' }}>
                                    ₹{users.reduce((sum, u) => sum + (Number(u.paidFees) || 0), 0).toLocaleString()}
                                </div>
                                <div style={{ fontSize: '12px', color: '#166534' }}>Across all verified students</div>
                            </div>
                            <div className="card" style={{ backgroundColor: 'var(--accent-gold)', padding: '24px' }}>
                                <div style={{ fontSize: '12px', letterSpacing: '1px', marginBottom: '8px', color: '#92400E', fontWeight: '600' }}>ACTIVE TEACHERS</div>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-navy)', marginBottom: '16px' }}>{approvedTeachers.length}</div>
                                <div style={{ fontSize: '12px', color: '#92400E' }}>Teaching Staff</div>
                            </div>
                        </div>

                        <div className="card" style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>Master Schedule</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {lectures.length > 0 ? lectures.map((item, i) => {
                                    const d = new Date(item.time);
                                    const isToday = d.toDateString() === new Date().toDateString();
                                    return (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '8px', borderLeft: isToday ? '4px solid var(--accent-gold)' : '4px solid transparent', backgroundColor: isToday ? '#FFFBEB' : '#F8FAFC' }}>
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
                                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>No active upcoming lectures found across any branch.</div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Edit User Modal Overlay */}
                {editingUser && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                        <div className="card" style={{ width: '400px', backgroundColor: '#fff' }}>
                            <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Edit User Profile</h2>
                            <form onSubmit={handleSaveUserEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>User Name</label>
                                    <input type="text" value={editingUser.name || ''} onChange={e => setEditingUser({...editingUser, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none' }} />
                                </div>
                                {editingUser.role === 'student' && (
                                    <>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Medium</label>
                                                <select value={editingUser.courseMedium || 'English'} onChange={e => setEditingUser({...editingUser, courseMedium: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none' }}>
                                                    <option value="English">English</option>
                                                    <option value="Marathi">Marathi</option>
                                                    <option value="Foundation">Foundation</option>
                                                </select>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Class / Standard</label>
                                                <select value={editingUser.courseClass || '10th'} onChange={e => setEditingUser({...editingUser, courseClass: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none' }}>
                                                    <option value="3rd">3rd Standard</option>
                                                    <option value="4th">4th Standard</option>
                                                    <option value="5th">5th Standard</option>
                                                    <option value="6th">6th Standard</option>
                                                    <option value="7th">7th Standard</option>
                                                    <option value="8th">8th Standard</option>
                                                    <option value="9th">9th Standard</option>
                                                    <option value="10th">10th Standard</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#10B981' }}>Total Expected Fee (₹)</label>
                                                <input type="number" min="0" value={editingUser.totalFees || 0} onChange={e => setEditingUser({...editingUser, totalFees: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none' }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#1D4ED8' }}>Paid Fee Balance (₹)</label>
                                                <input type="number" min="0" value={editingUser.paidFees || 0} onChange={e => setEditingUser({...editingUser, paidFees: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none' }} />
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                                    <button type="button" onClick={() => setEditingUser(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* All Users Tab */}
                {activeTab === 'All Users' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {/* Pending Approvals */}
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ padding: '20px 24px', backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '16px', color: '#EF4444' }}>Pending Approvals ({pendingUsers.length})</h3>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <tbody>
                                    {pendingUsers.length > 0 ? pendingUsers.map((user, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', backgroundColor: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{user.role === 'teacher' ? '👨‍🏫' : '🎓'}</div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{user.name}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{user.email} • <b style={{ textTransform: 'uppercase' }}>{user.role}</b></div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                {user.role === 'student' && (
                                                    <span style={{ fontSize: '11px', backgroundColor: '#E0E7FF', padding: '4px 8px', borderRadius: '4px', color: 'var(--primary-navy)' }}>
                                                        {user.courseMedium || 'Unassigned'} • {user.courseClass || 'N/A'}
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    <button onClick={() => handleApproveUser(user)} className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '13px', backgroundColor: '#10B981', color: 'white', border: 'none' }}>Issue Approval</button>
                                                    <button onClick={() => handleRejectUser(user.id)} className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '13px', color: '#B45309', borderColor: '#B45309' }}>Reject</button>
                                                    <button onClick={() => handleDeleteUser(user.id, user.name)} style={{ backgroundColor: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '6px' }} title="Delete Database Entry"><Trash2 size={16}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="3" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-light)' }}>No pending approvals.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Active Teachers */}
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ padding: '20px 24px', backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-color)' }}>
                                <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)' }}>Active Teachers ({approvedTeachers.length})</h3>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <tbody>
                                    {approvedTeachers.length > 0 ? approvedTeachers.map((user, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', backgroundColor: '#E0E7FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>👨‍🏫</div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{user.name}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{user.email}</div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    <button onClick={() => setEditingUser(user)} style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--text-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }} title="Edit Options"><Edit size={16}/> Edit</button>
                                                    <span style={{ fontSize: '13px', color: '#10B981', fontWeight: 'bold' }}>✓ Active</span>
                                                    <button onClick={() => handleDeleteUser(user.id, user.name)} style={{ backgroundColor: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '6px' }} title="Permanently Delete User"><Trash2 size={16}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="2" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-light)' }}>No active teachers.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Active Students Grouped by Course/Class */}
                        {Object.keys(groupedStudents).map(groupKey => (
                            <div key={groupKey} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ padding: '20px 24px', backgroundColor: '#FDF7E1', borderBottom: '1px solid #FDE68A' }}>
                                    <h3 style={{ fontSize: '16px', color: '#92400E' }}>Students: {groupKey} ({groupedStudents[groupKey].length})</h3>
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                    <tbody>
                                        {groupedStudents[groupKey].map((user, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '40px', height: '40px', backgroundColor: '#FEF3C7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🎓</div>
                                                    <div style={{ minWidth: '200px' }}>
                                                        <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{user.name}</div>
                                                        <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{user.email}</div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px' }}>Financial Clearance</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{ height: '6px', width: '100px', backgroundColor: '#E2E8F0', borderRadius: '3px' }}>
                                                            <div style={{ height: '100%', width: user.totalFees ? `${(user.paidFees/user.totalFees)*100}%` : '0%', backgroundColor: (user.paidFees >= user.totalFees) ? '#10B981' : 'var(--primary-navy)', borderRadius: '3px' }}></div>
                                                        </div>
                                                        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>₹{user.paidFees || 0} / {user.totalFees || 0}</div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                        <button onClick={() => setEditingUser(user)} style={{ backgroundColor: 'transparent', border: 'none', color: '#1D4ED8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 'bold' }} title="Edit Options"><Edit size={16}/> Edit</button>
                                                        <span style={{ fontSize: '13px', color: '#10B981', fontWeight: 'bold' }}>✓ Active</span>
                                                        <button onClick={() => handleDeleteUser(user.id, user.name)} style={{ backgroundColor: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '6px' }} title="Permanently Delete User"><Trash2 size={16}/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Payments & Fees Tab */}
                {activeTab === 'Payments & Fees' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
                        <div className="card">
                            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Pending Payment Verifications</h2>
                            <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '24px' }}>Review receipts uploaded by students. Verifying will deduct the amount from their total pending balance automatically.</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {pendingPayments.length > 0 ? pendingPayments.map((pay, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px solid #FDE68A', borderRadius: '12px', backgroundColor: '#FFFBEB' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                            <div style={{ textAlign: 'center', paddingRight: '24px', borderRight: '1px solid #FDE68A' }}>
                                                <div style={{ fontSize: '11px', color: '#B45309', fontWeight: 'bold', letterSpacing: '1px' }}>TRANSACTION</div>
                                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#92400E' }}>₹{pay.amount}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '16px', fontWeight: '600' }}>Student: {pay.studentName}</div>
                                                <div style={{ fontSize: '12px', color: '#92400E' }}>Logged on: {pay.createdAt ? new Date(pay.createdAt.toDate()).toLocaleString() : 'Just now'}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <button onClick={() => handleVerifyPayment(pay)} className="btn btn-primary" style={{ padding: '10px 24px', backgroundColor: '#10B981', border: 'none' }}>Verify & Clear Balance</button>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-light)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>No pending verification requests at this time.</div>
                                )}
                            </div>
                        </div>
                        
                        <div className="card">
                            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Verified Payment History</h2>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', marginTop: '16px' }}>
                                <thead>
                                    <tr style={{ color: 'var(--text-light)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                        <th style={{ padding: '16px 8px', fontWeight: '600' }}>STUDENT NAME</th>
                                        <th style={{ padding: '16px 8px', fontWeight: '600' }}>AMOUNT CLEARED</th>
                                        <th style={{ padding: '16px 8px', fontWeight: '600' }}>VERIFICATION DATE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {verifiedPayments.map((pay, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '12px 8px', fontWeight: '500' }}>{pay.studentName}</td>
                                            <td style={{ padding: '12px 8px', fontWeight: 'bold', color: '#10B981' }}>+₹{pay.amount}</td>
                                            <td style={{ padding: '12px 8px', color: 'var(--text-light)' }}>{pay.createdAt ? new Date(pay.createdAt.toDate()).toLocaleDateString() : 'Unknown'}</td>
                                        </tr>
                                    ))}
                                    {verifiedPayments.length === 0 && <tr><td colSpan="3" style={{ padding: '16px', textAlign: 'center' }}>No historical payments verified.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Enquiries Tab */}
                {activeTab === 'Enquiries' && (
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead style={{ backgroundColor: '#F1F5F9' }}>
                                <tr style={{ color: 'var(--text-light)', textAlign: 'left' }}>
                                    <th style={{ padding: '16px 24px', fontWeight: '600' }}>NAME & PHONE</th>
                                    <th style={{ padding: '16px 24px', fontWeight: '600' }}>COURSE</th>
                                    <th style={{ padding: '16px 24px', fontWeight: '600' }}>STATUS</th>
                                    <th style={{ padding: '16px 24px', fontWeight: '600', textAlign: 'right' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enquiries.length > 0 ? enquiries.map((enq, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-dark)' }}>
                                            {enq.name}
                                            <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 'normal' }}>{enq.phone}</div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary-navy)', backgroundColor: '#E0E7FF', padding: '6px 12px', borderRadius: '99px' }}>{enq.course}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontWeight: '500' }}>
                                            <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', ...(enq.status === 'Contacted' ? { background: '#DBEAFE', color: '#1D4ED8' } : enq.status === 'Enrolled' ? { background: '#D1FAE5', color: '#065F46' } : { background: '#FEF3C7', color: '#D97706' }) }}>
                                                {enq.status || 'New'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <select 
                                                value={enq.status || 'New'} 
                                                onChange={(e) => handleUpdateEnquiry(enq.id, e.target.value)}
                                                style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: '#F8FAFC' }}
                                            >
                                                <option value="New">New</option>
                                                <option value="Contacted">Mark Contacted</option>
                                                <option value="Enrolled">Mark Enrolled</option>
                                            </select>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-light)' }}>No enquiries found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Schedule Tab */}
                {activeTab === 'Schedule' && (
                    <div className="card" style={{ maxWidth: '600px', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Schedule a New Lecture</h2>
                        <form onSubmit={handleScheduleLecture} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Subject / Topic</label>
                                <input required type="text" value={scheduleSubject} onChange={e => setScheduleSubject(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }} placeholder="E.g., Quantum Physics Ch. 4" />
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
                                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>No active upcoming lectures found across any branch.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Resources Tab (Admin view) */}
                {activeTab === 'Resources' && (
                    <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1fr 1fr' }}>
                        <div className="card">
                            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Global Resource Management</h2>
                            <p style={{ color: 'var(--text-light)', fontSize: '13px', marginBottom: '24px' }}>Upload institutional documents or override study materials.</p>
                            <form onSubmit={handleAddResource} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Material Title</label>
                                    <input required type="text" value={resourceTitle} onChange={e => setResourceTitle(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }} placeholder="E.g., Institutional Guidelines PDF" />
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
                                            <option value="General">General / Administrative</option>
                                        </select>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Target Class</label>
                                        <select value={resourceClass} onChange={e => setResourceClass(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                                            <option value="General">General / All</option>
                                            <option value="3rd">3rd Standard</option>
                                            <option value="10th">10th Standard</option>
                                        </select>
                                    </div>
                                </div>
                                <button disabled={uploading} type="submit" className="btn btn-primary" style={{ padding: '14px' }}>{uploading ? 'Processing...' : 'Upload Official Material'}</button>
                            </form>
                        </div>
                        
                        <div className="card">
                            <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>All Uploaded Resources</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {resources.length > 0 ? resources.map((res, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '14px', fontWeight: '600' }}>{res.title}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>By: {res.uploadedBy} • {res.courseMedium} / {res.courseClass}</div>
                                        </div>
                                        <div>
                                            <button onClick={() => handleDeleteResource(res)} style={{ backgroundColor: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '8px' }} title="Delete Database Entry"><Trash2 size={16}/></button>
                                            <a href={res.url} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px', marginLeft: '8px' }}>View</a>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-light)' }}>Database empty.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Tabs */}
                {['Settings'].includes(activeTab) && (
                    <div className="card" style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--border-color)' }}>
                        <div style={{ width: '64px', height: '64px', backgroundColor: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <Settings size={32} color="var(--primary-navy)" />
                        </div>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--primary-navy)' }}>{activeTab} Module</h2>
                        <p style={{ color: 'var(--text-light)', maxWidth: '400px', margin: '0 auto' }}>
                            Configure portal preferences, user permissions, and notification behaviors.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;

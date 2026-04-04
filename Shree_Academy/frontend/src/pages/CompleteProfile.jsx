import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const CompleteProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [courseMedium, setCourseMedium] = useState('');
  const [courseClass, setCourseClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If no context, maybe user reached here by mistake
    if (!state.uid) {
      navigate('/auth');
    }
  }, [state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', state.uid), {
        email: state.email,
        role: state.role,
        name,
        phone,
        details: state.role === 'teacher' ? details : `${courseClass} - ${courseMedium} Medium`,
        courseMedium: courseMedium || null,
        courseClass: courseClass || null,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      setSuccess(true);
      await signOut(auth); // Log out so they can't access dashboards until approved
      
      setTimeout(() => {
        navigate('/auth', { state: { message: "Profile submitted! Waiting for Admin approval." }});
      }, 3000);
      
    } catch (err) {
      console.error(err);
      alert("Failed to submit profile.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)'}}>
        <div className="card text-center" style={{ width: '420px', padding: '40px' }}>
          <h2 style={{ color: 'var(--primary-navy)' }}>Awesome!</h2>
          <p style={{ marginTop: '16px', color: 'var(--text-light)' }}>Your profile has been submitted successfully to the administrators.</p>
          <p style={{ marginTop: '8px', color: 'var(--text-light)' }}>You will be redirected shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', backgroundImage: 'radial-gradient(circle at 50% 0%, #0F203C 0%, var(--bg-color) 70%)' }}>
      <div className="card hover-glow" style={{ width: '420px', padding: '40px', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontSize: '24px', marginBottom: '8px', textAlign: 'center', color: 'var(--primary-navy)' }}>
          Complete Your Profile
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '14px', marginBottom: '32px' }}>
          Almost there! Please provide standard details so the Admin can approve your account.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>Full Name</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }} placeholder="Jane Doe" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>Phone Number</label>
            <input required type="text" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }} placeholder="+1 234 567 890" />
          </div>
          {state.role === 'student' ? (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>Course Medium</label>
                <select required value={courseMedium} onChange={e => { setCourseMedium(e.target.value); setCourseClass(''); }} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }}>
                  <option value="" disabled>Select Medium</option>
                  <option value="English">English</option>
                  <option value="Marathi">Marathi</option>
                </select>
              </div>
              
              {courseMedium && (
                <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>Standard / Class</label>
                  <select required value={courseClass} onChange={e => setCourseClass(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }}>
                    <option value="" disabled>Select Class</option>
                    {courseMedium === 'Marathi' ? (
                      <>
                        <option value="3rd Standard">3rd Standard</option>
                        <option value="4th Standard">4th Standard</option>
                        <option value="5th Standard">5th Standard</option>
                        <option value="6th Standard">6th Standard</option>
                        <option value="7th Standard">7th Standard</option>
                        <option value="8th Standard">8th Standard</option>
                        <option value="9th Standard">9th Standard</option>
                        <option value="10th Standard">10th Standard</option>
                      </>
                    ) : (
                      <>
                        <option value="8th Standard">8th Standard</option>
                        <option value="9th Standard">9th Standard</option>
                        <option value="10th Standard">10th Standard</option>
                      </>
                    )}
                  </select>
                </div>
              )}
            </>
          ) : (
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>Subjects/Experience</label>
              <textarea required value={details} onChange={e => setDetails(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none', minHeight: '80px', transition: 'border-color 0.2s' }} placeholder="Your subject expertise, years of experience..."></textarea>
            </div>
          )}
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '8px', fontSize: '16px', padding: '14px', fontWeight: 'bold' }}>
            {loading ? 'Submitting...' : 'Submit Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;

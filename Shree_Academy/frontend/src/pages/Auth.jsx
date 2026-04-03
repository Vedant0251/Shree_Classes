import React, { useState } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // 'student' or 'teacher'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // ADMIN DIRECT BYPASS
    if (email === 'shree_admin_2025' && password === 'Shree@Classes#2025!Dada') {
        setLoading(false);
        navigate('/admin');
        return;
    }

    try {
      if (isLogin) {
        // Firebase Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // ROLE ROUTING
        const userRole = userCredential.user.displayName || 'student';
        if (userRole === 'teacher') {
            navigate('/teacher');
        } else {
            navigate('/student');
        }
      } else {
        // Firebase Signup
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update user profile with Role! We use displayName as a secure hack to store roles on the client object.
        await updateProfile(userCredential.user, { displayName: role });

        if (role === 'teacher') {
            navigate('/teacher');
        } else {
            navigate('/student');
        }
      }
    } catch (err) {
       setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', backgroundImage: 'radial-gradient(circle at 50% 0%, #0F203C 0%, var(--bg-color) 70%)' }}>
      <div className="card hover-glow" style={{ width: '420px', padding: '40px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
             <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary-navy)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 4px 12px rgba(15, 32, 60, 0.4)' }}>
                 📚
             </div>
        </div>
        
        <h2 style={{ fontSize: '24px', marginBottom: '8px', textAlign: 'center', color: 'var(--primary-navy)' }}>
          {isLogin ? 'Welcome Back' : 'Join Apex Academy'}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '14px', marginBottom: '32px' }}>
             {isLogin ? 'Enter your credentials to access your portal' : 'Select your track and create your account'}
        </p>
        
        {error && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>I am registering as a:</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                  <div 
                      onClick={() => setRole('student')}
                      style={{ flex: 1, padding: '12px', border: role === 'student' ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', backgroundColor: role === 'student' ? '#FFFBEB' : '#fff', fontWeight: role === 'student' ? 'bold' : 'normal', transition: 'all 0.2s' }}>
                      🎓 Student
                  </div>
                  <div 
                      onClick={() => setRole('teacher')}
                      style={{ flex: 1, padding: '12px', border: role === 'teacher' ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', backgroundColor: role === 'teacher' ? '#FFFBEB' : '#fff', fontWeight: role === 'teacher' ? 'bold' : 'normal', transition: 'all 0.2s' }}>
                      👨‍🏫 Teacher
                  </div>
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>Email Address or Username</label>
            <input 
              type="text" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
              placeholder={isLogin ? 'Email or `shree_admin_2025`' : 'you@example.com'}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-navy)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>
                Password {isLogin && <span style={{ color: 'var(--text-light)', cursor: 'pointer', fontWeight: 'normal' }}>Forgot?</span>}
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
              placeholder="••••••••"
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-navy)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '8px', fontSize: '16px', padding: '14px', fontWeight: 'bold' }}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In →' : 'Create Account')}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--text-light)' }}>
          {isLogin ? "Don't have an portal account? " : "Already established? "}
          <span 
            style={{ color: 'var(--primary-navy)', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
          >
            {isLogin ? 'Sign up' : 'Log in safely'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Auth;

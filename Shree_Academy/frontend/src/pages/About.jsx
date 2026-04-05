import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const About = () => {
    return (
        <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '60px 24px' }}>
             <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                 <div style={{ backgroundColor: '#fff', padding: '48px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '40px', fontWeight: '900', color: 'var(--primary-navy)', marginBottom: '24px', textAlign: 'center' }}>About Shree Academy</h1>
                    <div style={{ width: '100%', height: '400px', backgroundColor: 'var(--primary-navy)', borderRadius: '24px', marginBottom: '40px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(15, 32, 60, 0.4), rgba(15, 32, 60, 0.8)), url(https://images.unsplash.com/photo-1523050853063-bd8012fec20f?q=80&w=2070&auto=format&fit=crop) center/cover' }}></div>
                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px' }}>
                            <h2 style={{ color: '#fff', fontSize: '48px', fontWeight: '900', textShadow: '0 4px 6px rgba(0,0,0,0.3)', marginBottom: '16px' }}>Excellence in Education</h2>
                            <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--accent-gold)', margin: '0 auto', borderRadius: '2px' }}></div>
                        </div>
                    </div>
                    <p style={{ color: '#475569', fontSize: '18px', lineHeight: '1.8', textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
                        Shree Classes has been dedicated to providing quality education and guidance to students since 1977. Our aim is to help students build strong academic foundations and achieve success in their studies.
                        We focus on disciplined learning, experienced teaching, and continuous student support. Over the years, Shree Classes has earned the trust of many students and parents through consistent results and commitment to education.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                        <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{ backgroundColor: 'var(--primary-navy)', padding: '12px', borderRadius: '12px' }}>
                                <Phone color="#fff" size={24} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '4px', fontWeight: '600' }}>Contact Us</h4>
                                <p style={{ fontSize: '16px', color: 'var(--primary-navy)', fontWeight: 'bold' }}>+91 9867897622</p>
                            </div>
                        </div>

                        <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{ backgroundColor: 'var(--primary-navy)', padding: '12px', borderRadius: '12px' }}>
                                <Mail color="#fff" size={24} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '4px', fontWeight: '600' }}>Email Us</h4>
                                <p style={{ fontSize: '16px', color: 'var(--primary-navy)', fontWeight: 'bold' }}>shree.classes.@gmail.com</p>
                            </div>
                        </div>

                        <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{ backgroundColor: 'var(--primary-navy)', padding: '12px', borderRadius: '12px' }}>
                                <MapPin color="#fff" size={24} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '4px', fontWeight: '600' }}>Location</h4>
                                <p style={{ fontSize: '15px', color: 'var(--primary-navy)', fontWeight: 'bold', lineHeight: '1.4' }}>
                                    Konkan Vashat, Omkar Society,<br /> Kalyan West
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderRadius: '20px', overflow: 'hidden', height: '400px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.123456789!2d73.13!3d19.24!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be796324296715f%3A0x67399a9413f9f44!2sKalyan%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1712250000000!5m2!1sen!2sin" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Link to="/" className="btn btn-outline" style={{ padding: '12px 32px', fontSize: '16px', borderRadius: '8px' }}>← Back to Home</Link>
                    </div>
                 </div>
             </div>
        </div>
    );
}

export default About;

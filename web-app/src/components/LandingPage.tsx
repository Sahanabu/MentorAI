import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, Arial, sans-serif'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '100px',
        height: '100px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '70%',
        right: '15%',
        width: '150px',
        height: '150px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '20%',
        width: '80px',
        height: '80px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '50%',
        animation: 'float 7s ease-in-out infinite'
      }}></div>
      
      <div style={{ 
        textAlign: 'center', 
        color: 'white',
        maxWidth: '700px',
        padding: '2rem',
        zIndex: 10,
        animation: 'fadeInUp 1s ease-out'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50px',
          marginBottom: '2rem',
          fontSize: '0.9rem',
          fontWeight: '500',
          animation: 'pulse 2s infinite'
        }}>
          🚀 AI-Powered Education Platform
        </div>
        
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: '800', 
          marginBottom: '1.5rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          animation: 'slideInDown 1s ease-out 0.2s both'
        }}>
          MentorTrack AI
        </h1>
        
        <p style={{ 
          fontSize: '1.3rem', 
          marginBottom: '3rem',
          opacity: 0.95,
          lineHeight: '1.6',
          animation: 'slideInUp 1s ease-out 0.4s both'
        }}>
          Transform academic mentoring with intelligent performance tracking,
          <br />AI-powered predictions, and seamless collaboration.
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '1.5rem', 
          justifyContent: 'center',
          flexWrap: 'wrap',
          animation: 'slideInUp 1s ease-out 0.6s both'
        }}>
          <a href="/login" style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white',
            padding: '1rem 2rem',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🔐 Login
          </a>
          
          <a href="/register" style={{
            backgroundColor: 'white',
            color: '#667eea',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ✨ Get Started
          </a>
        </div>
        
        <div style={{
          marginTop: '4rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          flexWrap: 'wrap',
          animation: 'fadeIn 1s ease-out 0.8s both'
        }}>
          <div style={{ textAlign: 'center', opacity: 0.8 }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
            <div style={{ fontSize: '0.9rem' }}>Smart Tracking</div>
          </div>
          <div style={{ textAlign: 'center', opacity: 0.8 }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
            <div style={{ fontSize: '0.9rem' }}>AI Predictions</div>
          </div>
          <div style={{ textAlign: 'center', opacity: 0.8 }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
            <div style={{ fontSize: '0.9rem' }}>Analytics</div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
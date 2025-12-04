"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// 1. Import Library
import { toast, Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'register'
  
  // Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชัน Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const apiHost = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";
      const res = await fetch(`${apiHost}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // 2. เปลี่ยน alert เป็น toast
        toast.success(`ยินดีต้อนรับ, ${data.user.username}! 🎉`, {
            duration: 3000,
        });

        // 3. หน่วงเวลา 1.5 วิ ให้เห็นข้อความก่อนเด้งไปหน้าแรก
        setTimeout(() => {
            router.push("/"); 
        }, 1500);

      } else {
        toast.error("❌ " + data.message);
      }
    } catch (err) { 
        toast.error("Error: " + err.message); 
    } finally { 
        setIsLoading(false); 
    }
  };

  // ฟังก์ชัน Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const apiHost = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";
        const res = await fetch(`${apiHost}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, email }),
        });
        const data = await res.json();
  
        if (data.status === "success") {
          toast.success("✅ สมัครสมาชิกสำเร็จ! กรุณาล็อกอิน");
          setActiveTab("login");
          setPassword(""); // Clear password
        } else {
          toast.error("❌ " + (data.message || "สมัครไม่สำเร็จ"));
        }
      } catch (err) { 
          toast.error("Error: " + err.message); 
      } finally { 
          setIsLoading(false); 
      }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a1a', // Main Background
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: '#fff'
    }}>
      
      {/* 4. เพิ่ม Toaster Component สำหรับแสดงผล */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            border: '1px solid #444',
          },
          success: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Logo Section */}
      <div style={{textAlign:'center', marginBottom:'30px'}}>
        <h1 style={{
          fontSize:'3rem', 
          fontWeight:'900', 
          margin: '0 0 10px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-1px'
        }}>
          WeComics
        </h1>
        <p style={{color:'#888', fontSize: '1.1rem', margin: 0}}>เข้าสู่โลกหนังสือการ์ตูนออนไลน์</p>
      </div>

      {/* Card Container */}
      <div style={{
        width: '100%',
        maxWidth: '450px',
        background: '#252525',
        borderRadius: '16px',
        border: '1px solid #333',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        overflow: 'hidden'
      }}>
        
        {/* Tabs Headers */}
        <div style={{display:'flex', borderBottom:'1px solid #333'}}>
            <button 
                onClick={() => setActiveTab('login')}
                style={{
                    flex:1, 
                    padding:'20px', 
                    border:'none', 
                    background: activeTab==='login' ? '#252525' : '#1f1f1f',
                    color: activeTab==='login' ? '#3b82f6' : '#666', 
                    fontWeight:'bold', 
                    cursor:'pointer',
                    fontSize: '1rem',
                    borderBottom: activeTab==='login' ? '3px solid #3b82f6' : '3px solid transparent',
                    transition: 'all 0.3s'
                }}
            >
                เข้าสู่ระบบ
            </button>
            <button 
                onClick={() => setActiveTab('register')}
                style={{
                    flex:1, 
                    padding:'20px', 
                    border:'none', 
                    background: activeTab==='register' ? '#252525' : '#1f1f1f',
                    color: activeTab==='register' ? '#3b82f6' : '#666', 
                    fontWeight:'bold', 
                    cursor:'pointer',
                    fontSize: '1rem',
                    borderBottom: activeTab==='register' ? '3px solid #3b82f6' : '3px solid transparent',
                    transition: 'all 0.3s'
                }}
            >
                สมัครสมาชิก
            </button>
        </div>

        {/* Content Area */}
        <div style={{ padding: '40px 30px' }}>
            {/* Login Form */}
            {activeTab === 'login' && (
                <form onSubmit={handleLogin}>
                    <div style={{marginBottom:'20px'}}>
                        <label style={labelStyle}>ชื่อผู้ใช้ (Username)</label>
                        <input type="text" required value={username} onChange={e=>setUsername(e.target.value)} 
                            style={inputStyle} placeholder="กรอกชื่อผู้ใช้ของคุณ"/>
                    </div>
                    <div style={{marginBottom:'30px'}}>
                        <label style={labelStyle}>รหัสผ่าน (Password)</label>
                        <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} 
                            style={inputStyle} placeholder="กรอกรหัสผ่าน"/>
                    </div>
                    <button type="submit" disabled={isLoading} style={buttonStyle(isLoading)}>
                        {isLoading ? '⏳ กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
                    </button>
                </form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
                <form onSubmit={handleRegister}>
                    <div style={{marginBottom:'20px'}}>
                        <label style={labelStyle}>ชื่อผู้ใช้ (Username)</label>
                        <input type="text" required value={username} onChange={e=>setUsername(e.target.value)} 
                            style={inputStyle} placeholder="ตั้งชื่อผู้ใช้"/>
                    </div>
                    <div style={{marginBottom:'20px'}}>
                        <label style={labelStyle}>อีเมล (Email)</label>
                        <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} 
                            style={inputStyle} placeholder="name@example.com"/>
                    </div>
                    <div style={{marginBottom:'30px'}}>
                        <label style={labelStyle}>รหัสผ่าน (Password)</label>
                        <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} 
                            style={inputStyle} placeholder="ตั้งรหัสผ่าน"/>
                    </div>
                    <button type="submit" disabled={isLoading} style={buttonStyle(isLoading)}>
                        {isLoading ? '⏳ กำลังบันทึก...' : 'สมัครสมาชิกทันที'}
                    </button>
                </form>
            )}
        </div>
      </div>

      <div style={{textAlign:'center', marginTop:'30px'}}>
        <Link href="/" style={{color:'#666', textDecoration:'none', fontSize: '0.9rem', transition: 'color 0.2s'}}>
          ← กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}

// Shared Styles
const labelStyle = {
    display:'block', 
    marginBottom:'8px', 
    fontWeight:'500', 
    color: '#ccc',
    fontSize: '0.9rem'
};

const inputStyle = {
    width:'100%', 
    padding:'14px', 
    borderRadius:'8px', 
    border:'1px solid #444', 
    background: '#333', 
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s'
};

const buttonStyle = (isLoading) => ({
    width: '100%',
    padding: '16px',
    background: isLoading ? '#555' : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    boxShadow: isLoading ? 'none' : '0 4px 15px rgba(59, 130, 246, 0.4)',
    transition: 'transform 0.2s',
});
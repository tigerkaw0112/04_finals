import './globals.css'
import Navbar from './components/Navbar'; // 👈 1. นำเข้าไฟล์ Navbar ที่สร้างใหม่

export const metadata = {
  title: 'WeComics Bookstore',
  description: 'ร้านขายหนังสือออนไลน์',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        
        {/* --- ส่วนที่ 1: HEADER (ดึงมาจากไฟล์ Navbar.js) --- */}
        <Navbar />  {/* 👈 2. เรียกใช้ตรงนี้ แทนโค้ดยาวๆ อันเดิม */}

        {/* --- ส่วนที่ 2: เนื้อหา --- */}
        <div style={{ minHeight: '100vh', background: '#f9f9f9' }}>
           {children} 
        </div>

      </body>
    </html>
  )
}
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function BookDetailPage() {
  const { id } = useParams(); // รับค่า ID จาก URL (เช่น books/1)
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลหนังสือรายเล่ม
  useEffect(() => {
    async function fetchBook() {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_HOST;
        // ตรวจสอบว่ามี API Host หรือไม่ ถ้าไม่มีให้ใช้ localhost
        const host = apiHost || 'http://localhost:3001';

        const res = await fetch(`${host}/books/${id}`);
        
        if (!res.ok) throw new Error("Book not found");
        
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error(err);
        setBook(null); // Set null เพื่อให้แสดง UI ไม่พบหนังสือ
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchBook();
  }, [id]);

  // ฟังก์ชันใส่ตะกร้า
  const addToCart = () => {
    if (!book) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(i => i.id === book.id);
    if (existing) { existing.quantity += 1; } 
    else { cart.push({ ...book, quantity: 1 }); }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`🛒 เพิ่ม "${book.title}" ลงตะกร้าแล้ว!`);
  };

  if (loading) return (
    <div style={{textAlign:'center', marginTop:'100px', color:'#999', fontFamily: 'sans-serif'}}>
      <h2>⏳ กำลังโหลด...</h2>
    </div>
  );

  if (!book) return (
    <div style={{textAlign:'center', marginTop:'100px', color:'#999', fontFamily: 'sans-serif'}}>
      <h2>❌ ไม่พบหนังสือเล่มนี้</h2>
      <Link href="/" style={{color: '#ff7f50', marginTop: '20px', display: 'inline-block'}}>กลับหน้าหลัก</Link>
    </div>
  );

  return (
    <main style={{background: '#f9f9f9', minHeight: '100vh', padding: '40px 15px', fontFamily: 'system-ui, sans-serif'}}>
      {/* เพิ่ม Global Style เพื่อความสวยงาม */}
      <style jsx global>{`
        button:active { transform: scale(0.98) !important; }
      `}</style>

      <div className="container" style={{maxWidth: '1000px', margin: '0 auto'}}>
        
        {/* ปุ่มย้อนกลับ */}
        <Link href="/" style={{display: 'inline-flex', alignItems: 'center', marginBottom: '20px', color: '#666', textDecoration: 'none', fontWeight: 500}}>
          <span style={{marginRight: '5px'}}>←</span> กลับหน้าหลัก
        </Link>

        <div style={{
            background: 'white', 
            borderRadius: '24px', 
            padding: '40px', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '50px',
            alignItems: 'start'
        }}>
          
          {/* ฝั่งซ้าย: รูปปก */}
          <div style={{position: 'relative'}}>
            <div style={{
                borderRadius: '16px', 
                overflow: 'hidden', 
                boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                transform: 'rotate(-2deg)',
                border: '1px solid #eee'
            }}>
                <img 
                  src={book.cover_image || "https://placehold.co/400x600"} 
                  alt={book.title} 
                  style={{width: '100%', display: 'block'}}
                />
            </div>
          </div>

          {/* ฝั่งขวา: ข้อมูล */}
          <div>
            <span style={{
                background: '#fff0eb', 
                color: '#ff7f50', 
                padding: '6px 14px', 
                borderRadius: '20px', 
                fontSize: '0.9rem', 
                fontWeight: 'bold',
                display: 'inline-block',
                marginBottom: '15px'
            }}>
                {book.category_name || "General"}
            </span>
            
            <h1 style={{fontSize: '2.4rem', fontWeight: '800', margin: '0 0 15px', color: '#2d3436', lineHeight: '1.2'}}>
                {book.title}
            </h1>
            
            <div style={{fontSize: '1.1rem', color: '#636e72', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                <span>โดย</span>
                <span style={{color: '#2d3436', fontWeight: '600', borderBottom: '2px solid #ff7f50'}}>{book.author}</span>
            </div>

            <div style={{fontSize: '3rem', fontWeight: '800', color: '#ff7f50', marginBottom: '30px', letterSpacing: '-1px'}}>
                ฿{book.price}
            </div>

            {/* กล่องเรื่องย่อ */}
            <div style={{marginBottom: '35px'}}>
                <h3 style={{fontSize: '1.2rem', fontWeight: '700', marginBottom: '12px', color:'#2d3436'}}>เรื่องย่อ</h3>
                <p style={{lineHeight: '1.7', color: '#636e72', fontSize: '1rem', whiteSpace: 'pre-line'}}>
                    {book.description || "ไม่มีรายละเอียดเรื่องย่อ..."}
                </p>
            </div>

            {/* ปุ่มกด */}
            <div style={{display: 'flex', gap: '15px'}}>
                <button 
                    onClick={addToCart}
                    disabled={book.stock <= 0}
                    style={{
                        flex: 1, 
                        padding: '18px', 
                        borderRadius: '16px', 
                        border: 'none',
                        background: book.stock > 0 ? 'linear-gradient(135deg, #ff7f50 0%, #ff6b6b 100%)' : '#b2bec3', 
                        color: 'white', 
                        fontSize: '1.2rem', 
                        fontWeight: 'bold', 
                        cursor: book.stock > 0 ? 'pointer' : 'not-allowed',
                        boxShadow: book.stock > 0 ? '0 10px 20px rgba(255, 127, 80, 0.3)' : 'none',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}
                    onMouseOver={(e) => !e.target.disabled && (e.target.style.transform = 'translateY(-2px)')}
                    onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
                >
                    {book.stock > 0 ? (
                        <>
                            <span>🛒</span>
                            <span>ใส่ตะกร้าเลย</span>
                        </>
                    ) : 'สินค้าหมด'}
                </button>
            </div>
            
            <div style={{marginTop: '20px', fontSize: '0.9rem', color: '#b2bec3', textAlign: 'center'}}>
                สินค้าคงเหลือ: {book.stock} เล่ม
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
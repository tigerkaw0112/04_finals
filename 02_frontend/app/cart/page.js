"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// 1. Import Library
import { toast, Toaster } from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, []);

  const updateQuantity = (id, change) => {
    const newCart = cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (id) => {
    // confirm ยังคงใช้แบบเดิมได้ เพราะต้องการหยุดรอคำตอบ (Yes/No)
    if (!confirm("ต้องการลบสินค้านี้ใช่ไหม?")) return;
    
    const newCart = cartItems.filter(item => item.id !== id);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    toast.success("ลบสินค้าเรียบร้อย"); // เพิ่มแจ้งเตือนเล็กๆ
  };

  const handleCheckout = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      // 2. เปลี่ยน alert เป็น toast.error
      toast.error("กรุณาเข้าสู่ระบบก่อนชำระเงิน 🔒");
      setTimeout(() => router.push('/login'), 1500); // หน่วงเวลานิดนึงก่อนเด้งไปหน้า Login
      return;
    }
    const user = JSON.parse(storedUser);
    setIsProcessing(true);

    try {
      const apiHost = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:3001';
      const url = `${apiHost}/orders`;

      const payload = {
        user_id: user.id,
        shipping_address: "-",
        items: cartItems.map(item => ({
          book_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseText = await res.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        console.error("❌ Server Response (Not JSON):", responseText);
        throw new Error("เชื่อมต่อ API ไม่ได้ (ได้รับ HTML แทน JSON)");
      }

      if (res.ok) {
        // 2. เปลี่ยน alert เป็น toast.success
        toast.success(`สั่งซื้อสำเร็จ! Order #${data.order_id} 🎉`, {
            duration: 4000,
            icon: '✅'
        });
        localStorage.removeItem('cart');
        setCartItems([]);
        
        // รอแป๊บนึงค่อยเปลี่ยนหน้า เพื่อให้ user อ่านข้อความทัน
        setTimeout(() => router.push('/orders'), 2000);
      } else {
        toast.error("สั่งซื้อล้มเหลว: " + (data.error || "Unknown Error"));
      }

    } catch (error) {
      console.error("🔥 Checkout Error:", error);
      toast.error("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  if (!mounted) return null;

  return (
    <div style={{
      background: '#1a1a1a', // Dark Theme Background
      minHeight: '100vh',
      color: '#fff',
      paddingBottom: '40px'
    }}>
      {/* 3. เพิ่ม Toaster Component สำหรับแสดงผล */}
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

      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '30px',
          borderBottom: '1px solid #333',
          paddingBottom: '15px',
          fontWeight: 'bold'
        }}>
          🛒 ตะกร้าสินค้า <span style={{ fontSize: '1.2rem', color: '#888' }}>({cartItems.length} รายการ)</span>
        </h1>

        {cartItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: '#252525',
            borderRadius: '16px',
            border: '1px solid #333'
          }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#aaa' }}>ยังไม่มีสินค้าในตะกร้า</p>
            <Link href="/" style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '1.1rem',
              borderBottom: '1px solid #3b82f6'
            }}>
              ← กลับไปเลือกซื้อหนังสือ
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            
            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{
                  background: '#252525', // Card Background
                  padding: '20px',
                  borderRadius: '12px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  border: '1px solid #333',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                }}>
                  <div style={{ width: '80px', height: '120px', flexShrink: 0 }}>
                    <img 
                      src={item.cover_image || "https://placehold.co/100x150"} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} 
                      alt={item.title}
                    />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{item.title}</h3>
                    <p style={{ color: '#3b82f6', fontWeight: 'bold', margin: 0 }}>฿{item.price}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={btnStyle}>-</button>
                    <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={btnStyle}>+</button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)} 
                    style={{ 
                      color: '#ef4444', 
                      border: 'none', 
                      background: 'rgba(239, 68, 68, 0.1)', 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginLeft: '10px'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={{ 
              background: '#252525', 
              padding: '30px', 
              borderRadius: '16px', 
              height: 'fit-content',
              border: '1px solid #333',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px' }}>สรุปคำสั่งซื้อ</h3>
              <div style={rowStyle}><span>ยอดรวมสินค้า</span><span>฿{subtotal.toLocaleString()}</span></div>
              <div style={rowStyle}><span>ค่าจัดส่ง</span><span>฿{shipping}</span></div>
              <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #444' }} />
              <div style={{ ...rowStyle, fontSize: '1.3rem', fontWeight: 'bold', color: '#fff' }}>
                <span>ยอดสุทธิ</span>
                <span style={{ color: '#3b82f6' }}>฿{total.toLocaleString()}</span>
              </div>
              
              <button 
                onClick={handleCheckout} 
                disabled={isProcessing} 
                style={{
                  width: '100%',
                  padding: '16px',
                  marginTop: '25px',
                  background: isProcessing ? '#555' : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  boxShadow: isProcessing ? 'none' : '0 4px 15px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.3s'
                }}
              >
                {isProcessing ? '⏳ กำลังส่งข้อมูล...' : '💳 ชำระเงินทันที'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const btnStyle = { 
  width: '32px', 
  height: '32px', 
  borderRadius: '8px', 
  border: '1px solid #444', 
  background: '#333', 
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  lineHeight: '1'
};

const rowStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  marginBottom: '12px', 
  color: '#aaa',
  fontSize: '0.95rem'
};
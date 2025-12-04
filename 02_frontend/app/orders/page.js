'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      setError('กรุณาเข้าสู่ระบบก่อนดูประวัติคำสั่งซื้อ');
      setLoading(false);
      return;
    }

    const user = JSON.parse(userJson);

    async function fetchOrders() {
      try {
        const res = await fetch(`${API_URL}/orders?userId=${user.id}`);
        if (!res.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลคำสั่งซื้อได้');
        }
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'รอชำระเงิน': '#f59e0b',
      'กำลังจัดส่ง': '#3b82f6',
      'จัดส่งแล้ว': '#10b981',
      'ยกเลิก': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusBadge = (status) => {
    return (
      <span style={{
        background: getStatusColor(status),
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600'
      }}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{
        background: '#1a1a1a',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{color: '#888', fontSize: '1.2rem'}}>⏳ กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: '#1a1a1a',
        minHeight: '100vh',
        padding: '40px 20px'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: '#252525',
          padding: '30px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #ef4444'
        }}>
          <div style={{fontSize: '3rem', marginBottom: '20px'}}>⚠️</div>
          <div style={{color: '#ef4444', fontSize: '1.1rem'}}>{error}</div>
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              marginTop: '20px',
              background: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            ไปหน้าเข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div style={{
        background: '#1a1a1a',
        minHeight: '100vh',
        padding: '40px 20px'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: '#252525',
          padding: '50px 30px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #333'
        }}>
          <div style={{fontSize: '4rem', marginBottom: '20px'}}>📦</div>
          <h2 style={{color: '#fff', fontSize: '1.5rem', marginBottom: '10px'}}>
            ยังไม่มีคำสั่งซื้อ
          </h2>
          <p style={{color: '#888', marginBottom: '30px'}}>
            เริ่มช้อปปิ้งหนังสือที่คุณชื่นชอบกันเลย!
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            เริ่มช้อปปิ้ง
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#1a1a1a',
      minHeight: '100vh',
      paddingBottom: '40px'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)',
          borderRadius: '12px',
          padding: '25px 30px',
          marginBottom: '30px',
          border: '1px solid #333'
        }}>
          <h1 style={{
            color: '#fff',
            fontSize: '1.8rem',
            margin: 0,
            fontWeight: 'bold'
          }}>
            📋 ประวัติคำสั่งซื้อ
          </h1>
          <p style={{
            color: '#888',
            margin: '5px 0 0',
            fontSize: '0.95rem'
          }}>
            คำสั่งซื้อทั้งหมด {orders.length} รายการ
          </p>
        </div>

        {/* Orders List */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: '#252525',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #333',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            >
              {/* Order Header */}
              <div style={{
                background: '#2a2a2a',
                padding: '20px',
                borderBottom: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px'
              }}>
                <div>
                  <div style={{
                    color: '#fff',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    marginBottom: '5px'
                  }}>
                    คำสั่งซื้อ #{order.id}
                  </div>
                  <div style={{
                    color: '#888',
                    fontSize: '0.85rem'
                  }}>
                    📅 {order.created_at
                      ? new Date(order.created_at).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : '-'}
                  </div>
                </div>

                <div style={{textAlign: 'right'}}>
                  {getStatusBadge(order.status)}
                  <div style={{
                    color: '#3b82f6',
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    marginTop: '8px'
                  }}>
                    ฿{Number(order.total_price).toLocaleString('th-TH', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div style={{
                padding: '15px 20px',
                background: '#222',
                borderBottom: '1px solid #333'
              }}>
                <div style={{
                  color: '#888',
                  fontSize: '0.85rem',
                  marginBottom: '5px'
                }}>
                  📍 ที่อยู่จัดส่ง
                </div>
                <div style={{
                  color: '#fff',
                  fontSize: '0.9rem'
                }}>
                  {order.shipping_address}
                </div>
              </div>

              {/* Order Items */}
              <div style={{padding: '20px'}}>
                <div style={{
                  color: '#fff',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  marginBottom: '15px'
                }}>
                  📚 รายการสินค้า
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  {order.items && order.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '15px',
                        background: '#2a2a2a',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        alignItems: 'center'
                      }}
                    >
                      {/* Book Cover */}
                      {item.cover_image && (
                        <img
                          src={item.cover_image}
                          alt={item.title}
                          style={{
                            width: '60px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            border: '1px solid #444'
                          }}
                        />
                      )}
                      
                      {/* Book Info */}
                      <div style={{flex: 1}}>
                        <div style={{
                          color: '#fff',
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          marginBottom: '4px'
                        }}>
                          {item.title}
                        </div>
                        <div style={{
                          color: '#888',
                          fontSize: '0.85rem'
                        }}>
                          จำนวน: {item.quantity} เล่ม × ฿{Number(item.price).toFixed(2)}
                        </div>
                      </div>

                      {/* Price */}
                      <div style={{
                        textAlign: 'right',
                        color: '#3b82f6',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}>
                        ฿{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
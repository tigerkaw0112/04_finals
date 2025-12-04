"use client";

import { useState, useEffect } from "react";
// 1. Import toast และ Toaster
import { toast, Toaster } from 'react-hot-toast';

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [displayBooks, setDisplayBooks] = useState([]);
  const [categories, setCategories] = useState(["ทั้งหมด"]);
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [loading, setLoading] = useState(true);
  const [hoveredBook, setHoveredBook] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";
        const res = await fetch(`${apiHost}/books`, { cache: "no-store" });
        
        if (!res.ok) throw new Error("API Error");
        
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setBooks(data);
          setDisplayBooks(data);
          const cats = ["ทั้งหมด", ...new Set(data.map(b => b.category_name).filter(Boolean))];
          setCategories(cats);
        }
      } catch (err) {
        console.error(err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === "ทั้งหมด") {
      setDisplayBooks(books);
    } else {
      setDisplayBooks(books.filter(b => b.category_name === activeTab));
    }
  }, [activeTab, books]);

  const addToCart = (e, book) => {
    e.preventDefault();
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(i => i.id === book.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...book, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 2. เปลี่ยน alert แบบเดิม เป็น toast แบบทันสมัย
    // alert(`ใส่ตะกร้าเรียบร้อย: ${book.title}`); <--- ลบทิ้ง
    toast.success(`เพิ่ม "${book.title}" ลงตะกร้าแล้ว!`, {
      duration: 3000, // แสดง 3 วินาที
      position: 'top-center', // ตำแหน่ง (บนกลาง)
    });

    window.dispatchEvent(new Event("storage"));
  };

  const goToBookDetail = (bookId) => {
    window.location.href = `/books/${bookId}`;
  };

  return (
    <div style={{
      background: '#1a1a1a',
      minHeight: '100vh',
      paddingBottom: '40px',
      position: 'relative'
    }}>
      {/* 3. เพิ่ม Component Toaster ไว้ตรงนี้ พร้อมแต่งสไตล์ Dark Theme */}
      <Toaster
        toastOptions={{
          style: {
            background: '#333', // พื้นหลังสีเทาเข้ม
            color: '#fff',      // ตัวหนังสือสีขาว
            border: '1px solid #444',
          },
          success: {
            iconTheme: {
              primary: '#3b82f6', // ไอคอนสีฟ้า (ตามธีมปุ่ม)
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Hero Banner - Full Width */}
      <div style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '100px 40px',
        marginBottom: '40px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
          zIndex: 1
        }}></div>

        {/* Content */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          zIndex: 2,
          padding: '0 20px'
        }}>
          <div style={{ maxWidth: '650px' }}>
            <h1 style={{
              color: '#fff',
              textShadow: '0 4px 12px rgba(0,0,0,0.8)',
              fontSize: '3.8rem',
              margin: '0 0 20px',
              fontWeight: 'bold',
              lineHeight: '1.1',
              letterSpacing: '-1px'
            }}>
              WeComics Book Fair 2025
            </h1>
            <p style={{
              color: '#fff',
              fontSize: '1.5rem',
              margin: '0 0 30px',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              fontWeight: '500',
              opacity: 0.95
            }}>
              พบกับหนังสือการ์ตูนและนิยายคุณภาพจากหลากหลายสำนักพิมพ์ ลดสูงสุด 50% เฉพาะงานนี้เท่านั้น!
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                border: 'none',
                padding: '16px 40px',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.5)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
              }}
            >
              ช้อปเลย!
            </button>
          </div>
        </div>
      </div>

      {/* Container */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Categories Tabs */}
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '20px',
          marginBottom: '25px'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: activeTab === cat ? '2px solid #3b82f6' : '1px solid #333',
                background: activeTab === cat ? '#3b82f6' : '#2a2a2a',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Book Grid */}
        {loading ? (
          <div style={{
            textAlign: 'center',
            color: '#888',
            marginTop: '80px',
            fontSize: '1.2rem'
          }}>
            ⏳ กำลังโหลดหนังสือ...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {displayBooks.map(book => (
              <div
                key={book.id}
                onMouseEnter={() => setHoveredBook(book.id)}
                onMouseLeave={() => setHoveredBook(null)}
                style={{
                  background: '#252525',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: hoveredBook === book.id ? '0 8px 20px rgba(59, 130, 246, 0.4)' : '0 2px 8px rgba(0,0,0,0.4)',
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #333',
                  position: 'relative',
                  transform: hoveredBook === book.id ? 'translateY(-5px)' : 'translateY(0)'
                }}
              >
                {/* Favorite Icon - Top Right */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  zIndex: 10
                }}>
                  <button
                    onClick={(e) => addToCart(e, book)}
                    disabled={book.stock <= 0}
                    style={{
                      background: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: book.stock > 0 ? 'pointer' : 'not-allowed',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      fontSize: '16px',
                      transition: 'all 0.2s',
                      color: '#333' // เพิ่มสีเริ่มต้น
                    }}
                    onMouseEnter={(e) => {
                      if (book.stock > 0) {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.color = '#ef4444'; // เพิ่มลูกเล่น: หัวใจแดงเมื่อ Hover
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.color = '#333';
                    }}
                  >
                    ♡
                  </button>
                </div>

                {/* Cover Image */}
                <div style={{
                  aspectRatio: '2/3',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <img
                    src={book.cover_image || "https://placehold.co/400x600?text=No+Image"}
                    alt={book.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      transform: hoveredBook === book.id ? 'scale(1.1)' : 'scale(1)'
                    }}
                  />

                  {/* Quick View Button */}
                  {hoveredBook === book.id && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <button
                        onClick={() => goToBookDetail(book.id)}
                        style={{
                          background: 'white',
                          color: '#000',
                          border: 'none',
                          borderRadius: '25px',
                          padding: '12px 28px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        Quick View
                      </button>
                    </div>
                  )}

                  {book.stock <= 0 && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}>
                      หมด
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{
                  padding: '12px',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <h3 style={{
                    fontSize: '0.9rem',
                    margin: '0 0 4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    color: '#fff',
                    lineHeight: '1.3',
                    height: '2.6em'
                  }}>
                    {book.title}
                  </h3>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#888',
                    margin: '0 0 8px'
                  }}>
                    {book.author}
                  </p>

                  <div style={{ marginTop: 'auto' }}>
                    <span style={{
                      color: '#fff',
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}>
                      ฿{book.price}
                    </span>
                  </div>

                  <button
                    onClick={(e) => addToCart(e, book)}
                    disabled={book.stock <= 0}
                    style={{
                      background: book.stock > 0 ? '#3b82f6' : '#444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px',
                      marginTop: '8px',
                      cursor: book.stock > 0 ? 'pointer' : 'not-allowed',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (book.stock > 0) {
                        e.currentTarget.style.background = '#2563eb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (book.stock > 0) {
                        e.currentTarget.style.background = '#3b82f6';
                      }
                    }}
                  >
                    เพิ่มในตะกร้า
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
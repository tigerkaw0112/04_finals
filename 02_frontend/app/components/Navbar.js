'use client'

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const checkLoginStatus = () => {
    const storedData = localStorage.getItem('user'); 
    
    if (storedData) {
      try {
        const userData = JSON.parse(storedData);
        setUser(userData.username); 
      } catch (error) {
        console.error("Error parsing user data", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }

    // นับจำนวนสินค้าในตะกร้า
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  };

  useEffect(() => {
    checkLoginStatus();
    
    // ฟังการเปลี่ยนแปลงของ cart
    const handleStorage = () => checkLoginStatus();
    window.addEventListener('storage', handleStorage);
    
    return () => window.removeEventListener('storage', handleStorage);
  }, [pathname]);

  useEffect(() => {
    const interval = setInterval(checkLoginStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // ตรวจสอบการ scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    setUser(null);
    router.push('/login');
  };

  const isActive = (path) => pathname === path;

  return (
    <nav style={{
      background: isScrolled ? '#1a1a1aee' : '#1a1a1a',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      padding: '15px 0',
      borderBottom: '1px solid #333',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'all 0.3s ease',
      boxShadow: isScrolled ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        
        {/* Logo */}
        <Link href="/" style={{textDecoration: 'none'}}>
          <div style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📚 WeComics
          </div>
        </Link>

        {/* Menu Right */}
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          {/* Home Link */}
          <Link href="/" style={{textDecoration: 'none'}}>
            <div style={{
              color: isActive('/') ? '#3b82f6' : '#ccc',
              padding: '8px 16px',
              borderRadius: '8px',
              background: isActive('/') ? '#3b82f620' : 'transparent',
              transition: 'all 0.2s',
              fontSize: '0.95rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!isActive('/')) {
                e.currentTarget.style.background = '#ffffff10';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/')) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#ccc';
              }
            }}>
              🏠 หน้าหลัก
            </div>
          </Link>

          {/* Cart Link */}
          <Link href="/cart" style={{textDecoration: 'none'}}>
            <div style={{
              color: isActive('/cart') ? '#3b82f6' : '#ccc',
              padding: '8px 16px',
              borderRadius: '8px',
              background: isActive('/cart') ? '#3b82f620' : 'transparent',
              transition: 'all 0.2s',
              fontSize: '0.95rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (!isActive('/cart')) {
                e.currentTarget.style.background = '#ffffff10';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/cart')) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#ccc';
              }
            }}>
              🛒 ตะกร้า
              {cartCount > 0 && (
                <span style={{
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  minWidth: '18px',
                  textAlign: 'center'
                }}>
                  {cartCount}
                </span>
              )}
            </div>
          </Link>
          
          {/* User Section */}
          {user ? (
            <div style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              marginLeft: '5px'
            }}>
              {/* Orders Link */}
              <Link href="/orders" style={{textDecoration: 'none'}}>
                <div style={{
                  color: isActive('/orders') ? '#3b82f6' : '#ccc',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: isActive('/orders') ? '#3b82f620' : 'transparent',
                  transition: 'all 0.2s',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/orders')) {
                    e.currentTarget.style.background = '#ffffff10';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/orders')) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#ccc';
                  }
                }}>
                  📋 ประวัติ
                </div>
              </Link>

              {/* Divider */}
              <div style={{
                height: '24px',
                width: '1px',
                background: '#444'
              }}></div>

              {/* User Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 12px',
                background: '#252525',
                borderRadius: '8px',
                border: '1px solid #333'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  {user.charAt(0).toUpperCase()}
                </div>
                <span style={{
                  color: '#fff',
                  fontWeight: '500',
                  fontSize: '0.9rem'
                }}>
                  {user}
                </span>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  background: '#252525',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: '#ccc',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ef4444';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#252525';
                  e.currentTarget.style.color = '#ccc';
                  e.currentTarget.style.borderColor = '#444';
                }}
              >
                ออก
              </button>
            </div>
          ) : (
            <Link href="/login" style={{textDecoration: 'none'}}>
              <button style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
              }}>
                เข้าสู่ระบบ
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
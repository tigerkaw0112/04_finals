"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

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
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i) => i.id === book.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...book, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`เพิ่ม "${book.title}" ลงตะกร้าแล้ว!`, {
      duration: 2500,
      position: "top-center",
    });
  };

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
          color: "#a0aec0",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h2>⏳ กำลังโหลด...</h2>
      </div>
    );

  if (!book)
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
          color: "#a0aec0",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h2>❌ ไม่พบหนังสือเล่มนี้</h2>
        <Link
          href="/"
          style={{
            color: "#3b82f6",
            marginTop: "20px",
            display: "inline-block",
          }}
        >
          กลับหน้าหลัก
        </Link>
      </div>
    );

  return (
    <main
      style={{
        background: "#0b1220",
        minHeight: "100vh",
        padding: "40px 15px 60px",
        fontFamily: "system-ui, sans-serif",
        color: "#e5e7eb",
      }}
    >
      <Toaster
        toastOptions={{
          style: {
            background: "#111827",
            color: "#f9fafb",
            border: "1px solid #1f2937",
          },
          success: {
            iconTheme: { primary: "#3b82f6", secondary: "#111827" },
          },
        }}
      />

      <div
        className="container"
        style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}
      >
        {/* ปุ่มย้อนกลับ */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginBottom: "24px",
            color: "#9ca3af",
            textDecoration: "none",
            fontWeight: 600,
            gap: "8px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
        >
          <span style={{ fontSize: "1.1rem" }}>←</span> กลับหน้าหลัก
        </Link>

        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #0b1220 100%)",
            borderRadius: "24px",
            padding: "40px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
            border: "1px solid #1f2937",
            alignItems: "start",
          }}
        >
          {/* ฝั่งซ้าย: รูปปก */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                border: "1px solid #1f2937",
                background: "#0b1220",
              }}
            >
              <img
                src={book.cover_image || "https://placehold.co/400x600"}
                alt={book.title}
                style={{ width: "100%", display: "block" }}
              />
            </div>
          </div>

          {/* ฝั่งขวา: ข้อมูล */}
          <div>
            <span
              style={{
                background: "rgba(59, 130, 246, 0.12)",
                color: "#93c5fd",
                padding: "8px 16px",
                borderRadius: "999px",
                fontSize: "0.95rem",
                fontWeight: "bold",
                display: "inline-block",
                marginBottom: "16px",
                border: "1px solid rgba(59,130,246,0.3)",
              }}
            >
              {book.category_name || "General"}
            </span>

            <h1
              style={{
                fontSize: "2.6rem",
                fontWeight: "800",
                margin: "0 0 14px",
                color: "#f9fafb",
                lineHeight: "1.2",
                letterSpacing: "-0.5px",
              }}
            >
              {book.title}
            </h1>

            <div
              style={{
                fontSize: "1.05rem",
                color: "#cbd5e1",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>โดย</span>
              <span
                style={{
                  color: "#e5e7eb",
                  fontWeight: "700",
                  borderBottom: "2px solid #3b82f6",
                  paddingBottom: "2px",
                }}
              >
                {book.author}
              </span>
            </div>

            <div
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                color: "#3b82f6",
                marginBottom: "28px",
                letterSpacing: "-1px",
                display: "flex",
                alignItems: "baseline",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "1.2rem", color: "#9ca3af" }}>ราคา</span>
              ฿{book.price}
            </div>

            {/* กล่องเรื่องย่อ */}
            <div
              style={{
                marginBottom: "30px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid #1f2937",
                borderRadius: "14px",
                padding: "18px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.15rem",
                  fontWeight: "700",
                  marginBottom: "10px",
                  color: "#e5e7eb",
                }}
              >
                เรื่องย่อ
              </h3>
              <p
                style={{
                  lineHeight: "1.7",
                  color: "#cbd5e1",
                  fontSize: "1rem",
                  whiteSpace: "pre-line",
                }}
              >
                {book.description || "ไม่มีรายละเอียดเรื่องย่อ..."}
              </p>
            </div>

            {/* ปุ่มกด */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={addToCart}
                disabled={book.stock <= 0}
                style={{
                  flex: "1 1 240px",
                  padding: "16px",
                  borderRadius: "14px",
                  border: "none",
                  background:
                    book.stock > 0
                      ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                      : "#1f2937",
                  color: "white",
                  fontSize: "1.05rem",
                  fontWeight: "bold",
                  cursor: book.stock > 0 ? "pointer" : "not-allowed",
                  boxShadow:
                    book.stock > 0
                      ? "0 12px 30px rgba(59,130,246,0.35)"
                      : "none",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  letterSpacing: "0.2px",
                }}
                onMouseOver={(e) =>
                  !e.target.disabled &&
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                {book.stock > 0 ? (
                  <>
                    <span>🛒</span>
                    <span>เพิ่มลงตะกร้า</span>
                  </>
                ) : (
                  "สินค้าหมด"
                )}
              </button>
            </div>

            <div
              style={{
                marginTop: "18px",
                fontSize: "0.95rem",
                color: "#9ca3af",
                textAlign: "left",
              }}
            >
              สินค้าคงเหลือ:{" "}
              <span style={{ color: "#e5e7eb", fontWeight: 700 }}>
                {book.stock} เล่ม
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
import React, { useState, useRef } from "react";
import "./App.css";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

function App() {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(null);
  const qrRef = useRef(null);

  // Hiện/ẩn popup QR
  const toggleQRPopup = () => setShowQR(!showQR);

  // Nút chia sẻ trang
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Kết bạn với Võ Đạt 💫",
          text: "kết bạn với Võ Đạt nhé!",
          url: window.location.href,
        })
        .catch((error) => console.log("Lỗi khi chia sẻ:", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Trình duyệt không hỗ trợ chia sẻ — liên kết đã được sao chép!");
    }
  };

  // Sao chép link website
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 📸 Chia sẻ hoặc tải mã QR có khung trang trí
  const handleShareQR = async () => {
    const qrBox = qrRef.current;
    if (!qrBox) return;

    const canvas = await html2canvas(qrBox, { scale: 2, backgroundColor: null });
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    const file = new File([blob], "qrcode.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: "Mã QR của Võ Đạt 💫",
          files: [file],
        });
      } catch (error) {
        console.error("Lỗi khi chia sẻ hình ảnh:", error);
      }
    } else {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "qrcode.png";
      link.click();
      alert("Đã tải ảnh mã QR có khung về máy!");
    }
  };

  // 💌 Gửi tin nhắn ẩn danh (qua Discord webhook)
  const sendAnonymousMessage = async () => {
    if (!message.trim()) {
      setToast({ type: "error", text: "⚠️ Vui lòng nhập nội dung!" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    try {
      await fetch(
        "https://discordapp.com/api/webhooks/1430112073957900299/iAj9dO2vWwTqbzsYW7wkTu9THEgiT9B_88C9_gahvidgeEKiRX3Fido3NibPl5C-61AJ",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: `📩 Tin nhắn ẩn danh:\n${message}` }),
        }
      );

      setToast({ type: "success", text: "🎉 Tin nhắn của bạn đã được gửi ẩn danh! 🎉" });
      setMessage("");
    } catch (err) {
      setToast({ type: "error", text: "❌ Lỗi khi gửi tin nhắn!" });
    }

    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="App">
      <div className="header">
        <button className="header-btn left-btn" onClick={toggleQRPopup}>
          <i className="fa-solid fa-qrcode"></i>
        </button>

        😊Cùng kết bạn nhé!😊

        <button className="header-btn right-btn" onClick={handleShare}>
          <i className="fa-solid fa-share"></i>
        </button>
      </div>

      <div className="contact-container">
        <div className="avatar-container">
          <img src="/avarta.png.jpg" alt="Avatar" className="avatar" />
          <h1>Võ Đạt</h1>
        </div>

        <div className="contact-links">
          <a href="https://www.facebook.com/vo.at.489858" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-facebook"></i> Facebook
          </a>
          <a href="https://www.instagram.com/datvo980/" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-instagram"></i> Instagram
          </a>
          <a href="https://www.tiktok.com/@darkrhino65" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-tiktok"></i> Tiktok
          </a>
          <a href="mailto:voletiendat09@gmail.com">
            <i className="fa-solid fa-envelope"></i> Email
          </a>
        </div>

        {/* 💌 Form gửi tin nhắn ẩn danh */}
        <div className="anonymous-message">
          <h2>✉️Gửi tin nhắn ẩn danh</h2>
          <textarea
            placeholder="Nhập nội dung tin nhắn..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendAnonymousMessage}>Gửi</button>
        </div>
      </div>

      {/* Popup QR */}
      {showQR && (
        <div className="qr-popup">
          <div className="qr-content">
            <button className="close-btn" onClick={toggleQRPopup}>
              &times;
            </button>
            <h2>💫 Kết bạn với mình nhé! 💫</h2>

            <div className="qr-frame" ref={qrRef}>
              <div className="qr-border"></div>
              <QRCodeCanvas value={window.location.href} size={200} />
              <p className="qr-caption">SV UIT</p>
            </div>

            <div className="qr-buttons">
              <button onClick={handleCopyLink}>
                <i className="fa-regular fa-copy"></i> Sao chép liên kết
              </button>
              <button onClick={handleShareQR}>
                <i className="fa-regular fa-share-from-square"></i> Chia sẻ mã QR
              </button>
            </div>
          </div>

          {copied && <div className="copy-toast">Đã sao chép liên kết!</div>}
        </div>
      )}

      {/* 🧁 Toast Notification */}
      {toast && <div className={`toast ${toast.type}`}>{toast.text}</div>}
    </div>
  );
}

export default App;

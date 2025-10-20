import React, { useState, useRef } from "react";
import "./App.css";
import { QRCodeCanvas } from "qrcode.react";

function App() {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  // Hiện/ẩn popup QR
  const toggleQRPopup = () => setShowQR(!showQR);

  // Nút chia sẻ trang
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Kết bạn với Võ Đạt 💫",
          text: "Hãy xem trang của mình nhé!",
          url: window.location.href,
        })
        .then(() => console.log("Chia sẻ thành công"))
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

  // Chia sẻ hoặc tải mã QR
  const handleShareQR = async () => {
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
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
        // fallback tải ảnh nếu không share được
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "qrcode.png";
        link.click();
      }
    });
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
      </div>

      {/* Popup QR */}
      {showQR && (
        <div className="qr-popup">
          <div className="qr-content" ref={qrRef}>
            <button className="close-btn" onClick={toggleQRPopup}>
              &times;
            </button>
            <h2>Hãy kết bạn với tôi</h2>
            <QRCodeCanvas value={window.location.href} size={200} />
            <div className="qr-buttons">
              <button onClick={handleCopyLink}><i className="fa-slab fa-regular fa-copy"></i> Sao chép liên kết</button>
              <button onClick={handleShareQR}><i className="fa-regular fa-share-from-square"></i> Chia sẻ mã QR</button>
            </div>
          </div>

          {/* Thông báo khi sao chép */}
          {copied && <div className="copy-toast">Đã sao chép liên kết!</div>}
        </div>
      )}
    </div>
  );
}

export default App;

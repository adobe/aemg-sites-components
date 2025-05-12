function generateQRCode() {
  // const qrCodeContainer = document.getElementById("qrCodeContainer");

  // Clear any previous QR code
  // qrCodeContainer.innerHTML = "";

  // Check if the URL is valid
  try {
    const qrCode = qrCodeGenerator();
    // qrCodeContainer.appendChild(qrCode);
    downloadQRCode(qrCode);
  } catch (e) {
    alert("Invalid URL.");
    console.error("Invalid URL", e);
  }
}

let qrBtn = document.getElementById('generate-qr-btn');
qrBtn.addEventListener('click', () => {
  generateQRCode();
});

function qrCodeGenerator() {
  const qrContainer = document.createElement("canvas");
  var qr = new QRious({
    element: qrContainer,
    value: window.location.href,
  });

  return qrContainer;
}

function downloadQRCode(qrCanvas) {
  const dataURL = qrCanvas.toDataURL("image/png"); // Get the data URL of the QR code
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'qrcode.png'; // Set the filename for the download
  a.click(); // Trigger the download
}

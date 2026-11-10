/**
 * QR & Barcode Scanner Engine
 * Integrates Html5Qrcode with Live Camera, File Drop, Beep Feedback, and USSD generation
 */

export class ScannerEngine {
  constructor() {
    this.html5QrCode = null;
    this.isScanning = false;
    this.currentCameraId = null;
    this.audioCtx = null;
  }

  // Play cashier POS beep
  playBeep() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.12);
    } catch (e) {
      console.warn("Audio beep failed:", e);
    }
  }

  // Start live camera stream in specified container
  async startLiveCamera(elementId, onSuccess, onError) {
    if (typeof Html5Qrcode === "undefined") {
      if (onError) onError(new Error("مكتبة الماسح الضوئي جاري تحميلها..."));
      return;
    }

    try {
      if (this.isScanning) {
        await this.stopScanning();
      }

      this.html5QrCode = new Html5Qrcode(elementId);
      const cameras = await Html5Qrcode.getCameras();
      
      let cameraId = null;
      if (cameras && cameras.length) {
        // Prefer back camera if available (useful for mobile POS)
        const backCam = cameras.find(c => c.label.toLowerCase().includes("back") || c.label.toLowerCase().includes("environment"));
        cameraId = backCam ? backCam.id : cameras[0].id;
        this.currentCameraId = cameraId;
      }

      const config = {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await this.html5QrCode.start(
        cameraId ? { deviceId: { exact: cameraId } } : { facingMode: "environment" },
        config,
        (decodedText, decodedResult) => {
          this.playBeep();
          if (onSuccess) onSuccess(decodedText, decodedResult);
        },
        (errorMessage) => {
          // ignore scan frame errors
        }
      );

      this.isScanning = true;
    } catch (err) {
      console.error("Camera start error:", err);
      this.isScanning = false;
      if (onError) onError(err);
    }
  }

  // Stop camera stream
  async stopScanning() {
    if (this.html5QrCode && this.isScanning) {
      try {
        await this.html5QrCode.stop();
        this.html5QrCode.clear();
      } catch (e) {
        console.warn("Stop scanner error:", e);
      }
      this.isScanning = false;
    }
  }

  // Scan from file (image upload)
  async scanImageFile(file, onSuccess, onError) {
    if (typeof Html5Qrcode === "undefined") {
      if (onError) onError(new Error("مكتبة الماسح الضوئي غير محملة"));
      return;
    }

    try {
      const tempId = "temp-qr-div";
      let tempDiv = document.getElementById(tempId);
      if (!tempDiv) {
        tempDiv = document.createElement("div");
        tempDiv.id = tempId;
        tempDiv.style.display = "none";
        document.body.appendChild(tempDiv);
      }

      const scanner = new Html5Qrcode(tempId);
      const decodedText = await scanner.scanFile(file, true);
      this.playBeep();
      if (onSuccess) onSuccess(decodedText);
      scanner.clear();
    } catch (err) {
      if (onError) onError(err);
    }
  }

  // Parse scanned raw text to detect phone, amount, or reference
  parseScannedPayload(payload) {
    if (!payload) return null;
    const str = String(payload).trim();

    // 1. Check for Vodafone / Egyptian phone number: 010xxxxxxxx, 011..., 012..., 015...
    const phoneMatch = str.match(/01[0125][0-9]{8}/);
    
    // 2. Check for USSD code: *9*7*010xxxxxxxx*amount#
    const ussdMatch = str.match(/\*9\*7\*(01[0-9]{9})\*([0-9]+)#/);

    // 3. Check for amount
    const amtMatch = str.match(/(?:EGP|ج\.م|LE|مبلغ|جنية|جنيه)?\s*([0-9]{2,6}(?:\.[0-9]{1,2})?)/i);

    // 4. Check for transaction reference: VF-... or TX-...
    const refMatch = str.match(/(?:VF|TX|REF)[\-_]?[0-9A-Z]{5,18}/i);

    return {
      raw: str,
      phone: ussdMatch ? ussdMatch[1] : (phoneMatch ? phoneMatch[0] : ""),
      amount: ussdMatch ? ussdMatch[2] : (amtMatch ? amtMatch[1] : ""),
      reference: refMatch ? refMatch[0] : "",
      type: ussdMatch ? "ussd" : (phoneMatch ? "phone" : "generic")
    };
  }
}

export const scannerEngine = new ScannerEngine();

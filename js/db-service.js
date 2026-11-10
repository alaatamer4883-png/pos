/**
 * Database & State Management Service
 * Supports Cloud Firestore with Real-Time Listeners + Bulletproof Local Storage Fallback
 */

import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit 
} from "./firebase-config.js";

const STORAGE_KEYS = {
  LINES: "vf_lines_v2",
  TRANSACTIONS: "vf_transactions_v2",
  PROOFS: "vf_proofs_v2",
  DIRECTORY: "vf_directory_v2",
  SHIFT_REPORT: "vf_shift_active"
};

// Default seed data for the 18 Vodafone Cash Lines
const DEFAULT_18_LINES = [
  { id: "line_01", index: 1, name: "خط الكاشير 01 - الرئيسي", phone: "01024567801", balance: 34500.00, dailyLimit: 60000, dailyUsed: 21500, monthlyLimit: 200000, monthlyUsed: 94000, dailyReceiveLimit: 60000, dailyReceived: 28000, simSlot: "SIM 01", status: "active", cooldown: false, notes: "الخزينة الرقمية الرئيسية" },
  { id: "line_02", index: 2, name: "خط الصرف السريع 02", phone: "01024567802", balance: 18200.00, dailyLimit: 60000, dailyUsed: 38400, monthlyLimit: 200000, monthlyUsed: 112000, dailyReceiveLimit: 60000, dailyReceived: 12000, simSlot: "SIM 02", status: "active", cooldown: false, notes: "مخصص للمسحوبات النقدية" },
  { id: "line_03", index: 3, name: "خط الإيداعات المكثفة 03", phone: "01024567803", balance: 41200.00, dailyLimit: 60000, dailyUsed: 54000, monthlyLimit: 200000, monthlyUsed: 165000, dailyReceiveLimit: 60000, dailyReceived: 49000, simSlot: "SIM 03", status: "warning", cooldown: false, notes: "قارب على الوصول للحد اليومي" },
  { id: "line_04", index: 4, name: "خط الشحن والفواتير 04", phone: "01024567804", balance: 9800.00, dailyLimit: 60000, dailyUsed: 15200, monthlyLimit: 200000, monthlyUsed: 52000, dailyReceiveLimit: 60000, dailyReceived: 19500, simSlot: "SIM 04", status: "active", cooldown: false, notes: "سداد الفواتير والشحن المباشر" },
  { id: "line_05", index: 5, name: "خط خدمة العملاء 05", phone: "01024567805", balance: 12450.00, dailyLimit: 60000, dailyUsed: 9800, monthlyLimit: 200000, monthlyUsed: 44000, dailyReceiveLimit: 60000, dailyReceived: 15000, simSlot: "SIM 05", status: "active", cooldown: false, notes: "معاملات الشباك المباشر" },
  { id: "line_06", index: 6, name: "خط التحويلات الخارجية 06", phone: "01024567806", balance: 7600.00, dailyLimit: 60000, dailyUsed: 22100, monthlyLimit: 200000, monthlyUsed: 78000, dailyReceiveLimit: 60000, dailyReceived: 21000, simSlot: "SIM 06", status: "active", cooldown: false, notes: "تحويلات بين شبكات" },
  { id: "line_07", index: 7, name: "خط التاجر الاحتياطي 07", phone: "01024567807", balance: 2540.00, dailyLimit: 60000, dailyUsed: 58900, monthlyLimit: 200000, monthlyUsed: 194000, dailyReceiveLimit: 60000, dailyReceived: 56000, simSlot: "SIM 07", status: "warning", cooldown: false, notes: "تنبيه: الحد اليومي 98%" },
  { id: "line_08", index: 8, name: "خط الشركات والموردين 08", phone: "01024567808", balance: 15300.00, dailyLimit: 60000, dailyUsed: 11000, monthlyLimit: 200000, monthlyUsed: 62000, dailyReceiveLimit: 60000, dailyReceived: 18000, simSlot: "SIM 08", status: "active", cooldown: false, notes: "تسويات الموزعين" },
  { id: "line_09", index: 9, name: "خط المعاملات الكبرى 09", phone: "01024567809", balance: 22000.00, dailyLimit: 60000, dailyUsed: 29500, monthlyLimit: 200000, monthlyUsed: 92000, dailyReceiveLimit: 60000, dailyReceived: 33000, simSlot: "SIM 09", status: "active", cooldown: false, notes: "عمليات فوق 5000 جنيه" },
  { id: "line_10", index: 10, name: "خط الكاشير المسائي 10", phone: "01024567810", balance: 6400.00, dailyLimit: 60000, dailyUsed: 4200, monthlyLimit: 200000, monthlyUsed: 31000, dailyReceiveLimit: 60000, dailyReceived: 8000, simSlot: "SIM 10", status: "active", cooldown: false, notes: "وردية مسائية" },
  { id: "line_11", index: 11, name: "خط الفرع الفرعي 11", phone: "01024567811", balance: 8900.00, dailyLimit: 60000, dailyUsed: 7600, monthlyLimit: 200000, monthlyUsed: 48000, dailyReceiveLimit: 60000, dailyReceived: 14000, simSlot: "SIM 11", status: "active", cooldown: false, notes: "نقطة بيع ملحقة" },
  { id: "line_12", index: 12, name: "خط الطوارئ 12", phone: "01024567812", balance: 1200.00, dailyLimit: 60000, dailyUsed: 60000, monthlyLimit: 200000, monthlyUsed: 198000, dailyReceiveLimit: 60000, dailyReceived: 60000, simSlot: "SIM 12", status: "locked", cooldown: true, notes: "تم الوصول للحد الأقصى - في انتظار دورة 12 ص" },
  { id: "line_13", index: 13, name: "خط الإيداع السريع 13", phone: "01024567813", balance: 14600.00, dailyLimit: 60000, dailyUsed: 18400, monthlyLimit: 200000, monthlyUsed: 71000, dailyReceiveLimit: 60000, dailyReceived: 26000, simSlot: "SIM 13", status: "active", cooldown: false, notes: "خط إيداعات متفرقة" },
  { id: "line_14", index: 14, name: "خط السحب الآلي 14", phone: "01024567814", balance: 11300.00, dailyLimit: 60000, dailyUsed: 14200, monthlyLimit: 200000, monthlyUsed: 65000, dailyReceiveLimit: 60000, dailyReceived: 19000, simSlot: "SIM 14", status: "active", cooldown: false, notes: "تفريغ السيولة للدرج" },
  { id: "line_15", index: 15, name: "خط محفظة QR 15", phone: "01024567815", balance: 16800.00, dailyLimit: 60000, dailyUsed: 22800, monthlyLimit: 200000, monthlyUsed: 84000, dailyReceiveLimit: 60000, dailyReceived: 31000, simSlot: "SIM 15", status: "active", cooldown: false, notes: "مخصص للمسح الضوئي الذاتي" },
  { id: "line_16", index: 16, name: "خط سداد أقساط 16", phone: "01024567816", balance: 9400.00, dailyLimit: 60000, dailyUsed: 13500, monthlyLimit: 200000, monthlyUsed: 59000, dailyReceiveLimit: 60000, dailyReceived: 18000, simSlot: "SIM 16", status: "active", cooldown: false, notes: "سداد الأقساط والتمويل الاستهلاكي" },
  { id: "line_17", index: 17, name: "خط كاشير احتياط 17", phone: "01024567817", balance: 13500.00, dailyLimit: 60000, dailyUsed: 8900, monthlyLimit: 200000, monthlyUsed: 41000, dailyReceiveLimit: 60000, dailyReceived: 16000, simSlot: "SIM 17", status: "active", cooldown: false, notes: "خط احتياطي للضغط" },
  { id: "line_18", index: 18, name: "خط التسويات المصرفية 18", phone: "01024567818", balance: 17400.00, dailyLimit: 60000, dailyUsed: 19000, monthlyLimit: 200000, monthlyUsed: 88000, dailyReceiveLimit: 60000, dailyReceived: 27000, simSlot: "SIM 18", status: "active", cooldown: false, notes: "تغذية حسابات البنوك والـ InstaPay" }
];

// Default initial transactions for immediate live interaction
const DEFAULT_TRANSACTIONS = [
  {
    id: "TX-90412",
    lineId: "line_01",
    lineName: "خط الكاشير 01 - الرئيسي",
    lineNumber: "01024567801",
    type: "cash_in",
    typeArabic: "إيداع كاش إن",
    amount: 3500.00,
    fee: 25.00,
    customerPhone: "01091234567",
    customerName: "محمد طارق حسن",
    referenceId: "VF-20261108-9842",
    cashier: "أحمد منصور (وردية 2)",
    status: "completed",
    timestamp: Date.now() - 1000 * 60 * 12,
    notes: "إيداع عميل مباشر بالفرع"
  },
  {
    id: "TX-90411",
    lineId: "line_02",
    lineName: "خط الصرف السريع 02",
    lineNumber: "01024567802",
    type: "cash_out",
    typeArabic: "سحب كاش أوت",
    amount: 1800.00,
    fee: 18.00,
    customerPhone: "01065432109",
    customerName: "كريم عبد العزيز",
    referenceId: "VF-20261108-9839",
    cashier: "أحمد منصور (وردية 2)",
    status: "completed",
    timestamp: Date.now() - 1000 * 60 * 35,
    notes: "سحب برقم سري لمرة واحدة OTP"
  },
  {
    id: "TX-90410",
    lineId: "line_03",
    lineName: "خط الإيداعات المكثفة 03",
    lineNumber: "01024567803",
    type: "cash_in",
    typeArabic: "إيداع كاش إن",
    amount: 5000.00,
    fee: 35.00,
    customerPhone: "01011223344",
    customerName: "سارة محمود علي",
    referenceId: "VF-20261108-9825",
    cashier: "أحمد منصور (وردية 2)",
    status: "completed",
    timestamp: Date.now() - 1000 * 60 * 58,
    notes: "إيداع تجاري للمورد"
  },
  {
    id: "TX-90409",
    lineId: "line_07",
    lineName: "خط التاجر الاحتياطي 07",
    lineNumber: "01024567807",
    type: "cash_out",
    typeArabic: "سحب كاش أوت",
    amount: 4200.00,
    fee: 42.00,
    customerPhone: "01088776655",
    customerName: "ياسر النجار",
    referenceId: "VF-20261108-9810",
    cashier: "أحمد منصور (وردية 2)",
    status: "completed",
    timestamp: Date.now() - 1000 * 60 * 85,
    notes: "صرف نقدية لعميل VIP"
  },
  {
    id: "TX-90408",
    lineId: "line_01",
    lineName: "خط الكاشير 01 - الرئيسي",
    lineNumber: "01024567801",
    type: "transfer",
    typeArabic: "تحويل رصيد",
    amount: 2000.00,
    fee: 10.00,
    customerPhone: "01033445566",
    customerName: "مؤسسة الأمل",
    referenceId: "VF-20261108-9799",
    cashier: "أحمد منصور (وردية 2)",
    status: "completed",
    timestamp: Date.now() - 1000 * 60 * 120,
    notes: "تحويل مباشر لمستفيد"
  }
];

// Default initial proofs/screenshots for the Vault
const DEFAULT_PROOFS = [
  {
    id: "PRF-801",
    transactionId: "TX-90412",
    lineId: "line_01",
    lineNumber: "01024567801",
    customerPhone: "01091234567",
    amount: 3500.00,
    status: "verified",
    timestamp: Date.now() - 1000 * 60 * 12,
    ocrData: {
      ref: "VF-20261108-9842",
      sender: "01091234567",
      receiver: "01024567801",
      amount: "3500 EGP",
      time: "17:42",
      statusText: "تم التحويل بنجاح"
    },
    notes: "تمت المطابقة آلياً عبر الرسالة النصية",
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "PRF-802",
    transactionId: "TX-90410",
    lineId: "line_03",
    lineNumber: "01024567803",
    customerPhone: "01011223344",
    amount: 5000.00,
    status: "verified",
    timestamp: Date.now() - 1000 * 60 * 58,
    ocrData: {
      ref: "VF-20261108-9825",
      sender: "01011223344",
      receiver: "01024567803",
      amount: "5000 EGP",
      time: "16:55",
      statusText: "عملية مكتملة"
    },
    notes: "إيصال تطبيق أنا فودافون",
    imageUrl: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "PRF-803",
    transactionId: "TX-90413",
    lineId: "line_05",
    lineNumber: "01024567805",
    customerPhone: "01055566677",
    amount: 1200.00,
    status: "pending",
    timestamp: Date.now() - 1000 * 60 * 4,
    ocrData: {
      ref: "VF-20261108-9901",
      sender: "01055566677",
      receiver: "01024567805",
      amount: "1200 EGP",
      time: "17:50",
      statusText: "قيد المراجعة اليدوية"
    },
    notes: "في انتظار تأكيد الكاشير للرسالة النصية",
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80"
  }
];

class DBService {
  constructor() {
    this.firebaseActive = false;
    this.lines = [];
    this.transactions = [];
    this.proofs = [];
    this.directory = [];
    this.linesListeners = [];
    this.transactionsListeners = [];
    this.proofsListeners = [];
    this.init();
  }

  init() {
    // 1. Load local cache first so UI is instant and resilient
    this.loadFromLocalStorage();

    // 2. Try Firestore real-time sync
    this.initFirestoreSync();

    // 3. Try Backend REST API sync (when running with server.js)
    this.syncWithBackendAPI();
  }

  async syncWithBackendAPI() {
    if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const linesRes = await fetch('/api/lines');
          if (linesRes.ok) {
            const serverLines = await linesRes.json();
            if (Array.isArray(serverLines) && serverLines.length > 0) {
              this.lines = serverLines;
              this.notifyLinesListeners();
            }
          }
          const txRes = await fetch('/api/transactions');
          if (txRes.ok) {
            const serverTxs = await txRes.json();
            if (Array.isArray(serverTxs) && serverTxs.length > 0) {
              this.transactions = serverTxs;
              this.notifyTransactionsListeners();
            }
          }
          console.log("🚀 [Backend API] Synced with Node.js backend server");
        }
      } catch (e) {
        // backend api offline or file:// mode
      }
    }
  }

  loadFromLocalStorage() {
    try {
      const storedLines = localStorage.getItem(STORAGE_KEYS.LINES);
      this.lines = storedLines ? JSON.parse(storedLines) : [...DEFAULT_18_LINES];

      const storedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      this.transactions = storedTx ? JSON.parse(storedTx) : [...DEFAULT_TRANSACTIONS];

      const storedProofs = localStorage.getItem(STORAGE_KEYS.PROOFS);
      this.proofs = storedProofs ? JSON.parse(storedProofs) : [...DEFAULT_PROOFS];

      if (!storedLines) {
        this.saveToLocalStorage();
      }
    } catch (e) {
      console.warn("Local storage parse issue, loading defaults:", e);
      this.lines = [...DEFAULT_18_LINES];
      this.transactions = [...DEFAULT_TRANSACTIONS];
      this.proofs = [...DEFAULT_PROOFS];
    }
  }

  saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.LINES, JSON.stringify(this.lines));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.transactions));
      localStorage.setItem(STORAGE_KEYS.PROOFS, JSON.stringify(this.proofs));
    } catch (e) {
      console.error("Local storage save error:", e);
    }
  }

  async initFirestoreSync() {
    if (!db) {
      this.notifyFirebaseStatus(false, "Firebase لم يتم تهيئته");
      return;
    }

    try {
      const linesCol = collection(db, "vf_lines");
      
      // Listen to Firestore real-time changes
      onSnapshot(linesCol, (snapshot) => {
        this.firebaseActive = true;
        this.notifyFirebaseStatus(true, "متصل بـ Firebase Live");

        if (snapshot.empty) {
          console.log("🔥 Firestore empty. Seeding 18 Vodafone Cash lines...");
          this.seedFirestoreLines();
        } else {
          const remoteLines = [];
          snapshot.forEach(docSnap => {
            remoteLines.push({ ...docSnap.data(), id: docSnap.id });
          });
          remoteLines.sort((a, b) => (a.index || 0) - (b.index || 0));
          this.lines = remoteLines;
          this.saveToLocalStorage();
          this.notifyLinesListeners();
        }
      }, (err) => {
        console.warn("⚠️ Firestore access restricted or offline:", err.message);
        this.firebaseActive = false;
        this.notifyFirebaseStatus(false, "وضع محلي آمن (راجع قواعد Firebase)");
      });

      // Listen to transactions
      const txCol = collection(db, "vf_transactions");
      const txQuery = query(txCol, orderBy("timestamp", "desc"), limit(200));
      onSnapshot(txQuery, (snapshot) => {
        if (!snapshot.empty) {
          const remoteTx = [];
          snapshot.forEach(docSnap => {
            remoteTx.push({ ...docSnap.data(), id: docSnap.id });
          });
          this.transactions = remoteTx;
          this.saveToLocalStorage();
          this.notifyTransactionsListeners();
        }
      }, (err) => {
        console.warn("⚠️ Firestore tx listen error:", err.message);
      });

      // Listen to screenshots/proofs
      const proofsCol = collection(db, "vf_proofs");
      onSnapshot(proofsCol, (snapshot) => {
        if (!snapshot.empty) {
          const remoteProofs = [];
          snapshot.forEach(docSnap => {
            remoteProofs.push({ ...docSnap.data(), id: docSnap.id });
          });
          this.proofs = remoteProofs;
          this.saveToLocalStorage();
          this.notifyProofsListeners();
        }
      }, (err) => {
        console.warn("⚠️ Firestore proofs listen error:", err.message);
      });

    } catch (err) {
      console.warn("Firestore init sync error:", err);
      this.firebaseActive = false;
      this.notifyFirebaseStatus(false, "وضع التخزين المحلي النشط");
    }
  }

  async seedFirestoreLines() {
    if (!db || !this.firebaseActive) return;
    try {
      for (const line of DEFAULT_18_LINES) {
        await setDoc(doc(db, "vf_lines", line.id), line);
      }
      for (const tx of DEFAULT_TRANSACTIONS) {
        await setDoc(doc(db, "vf_transactions", tx.id), tx);
      }
      for (const p of DEFAULT_PROOFS) {
        await setDoc(doc(db, "vf_proofs", p.id), p);
      }
      console.log("✅ Firestore seeded with 18 Vodafone Cash Lines!");
    } catch (e) {
      console.warn("Seeding firestore error:", e.message);
    }
  }

  notifyFirebaseStatus(connected, message) {
    window.dispatchEvent(new CustomEvent("firebase-status", {
      detail: { connected, message }
    }));
  }

  // --- Subscriptions ---
  subscribeLines(cb) {
    this.linesListeners.push(cb);
    cb(this.lines);
    return () => {
      this.linesListeners = this.linesListeners.filter(fn => fn !== cb);
    };
  }

  notifyLinesListeners() {
    this.linesListeners.forEach(cb => cb(this.lines));
  }

  subscribeTransactions(cb) {
    this.transactionsListeners.push(cb);
    cb(this.transactions);
    return () => {
      this.transactionsListeners = this.transactionsListeners.filter(fn => fn !== cb);
    };
  }

  notifyTransactionsListeners() {
    this.transactionsListeners.forEach(cb => cb(this.transactions));
  }

  subscribeProofs(cb) {
    this.proofsListeners.push(cb);
    cb(this.proofs);
    return () => {
      this.proofsListeners = this.proofsListeners.filter(fn => fn !== cb);
    };
  }

  notifyProofsListeners() {
    this.proofsListeners.forEach(cb => cb(this.proofs));
  }

  // --- Operations ---
  getLines() {
    return this.lines;
  }

  getLine(lineId) {
    return this.lines.find(l => l.id === lineId) || null;
  }

  async updateLine(lineId, updates) {
    const idx = this.lines.findIndex(l => l.id === lineId);
    if (idx !== -1) {
      this.lines[idx] = { ...this.lines[idx], ...updates };
      this.saveToLocalStorage();
      this.notifyLinesListeners();

      if (this.firebaseActive && db) {
        try {
          await updateDoc(doc(db, "vf_lines", lineId), updates);
        } catch (e) {
          console.warn("Failed to update line in firestore:", e.message);
        }
      }

      // Sync to backend REST API
      if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
        fetch(`/api/lines/${lineId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        }).catch(() => {});
      }
      return this.lines[idx];
    }
    return null;
  }

  async addTransaction(tx) {
    // Compute transaction ID
    const newId = "TX-" + Math.floor(10000 + Math.random() * 90000);
    const completeTx = {
      id: newId,
      timestamp: Date.now(),
      status: "completed",
      cashier: "أحمد منصور (وردية 2)",
      ...tx
    };

    // Update the corresponding line balance & daily limit
    const line = this.getLine(tx.lineId);
    if (line) {
      let newBalance = line.balance;
      let newDailyUsed = line.dailyUsed || 0;
      let newMonthlyUsed = line.monthlyUsed || 0;
      let newDailyReceived = line.dailyReceived || 0;

      const amt = Number(tx.amount);
      const fee = Number(tx.fee || 0);

      if (tx.type === "cash_in") {
        // Customer gives cash, cashier sends from this wallet line
        newBalance -= amt;
        newDailyUsed += amt;
        newMonthlyUsed += amt;
      } else if (tx.type === "cash_out") {
        // Customer sends to this wallet line, cashier gives cash from drawer
        newBalance += amt;
        newDailyReceived += amt;
      } else if (tx.type === "transfer") {
        newBalance -= amt;
        newDailyUsed += amt;
        newMonthlyUsed += amt;
      }

      // Check status threshold
      let status = "active";
      if (newDailyUsed >= line.dailyLimit * 0.95 || newBalance < 1000) {
        status = "warning";
      }
      if (newDailyUsed >= line.dailyLimit) {
        status = "locked";
      }

      await this.updateLine(line.id, {
        balance: Math.max(0, newBalance),
        dailyUsed: newDailyUsed,
        monthlyUsed: newMonthlyUsed,
        dailyReceived: newDailyReceived,
        status: status,
        lastActive: new Date().toISOString()
      });
    }

    // Add to local state
    this.transactions.unshift(completeTx);
    this.saveToLocalStorage();
    this.notifyTransactionsListeners();

    // Sync to Firestore
    if (this.firebaseActive && db) {
      try {
        await setDoc(doc(db, "vf_transactions", newId), completeTx);
      } catch (e) {
        console.warn("Failed to add tx to firestore:", e.message);
      }
    }

    // Sync to Backend REST API
    if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
      fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeTx)
      }).catch(() => {});
    }

    return completeTx;
  }

  async addProof(proof) {
    const newId = "PRF-" + Math.floor(1000 + Math.random() * 9000);
    const completeProof = {
      id: newId,
      timestamp: Date.now(),
      status: proof.status || "verified",
      ...proof
    };

    this.proofs.unshift(completeProof);
    this.saveToLocalStorage();
    this.notifyProofsListeners();

    if (this.firebaseActive && db) {
      try {
        await setDoc(doc(db, "vf_proofs", newId), completeProof);
      } catch (e) {
        console.warn("Failed to add proof to firestore:", e.message);
      }
    }

    // Sync to Backend REST API
    if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
      fetch('/api/proofs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeProof)
      }).catch(() => {});
    }

    return completeProof;
  }

  async updateProofStatus(proofId, newStatus) {
    const idx = this.proofs.findIndex(p => p.id === proofId);
    if (idx !== -1) {
      this.proofs[idx].status = newStatus;
      this.saveToLocalStorage();
      this.notifyProofsListeners();

      if (this.firebaseActive && db) {
        try {
          await updateDoc(doc(db, "vf_proofs", proofId), { status: newStatus });
        } catch (e) {
          console.warn("Failed to update proof in firestore:", e.message);
        }
      }
      return this.proofs[idx];
    }
    return null;
  }

  // --- Financial Calculations & KPIs ---
  getMetrics() {
    // Total float across all 18 lines
    const totalFloat = this.lines.reduce((sum, l) => sum + (Number(l.balance) || 0), 0);

    // Filter today's transactions
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayTimestamp = startOfDay.getTime();

    const todayTxs = this.transactions.filter(t => t.timestamp >= todayTimestamp);

    const totalInflow = todayTxs
      .filter(t => t.type === "cash_in")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const totalOutflow = todayTxs
      .filter(t => t.type === "cash_out")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const totalFees = todayTxs.reduce((sum, t) => sum + (Number(t.fee) || 0), 0);

    const totalVolume = totalInflow + totalOutflow;
    const netDrawerDelta = totalInflow - totalOutflow + totalFees;

    const activeLinesCount = this.lines.filter(l => l.status === "active").length;
    const warningLinesCount = this.lines.filter(l => l.status === "warning").length;
    const lockedLinesCount = this.lines.filter(l => l.status === "locked").length;

    return {
      totalFloat,
      totalVolume,
      totalInflow,
      totalOutflow,
      totalFees,
      netDrawerDelta,
      txCount: todayTxs.length,
      activeLinesCount,
      warningLinesCount,
      lockedLinesCount,
      todayTxs
    };
  }
}

export const dbService = new DBService();

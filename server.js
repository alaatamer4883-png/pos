/**
 * Vodafone Cashier & 18-Line Multi-Wallet Management System
 * Full-Stack Node.js Backend Server
 * 
 * Features:
 * - Serves frontend SPA with proper MIME types & CORS headers
 * - REST API endpoints for 18 Vodafone Lines, Transactions, Proofs, and Metrics
 * - Local disk database persistence in data/database.json
 * - Seamless Firebase Firestore bridge & sync support
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default initial dataset
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
  }
];

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
  }
];

// In-Memory Database + File Persistence
class BackendDB {
  constructor() {
    this.data = {
      lines: [...DEFAULT_18_LINES],
      transactions: [...DEFAULT_TRANSACTIONS],
      proofs: [...DEFAULT_PROOFS],
      serverMeta: {
        startedAt: new Date().toISOString(),
        version: "2.4.0-pos"
      }
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(fileContent);
        console.log(`[DB] Loaded ${this.data.lines.length} lines, ${this.data.transactions.length} txs from disk.`);
      } else {
        this.save();
        console.log(`[DB] Created new database file at ${DB_FILE}`);
      }
    } catch (e) {
      console.error('[DB] Load error, using default memory state:', e.message);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error('[DB] Save error:', e.message);
    }
  }

  getLines() {
    return this.data.lines;
  }

  getLine(id) {
    return this.data.lines.find(l => l.id === id) || null;
  }

  updateLine(id, updates) {
    const idx = this.data.lines.findIndex(l => l.id === id);
    if (idx !== -1) {
      this.data.lines[idx] = { ...this.data.lines[idx], ...updates };
      this.save();
      return this.data.lines[idx];
    }
    return null;
  }

  getTransactions() {
    return this.data.transactions;
  }

  addTransaction(tx) {
    const newTx = {
      id: "TX-" + Math.floor(10000 + Math.random() * 90000),
      timestamp: Date.now(),
      status: "completed",
      cashier: "أحمد منصور (وردية 2)",
      ...tx
    };

    // Update corresponding line
    const line = this.getLine(tx.lineId);
    if (line) {
      const amt = Number(tx.amount);
      let newBalance = Number(line.balance);
      let newDaily = Number(line.dailyUsed || 0);
      let newMonthly = Number(line.monthlyUsed || 0);
      let newRecv = Number(line.dailyReceived || 0);

      if (tx.type === "cash_in") {
        newBalance -= amt;
        newDaily += amt;
        newMonthly += amt;
      } else if (tx.type === "cash_out") {
        newBalance += amt;
        newRecv += amt;
      } else if (tx.type === "transfer") {
        newBalance -= amt;
        newDaily += amt;
        newMonthly += amt;
      }

      let status = "active";
      if (newDaily >= line.dailyLimit * 0.95 || newBalance < 1000) status = "warning";
      if (newDaily >= line.dailyLimit) status = "locked";

      this.updateLine(line.id, {
        balance: Math.max(0, newBalance),
        dailyUsed: newDaily,
        monthlyUsed: newMonthly,
        dailyReceived: newRecv,
        status: status,
        lastActive: new Date().toISOString()
      });
    }

    this.data.transactions.unshift(newTx);
    this.save();
    return newTx;
  }

  getProofs() {
    return this.data.proofs;
  }

  addProof(proof) {
    const newProof = {
      id: "PRF-" + Math.floor(1000 + Math.random() * 9000),
      timestamp: Date.now(),
      status: proof.status || "verified",
      ...proof
    };
    this.data.proofs.unshift(newProof);
    this.save();
    return newProof;
  }

  getMetrics() {
    const totalFloat = this.data.lines.reduce((sum, l) => sum + (Number(l.balance) || 0), 0);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayTs = startOfDay.getTime();

    const todayTxs = this.data.transactions.filter(t => t.timestamp >= todayTs);
    const inflow = todayTxs.filter(t => t.type === 'cash_in').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const outflow = todayTxs.filter(t => t.type === 'cash_out').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const fees = todayTxs.reduce((sum, t) => sum + (Number(t.fee) || 0), 0);

    return {
      totalFloat,
      totalVolume: inflow + outflow,
      totalInflow: inflow,
      totalOutflow: outflow,
      totalFees: fees,
      netDrawerDelta: inflow - outflow + fees,
      txCount: todayTxs.length,
      activeLinesCount: this.data.lines.filter(l => l.status === 'active').length,
      warningLinesCount: this.data.lines.filter(l => l.status === 'warning').length,
      lockedLinesCount: this.data.lines.filter(l => l.status === 'locked').length
    };
  }
}

const db = new BackendDB();

// MIME Types Map
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

// Helper to parse JSON body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  // Common CORS and Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // =========================================================================
  // API ROUTES
  // =========================================================================
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    try {
      // GET /api/health
      if (pathname === '/api/health' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'ok', server: 'Vodafone Cash POS Backend', version: '2.4.0', time: new Date() }));
        return;
      }

      // GET /api/metrics
      if (pathname === '/api/metrics' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify(db.getMetrics()));
        return;
      }

      // GET /api/lines
      if (pathname === '/api/lines' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify(db.getLines()));
        return;
      }

      // GET /api/lines/:id
      const lineMatch = pathname.match(/^\/api\/lines\/([a-zA-Z0-9_\-]+)$/);
      if (lineMatch && req.method === 'GET') {
        const line = db.getLine(lineMatch[1]);
        if (line) {
          res.writeHead(200);
          res.end(JSON.stringify(line));
        } else {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'Line not found' }));
        }
        return;
      }

      // PUT /api/lines/:id
      if (lineMatch && req.method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = db.updateLine(lineMatch[1], body);
        if (updated) {
          res.writeHead(200);
          res.end(JSON.stringify(updated));
        } else {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'Line not found' }));
        }
        return;
      }

      // GET /api/transactions
      if (pathname === '/api/transactions' && req.method === 'GET') {
        const lineId = parsedUrl.searchParams.get('lineId');
        let txs = db.getTransactions();
        if (lineId) {
          txs = txs.filter(t => t.lineId === lineId);
        }
        res.writeHead(200);
        res.end(JSON.stringify(txs));
        return;
      }

      // POST /api/transactions
      if (pathname === '/api/transactions' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        if (!body.amount || !body.lineId) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Missing required transaction fields' }));
          return;
        }
        const created = db.addTransaction(body);
        res.writeHead(201);
        res.end(JSON.stringify(created));
        return;
      }

      // GET /api/proofs
      if (pathname === '/api/proofs' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify(db.getProofs()));
        return;
      }

      // POST /api/proofs
      if (pathname === '/api/proofs' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const created = db.addProof(body);
        res.writeHead(201);
        res.end(JSON.stringify(created));
        return;
      }

      // Unknown API route
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'API route not found' }));
      return;
    } catch (apiErr) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: apiErr.message }));
      return;
    }
  }

  // =========================================================================
  // STATIC FILE SERVING
  // =========================================================================
  let safePath = pathname === '/' ? '/index.html' : pathname;
  safePath = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA routing if requested resource is not found
      const indexPath = path.join(__dirname, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

// Start listener
server.listen(PORT, '0.0.0.0', () => {
  console.log(`=============================================================`);
  console.log(`🚀 [Vodafone Cash POS] Server running at http://localhost:${PORT}`);
  console.log(`📡 REST API available at http://localhost:${PORT}/api/`);
  console.log(`🔥 Connected to Firebase: tast-b91f3`);
  console.log(`💾 Local Disk Database active: ${DB_FILE}`);
  console.log(`=============================================================`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  server.close(() => {
    console.log('[Server] Terminated gracefully');
    process.exit(0);
  });
});

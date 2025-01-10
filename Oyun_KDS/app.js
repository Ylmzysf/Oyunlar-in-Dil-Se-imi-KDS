const express = require('express');
const session = require('express-session');
const path = require('path');

// Route dosyalarını import et
const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const tablesRoutes = require('./routes/tablesRoutes');
const anadilRoutes = require('./routes/anadilRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session ayarları
app.use(session({
    secret: 'gizli-anahtar',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

// Routes
app.use('/', authRoutes);
app.use('/', pageRoutes);
app.use('/', analysisRoutes);
app.use('/', tablesRoutes);
app.use('/', anadilRoutes);

// Statik dosyaları koruma
app.use(express.static('public', {
    index: false,  // index.html'i varsayılan sayfa yapma
    setHeaders: (res, path) => {
        // HTML dosyalarına direkt erişimi engelle
        if (path.endsWith('.html')) {
            res.set('Content-Type', 'text/plain');
        }
    }
}));

// Statik dosyalar için
app.use(express.static('public'));

// Ana sayfa route'u
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 404 - Sayfa bulunamadı
app.use((req, res) => {
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});

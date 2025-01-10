const express = require('express');
const router = express.Router();
const connection = require('../config/database');

// Login işlemi
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const query = 'SELECT * FROM kullaniciler WHERE kullanici_adi = ? AND sifre = ?';
    connection.query(query, [username, password], (err, results) => {
        if (err) throw err;
        
        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;
            req.session.isim = results[0].isim;
            req.session.soyisim = results[0].soyisim;
            res.redirect('/anadil.html');
        } else {
            res.redirect('/?error=1');
        }
    });
});

// Çıkış işlemi
router.get('/logout', (req, res) => {
    // Session'ı temizle
    req.session.destroy((err) => {
        if(err) {
            console.log(err);
        }
        // Browser'daki çerezleri temizle
        res.clearCookie('connect.sid');
        // Login sayfasına yönlendir
        res.redirect('/');
    });
});

module.exports = router;
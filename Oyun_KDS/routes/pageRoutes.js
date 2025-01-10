const express = require('express');
const router = express.Router();
const path = require('path');
const { requireLogin } = require('../middleware/authMiddleware');
const fs = require('fs');

// HTML dosyalarını okuyup kullanıcı bilgilerini ekleyen fonksiyon
function sendHtmlWithUserInfo(res, filePath, userInfo) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Dosya okuma hatası');
            return;
        }
        
        // Kullanıcı bilgilerini HTML'e ekle
        const userInfoHtml = `
            <div class="user-info" style="color: white; padding: 10px;">
                ${userInfo.isim} ${userInfo.soyisim}
            </div>
        `;
        
        // nav-menu div'inin başına kullanıcı bilgilerini ekle
        const updatedHtml = data.replace('<div class="nav-menu">', 
            `<div class="nav-menu">${userInfoHtml}`);
        
        res.send(updatedHtml);
    });
}

router.get('/anadil.html', requireLogin, (req, res) => {
    const userInfo = {
        isim: req.session.isim,
        soyisim: req.session.soyisim
    };
    sendHtmlWithUserInfo(res, path.join(__dirname, '../public/anadil.html'), userInfo);
});

router.get('/tablolar.html', requireLogin, (req, res) => {
    const userInfo = {
        isim: req.session.isim,
        soyisim: req.session.soyisim
    };
    sendHtmlWithUserInfo(res, path.join(__dirname, '../public/tablolar.html'), userInfo);
});

router.get('/analiz.html', requireLogin, (req, res) => {
    const userInfo = {
        isim: req.session.isim,
        soyisim: req.session.soyisim
    };
    sendHtmlWithUserInfo(res, path.join(__dirname, '../public/analiz.html'), userInfo);
});

module.exports = router;
const express = require('express');
const router = express.Router();
const connection = require('../config/database');

// Seçilen dilin menşei ülkesindeki oyunların dil dağılımını getir
router.get('/api/anadil-origin-games/:dil_ad', (req, res) => {
    const query = `
        SELECT 
            d2.dil_ad,
            COUNT(*) as kullanim_sayisi,
            d2.nufus_m as anadil_nufus,
            d2.nufus_konusan_m as toplam_nufus,
            (d2.nufus_konusan_m - d2.nufus_m) as ikinci_dil_nufus
        FROM oyunlar o
        JOIN oyun_dil od ON o.oyun_id = od.oyun_id
        JOIN dil d1 ON d1.dil_id = o.firma_mensei
        JOIN oyun_dil od2 ON o.oyun_id = od2.oyun_id
        JOIN dil d2 ON d2.dil_id = od2.dil_id
        WHERE d1.dil_ad = ?
        GROUP BY d2.dil_ad, d2.nufus_m, d2.nufus_konusan_m
        ORDER BY kullanim_sayisi DESC
    `;
    
    connection.query(query, [req.params.dil_ad], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası' });
            return;
        }
        res.json(results);
    });
});

// Dil listesini getir
router.get('/api/anadil-list', (req, res) => {
    const query = `
        SELECT DISTINCT d.dil_ad
        FROM dil d
        JOIN oyunlar o ON d.dil_id = o.firma_mensei
        ORDER BY d.dil_ad
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası' });
            return;
        }
        res.json(results);
    });
});

// Seçilen dilin menşei olduğu oyunların dil dağılımını getir
router.get('/api/anadil-mensei-games/:dil_ad', (req, res) => {
    const query = `
        SELECT 
            d2.dil_ad,
            COUNT(*) as oyun_sayisi
        FROM oyunlar o
        JOIN dil d1 ON o.firma_mensei = d1.dil_id
        JOIN oyun_dil od ON o.oyun_id = od.oyun_id
        JOIN dil d2 ON od.dil_id = d2.dil_id
        WHERE d1.dil_ad = ?
        GROUP BY d2.dil_ad
        ORDER BY oyun_sayisi DESC
    `;
    
    connection.query(query, [req.params.dil_ad], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası' });
            return;
        }
        res.json(results);
    });
});

module.exports = router;
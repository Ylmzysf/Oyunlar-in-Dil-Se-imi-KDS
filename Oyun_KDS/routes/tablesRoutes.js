const express = require('express');
const router = express.Router();
const connection = require('../config/database');

// Tüm oyunların dil kullanım istatistiklerini getir
router.get('/api/all-games-languages', (req, res) => {
    const query = `
        SELECT 
            d.dil_ad,
            COUNT(*) as kullanim_sayisi,
            d.nufus_m as konusan_nufus,
            d.nufus_konusan_m as toplam_konusan_nufus
        FROM oyun_dil od
        JOIN dil d ON d.dil_id = od.dil_id
        GROUP BY d.dil_ad, d.nufus_m, d.nufus_konusan_m
        ORDER BY kullanim_sayisi DESC
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

// Tüm oyunların tür kullanım istatistiklerini getir
router.get('/api/all-games-types', (req, res) => {
    const query = `
        SELECT 
            t.tur_ad,
            COUNT(*) as kullanim_sayisi
        FROM oyun_tur ot
        JOIN turler t ON t.tur_id = ot.tur_id
        GROUP BY t.tur_ad
        ORDER BY kullanim_sayisi DESC
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

// Dillerin ana dil ve toplam konuşan nüfus farkını getir
router.get('/api/languages-population-diff', (req, res) => {
    const query = `
        SELECT 
            dil_ad,
            nufus_m as anadil_nufus,
            nufus_konusan_m as toplam_nufus,
            (nufus_konusan_m - nufus_m) as ikinci_dil_nufus
        FROM dil
        ORDER BY ikinci_dil_nufus DESC
        LIMIT 10
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

module.exports = router; 
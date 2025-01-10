const express = require('express');
const router = express.Router();
const connection = require('../config/database');

// Tüm oyun türlerini getir
router.get('/api/gametypes', async (req, res) => {
    const query = 'SELECT * FROM turler ORDER BY tur_ad COLLATE utf8mb3_turkish_ci';
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası' });
            return;
        }
        res.json(results);
    });
});

// Seçilen türlerin kesişimindeki oyunların dil analizini yap
router.post('/api/analyze-intersection', (req, res) => {
    const types = req.body.types;
    
    if (!types || types.length === 0) {
        return res.status(400).json({ error: 'En az bir tür seçilmelidir' });
    }

    const query = `
        WITH TurKesisim AS (
            SELECT ot.oyun_id
            FROM oyun_tur ot
            JOIN turler t ON t.tur_id = ot.tur_id
            WHERE t.tur_ad IN (?)
            GROUP BY ot.oyun_id
            HAVING COUNT(DISTINCT t.tur_ad) = ?
        )
        SELECT 
            d.dil_ad,
            COUNT(*) as kullanim_sayisi,
            d.nufus_m as konusan_nufus
        FROM TurKesisim tk
        JOIN oyun_dil od ON od.oyun_id = tk.oyun_id
        JOIN dil d ON d.dil_id = od.dil_id
        GROUP BY d.dil_ad, d.nufus_m
        ORDER BY kullanim_sayisi DESC, konusan_nufus DESC
    `;
    
    connection.query(query, [types, types.length], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası' });
            return;
        }
        res.json(results);
    });
});

// Seçilen türlerin kesişimindeki oyunların istatistiklerini getir
router.post('/api/analyze-stats', (req, res) => {
    const types = req.body.types;
    
    if (!types || types.length === 0) {
        return res.status(400).json({ error: 'En az bir tür seçilmelidir' });
    }

    const query = `
        WITH TurKesisim AS (
            SELECT ot.oyun_id
            FROM oyun_tur ot
            JOIN turler t ON t.tur_id = ot.tur_id
            WHERE t.tur_ad IN (?)
            GROUP BY ot.oyun_id
            HAVING COUNT(DISTINCT t.tur_ad) = ?
        )
        SELECT 
            COUNT(*) as oyun_sayisi,
            ROUND(AVG(o.oyun_fiyat), 2) as ortalama_fiyat,
            ROUND(AVG(o.begenme_orani), 2) as ortalama_begeni,
            ROUND(AVG(o.takipci_sayisi)) as ortalama_takipci
        FROM TurKesisim tk
        JOIN oyunlar o ON o.oyun_id = tk.oyun_id
    `;
    
    connection.query(query, [types, types.length], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası' });
            return;
        }
        res.json(results[0]);
    });
});

// ... diğer kodlar aynı ...

// Tüm oyunların istatistiklerini getir
router.get('/api/all-games-stats', (req, res) => {
    const query = `
        SELECT 
            COUNT(*) as oyun_sayisi,
            ROUND(AVG(oyun_fiyat), 2) as ortalama_fiyat,
            ROUND(AVG(begenme_orani), 2) as ortalama_begeni,
            ROUND(AVG(takipci_sayisi)) as ortalama_takipci
        FROM oyunlar
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Veritabanı hatası' });
            return;
        }
        res.json(results[0]);
    });
});

router.get('/api/analysis-data', (req, res) => {
    const query = `
        SELECT 
            d.dil_ad,
            COUNT(DISTINCT o.oyun_id) as oyun_sayisi,
            ROUND(AVG(o.fiyat), 2) as ortalama_fiyat,
            d.nufus_konusan_m
        FROM dil d
        JOIN oyun_dil od ON d.dil_id = od.dil_id
        JOIN oyunlar o ON od.oyun_id = o.oyun_id
        GROUP BY d.dil_ad, d.nufus_konusan_m
        ORDER BY oyun_sayisi DESC
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
module.exports = router; 
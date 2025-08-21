// SUNUCUYU BU DOSYAYA KURUN

// Gerekli kütüphaneleri ve modülleri içeri aktarıyoruz
const express = require('express');
const cors = require('cors'); // 1. BU SATIRI EKLE
const Users = require('./users/model.js'); // Veritabanı fonksiyonlarımızı buradan alıyoruz

// Sunucumuzu oluşturuyoruz
const server = express();

// Gelen isteklerin body kısmındaki JSON verilerini okuyabilmek için bu middleware'i kullanıyoruz
server.use(express.json());
server.use(cors()); // 2. BU SATIRI EKLE
// Buraya Uç Noktaları (Endpoints) yazacağız...

server.get('/api/users', (req, res) => {
  Users.find()
    .then(users => {
      // Başarılı olursa, kullanıcı listesini JSON olarak gönder
      res.status(200).json(users);
    })
    .catch(err => {
      // Hata olursa, 500 durum kodu ve hata mesajı gönder
      res.status(500).json({ message: "Kullanıcı bilgileri alınamadı" });
    });
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params; // URL'den id'yi alıyoruz

  Users.findById(id)
    .then(user => {
      if (user) {
        // Eğer kullanıcı bulunduysa, kullanıcıyı gönder
        res.status(200).json(user);
      } else {
        // Kullanıcı bulunamadıysa, 404 durum kodu ve hata mesajı gönder
        res.status(404).json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
      }
    })
    .catch(err => {
      // Genel bir sunucu hatası olursa
      res.status(500).json({ message: "Kullanıcı bilgisi alınamadı" });
    });
});
server.post('/api/users', (req, res) => {
  const { name, bio } = req.body; // İstek gövdesinden name ve bio'yu alıyoruz

  // İstenen bilgilerin eksik olup olmadığını kontrol ediyoruz
  if (!name || !bio) {
    return res.status(400).json({ message: "Lütfen kullanıcı için bir name ve bio sağlayın" });
  }

  Users.insert({ name, bio })
    .then(newUser => {
      // Başarıyla oluşturulursa, 201 durum kodu ve yeni kullanıcıyı gönder
      res.status(201).json(newUser);
    })
    .catch(err => {
      // Veritabanına kaydederken hata olursa
      res.status(500).json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
    });
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  Users.remove(id)
    .then(deletedUser => {
      if (deletedUser) {
        // Silinen kullanıcı varsa, onu geri döndür
        res.status(200).json(deletedUser);
      } else {
        // Silinecek kullanıcı bulunamadıysa
        res.status(404).json({ message: "Belirtilen ID li kullanıcı bulunamadı" });
      }
    })
    .catch(err => {
      // Silme sırasında bir hata olursa
      res.status(500).json({ message: "Kullanıcı silinemedi" });
    });
});

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  // Gerekli bilgilerin eksik olup olmadığını kontrol et
  if (!changes.name || !changes.bio) {
    return res.status(400).json({ message: "Lütfen kullanıcı için name ve bio sağlayın" });
  }

  Users.update(id, changes)
    .then(updatedUser => {
      if (updatedUser) {
        // Güncellenen kullanıcı varsa, onu döndür
        res.status(200).json(updatedUser);
      } else {
        // Güncellenecek kullanıcı bulunamadıysa
        res.status(404).json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
      }
    })
    .catch(err => {
      // Güncelleme sırasında bir hata olursa
      res.status(500).json({ message: "Kullanıcı bilgileri güncellenemedi" });
    });
});




// Sunucumuzu dışa aktarıyoruz ki index.js'de kullanabilelim
module.exports = server; // SERVERINIZI EXPORT EDİN {}

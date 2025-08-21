import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  // YENİ: Formdaki inputların değerini tutmak için yeni bir state
  const [newUser, setNewUser] = useState({ name: '', bio: '' });

  // Mevcut kullanıcıları çeken useEffect fonksiyonu aynı kalıyor
  useEffect(() => {
    fetch('http://localhost:9000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('API verileri çekilirken hata oluştu:', err));
  }, []);

  // Mevcut silme fonksiyonu aynı kalıyor
  const handleDelete = (id) => {
    fetch(`http://localhost:9000/api/users/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Kullanıcı silinirken bir hata oluştu.');
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(err => console.error('Silme hatası:', err));
  };

  // YENİ: Formdaki inputlar değiştikçe state'i güncelleyen fonksiyon
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // YENİ: Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = (e) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engeller
    fetch('http://localhost:9000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser), // State'teki form verisini JSON'a çevirip gönderir
    })
    .then(res => res.json())
    .then(addedUser => {
      // API'den dönen yeni kullanıcıyı mevcut listeye ekleriz
      setUsers([...users, addedUser]);
      // Formu temizleriz
      setNewUser({ name: '', bio: '' });
    })
    .catch(err => console.error('Kullanıcı eklenirken hata oluştu:', err));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kullanıcı Yönetim Paneli</h1>

        {/* YENİ: Yeni Kullanıcı Ekleme Formu */}
        <div className="user-form">
          <h2>Yeni Kullanıcı Ekle</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              value={newUser.name}
              onChange={handleChange}
              placeholder="İsim"
              required
            />
            <input
              name="bio"
              value={newUser.bio}
              onChange={handleChange}
              placeholder="Bio"
              required
            />
            <button type="submit">Kaydet</button>
          </form>
        </div>

        <div className="user-list">
          <h2>Mevcut Kullanıcılar</h2>
          {users.length === 0 ? (
            <p>Gösterilecek kullanıcı bulunamadı.</p>
          ) : (
            <ul>
              {users.map(user => (
                <li key={user.id}>
                  <div>
                    <h3>{user.name} (ID: {user.id})</h3>
                    <p>{user.bio}</p>
                  </div>
                  <button onClick={() => handleDelete(user.id)} className="delete-button">
                    Sil
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
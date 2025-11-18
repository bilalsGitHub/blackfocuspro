# Premium İstatistikler Özelliği - Uygulama Detayları

## 📊 Genel Bakış

Geliştirilmiş istatistikler özelliği **ücretsiz** ve **premium** kullanıcılar için iki farklı seviyede veri gösterir.

---

## 🎯 Özellikler

### ✅ Ücretsiz Kullanıcılar (Hepsi Görebilir)

- **Bugün Kaç Dakika Odaklandı** - Günlük odak süresi
- **Toplam Kaç Dakika Odaklandı** - Tüm zamanın toplam odak süresi

### ⭐ Premium Kullanıcılar (Ek Olarak Görebilir)

- **Haftalık Toplam Odak Süresi** - Son 7 günün toplam süresi
- **Aylık Toplam Odak Süresi** - Son 30 günün toplam süresi
- **Ortalama Günlük Odak Süresi** - Tüm zamanın günlük ortalaması
- **En Uzun Streak** - Üst üste en fazla kaç gün odaklanmış

---

## 📁 Dosya Yapısı

```
src/
├── context/
│   └── AppContext.js (GÜNCELLENME - premium state ve istatistik fonksiyonları)
├── screens/
│   ├── StatisticsScreen.js (YENİ - ana istatistikler ekranı)
│   └── ProfileScreen.js (GÜNCELLENME - premium status göstergesi)
└── navigation/
    └── AppNavigator.js (GÜNCELLENME - yeni Statistics tab)
```

---

## 🔧 Teknik Detaylar

### AppContext.js - Yeni Fonksiyonlar

```javascript
// Premium status
isPremium: boolean;

// İstatistik hesaplama fonksiyonları
getTodayMinutes(); // Bugünün dakikaları
getTotalMinutes(); // Toplam dakikalar
getWeeklyMinutes(); // Haftalık dakikalar
getMonthlyMinutes(); // Aylık dakikalar
getAverageDailyMinutes(); // Günlük ortalama
togglePremium(); // Premium modunu aç/kapat
```

### StatisticsScreen.js - Yeni Ekran

**Özellikler:**

- Ücretsiz ve premium istatistikleri ayrı bölümlerde gösterir
- Premium özellikleri kilitli gösterir (ücretsiz kullanıcılarda)
- Premium'a yükseltme butonu
- Test modu (premium durumunu değiştirme)
- Modern card-based UI

**Kullanıcı Deneyimi:**

- Ücretsiz: 2 istatistik gösterilir
- Premium: 6 istatistik gösterilir
- Kilitli özelliklerin yanında 🔒 Premium etiketi

### ProfileScreen.js - Güncellemeler

- Premium/Ücretsiz üyelik durumu banner'ında gösterilir
- ✨ Premium üyelere özel styling
- Premium durumunu değiştirme butonu
- Responsive tasarım

### AppNavigator.js - Navigasyon

**Bottom Tabs Sırası:**

1. TIMER - Ana timer ekranı
2. **İSTATİSTİKLER** (YENİ) - İstatistikler ekranı
3. HISTORY - Geçmiş oturumlar
4. PROFILE - Profil ve ayarlar
5. SETTINGS - Uygulama ayarları

---

## 💾 Veri Depolama

Premium status `AsyncStorage`'de tutulur:

- **Anahtarı:** `isPremium`
- **Veri Tipi:** `boolean` (JSON format)
- **Varsayılan:** `false`

---

## 🎨 UI Bileşenleri

### StatCard Komponenti

```javascript
<StatCard title="Başlık" value={123} unit="dakika" isPremiumFeature={false} />
```

- Premium özelliklerinde otomatik olarak kilit gösterir
- Responsive değer gösterimi
- Gradient border (primary color)

### Premium Banner

- Mavi highlight (active state)
- "🔒 Premium" etiketi (locked state)
- Premium'a yükseltme CTA

---

## 🧮 Hesaplama Mantığı

### Haftalık Dakikalar

```javascript
const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 7);
// Son 7 günün oturumlarını topla
```

### Aylık Dakikalar

```javascript
const monthAgo = new Date();
monthAgo.setMonth(monthAgo.getMonth() - 1);
// Son 30 günün oturumlarını topla
```

### Ortalama Günlük

```javascript
totalMinutes / uniqueDaysWithSessions;
// Benzersiz gün sayısına böl
```

### En Uzun Streak

```javascript
// Ardışık günleri say (AppContext'de zaten var)
// En yüksek streak'i tut
```

---

## 🔐 Premium Kontrolü

**StatisticsScreen'de Premium Kontrolü:**

```javascript
<StatCard
  title="Haftalık Toplam"
  value={isPremium ? weeklyMinutes : 0}
  isPremiumFeature={true}
/>
```

- `isPremiumFeature={true}` ise kilitli gösterir
- `isPremium={false}` ise 🔒 sembolü gösterilir

---

## 🚀 Kullanım Örneği

### Component içinde:

```javascript
const { isPremium, getWeeklyMinutes, togglePremium } = useApp();

// İstatistikleri göster
const weeklyData = getWeeklyMinutes();

// Premium'a yükselt (test)
togglePremium();
```

---

## 📱 Responsive Tasarım

- **Mobile First** - Tüm cihazlarda optimize
- **Scroll Support** - ScrollView ile uzun içerik desteği
- **Touch-friendly** - Büyük dokunma alanları
- **Card-based Layout** - Modern akışkan tasarım

---

## 🎯 Gelecek Geliştirmeler

1. **Gerçek Premium Sistemi**

   - Supabase'de premium table oluştur
   - Ödeme entegrasyonu (Stripe/AppleStore)

2. **İleri Analizler**

   - Grafik gösterimi (haftalık/aylık)
   - Trend analizi
   - Hedef takibi

3. **Premium Bildirimler**
   - Aylık rapor e-postaları
   - Milestone bildirimler

---

## ✅ Test Etme Adımları

1. **İstatistikler Ekranına Git**

   - Bottom nav'da "İSTATİSTİKLER" tap'ına tıkla

2. **Ücretsiz Modu Gör**

   - 2 istatistik görülür
   - 4 istatistik kilitli olur
   - Premium CTA gösterilir

3. **Premium'a Geç**

   - "Premium'a Yükselt" butonuna tıkla
   - Tüm 6 istatistik açılacak

4. **Profil'de Göster**
   - Profil tab'ında premium status'u gör
   - Test butonu ile modu değiştir

---

## 📊 Veri Flow

```
AppContext (State)
    ↓
Statistics Functions
    ↓
StatisticsScreen (Render)
    ├─→ Free Stats (Her zaman gösterilir)
    └─→ Premium Stats (isPremium=true ise açılır)
        └─→ Upgrade CTA (isPremium=false ise)
```

---

**Hazır! İstatistikler sistemi tamamen entegre ve test edilmeye hazır. 🎉**

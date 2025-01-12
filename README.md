# Easy Quiz Bot Front-end

Easy Quiz Bot loyihasining Front-end (React) qismi bo‘lib, testlar, savollar va variantlarni qulay boshqarish imkoniyatini beradi. Loyiha asosan o‘qituvchilar (admin) uchun mo‘ljallangan bo‘lib, ular bu orqali mavzular (topics) va testlar tarkibini CRUD (Create, Read, Update, Delete) amallaridan foydalanib boshqarishlari mumkin.

## Xususiyatlar
- **Mavzularni boshqarish:** Yangi mavzular qo‘shish, mavjudlarini tahrirlash yoki o‘chirish.
- **Testlarni boshqarish:** Mavzuga doir testlarni yaratish, o‘chirish va tahrirlash.
- **Savollarni qo‘shish/tahrirlash:** Har bir testga cheksiz savollarni qo‘shish va ularning matnini yoki ballini (question_score) o‘zgartirish.
- **Variantlarni boshqarish:** Savollarga tegishli javob variantlarini qo‘shish, tahrirlash, o‘chirish va “to‘g‘ri” (isCorrect) bayroqchasini belgilash.
- **React Query orqali API chaqiriqlarini boshqarish:** Ma’lumotlarni serverdan (backend) olish va keshlash, o‘zgartirish jarayonida loading/error holatlarni ko‘rsatish.
- **Ant Design asosidagi UI:** Modal oynalar, Form, Popconfirm, notification/message kabi UI komponentlar bilan qulay dizayn.
- **React Router:** Kirish (login) sahifasi, mavzular ro‘yxati, muayyan mavzuga tegishli testlar va test detallari (savollar/variantlar) orasida yo‘naltirish.

## Texnologiyalar
- **React (TypeScript):** Asosiy UI framework.
- **React Router:** Marshrutlarni boshqarish: `/login`, `/`, `/:topicId`, `/test/:testId` va hokazo.
- **React Query:** API bilan ishlashda kesh va asinxron jarayonlarni boshqarish.
- **Ant Design:** Tayyor UI komponentlari (Modal, Button, Form, Card, va h.k.).
- **Axios:** `api.ts` orqali backend bilan aloqa (interceptor) o‘rnatish.
- **Vite:** Front-endni build qilish va local development serverni ishga tushirish.

## Boshlash (Installation)

```bash
# 1. Kodni klonlash
git clone https://github.com/username/easy-quiz-frontend.git

# 2. Loyihaga o‘tish
cd easy-quiz-frontend

# 3. Zarur bog‘lamalarni (dependecies) o‘rnatish
npm install

# 4. Muhit sozlamalarini (Environment) .env yoki .env.local faylda belgilash
# Masalan:
# VITE_BACKEND_URL=http://localhost:4040/api

# 5. Lokal serverni ishga tushirish (developer rejim)
npm run dev

# Production rejimga build qilish
npm run build
# Yakuniy build fayllari `dist` papkasida hosil bo‘ladi.
```

## Foydalanish (Usage)

1. **Login sahifasi** (`/login`) – Foydalanuvchi (admin) o‘z `chat_id` ni kiritadi. Muvaffaqiyatli login bo‘lsa, `localStorage` da `chat_id` saqlanadi.
2. **ProtectedRoute** – Asosiy sahifalar (`/` va boshqa) faqat token (`chat_id`) mavjud bo‘lsa ochiladi. Aks holda `/login` ga yo‘naltiriladi.
3. **TopicsPage (`/`)** – Mavzular ro‘yxati:
    - **Yangi mavzu qo‘shish** (`Создать тему`),
    - **Tahrirlash** (`Редактировать`) va **O‘chirish** (`Удалить`) har bir kartochkada,
    - **Zarur bo‘lsa, Load more** – sahifalab (pagination) yuklanadi.
4. **TestsPage (`/:id`)** – Tanlangan mavzuga tegishli testlar ro‘yxati:
    - **Test yaratish, tahrirlash va o‘chirish**,
    - **Savol qo‘shish** – har bir test uchun `/test/{testId}` sahifasiga yo‘naltirish.
5. **TestDetailsPage (`/test/:id`)** – Shu testning savollari va variantlarini boshqarish:
    - **Savol qo‘shish** (modal orqali),
    - Har bir savolda **Savolni tahrirlash** va **Savolni o‘chirish**.
    - **Variantlarda** (options): Matnni o‘zgartirish, `isCorrect`ni belgilash va `Удалить` tugmalari.

## Loyihaning Tuzilishi (Structure)

```plaintext
easy-quiz-frontend/
 ┣ src/
 ┃ ┣ api/           # Axios instance, so'rovlar (fetch, mutation) funktsiyalari
 ┃ ┣ components/    # Umumiy komponentlar (modals, auth, layout)
 ┃ ┣ enums/         # Enums (TestDifficultyLevelEnum va h.k.)
 ┃ ┣ interfaces/    # TypeScript interfeyslar (ITest, ITopic, IQuestion, ...)
 ┃ ┣ pages/         # Sahifalar (LoginPage, TopicsPage, TestsPage, TestDetailsPage)
 ┃ ┣ App.tsx        # Asosiy App komponenti (Routes)
 ┃ ┣ main.tsx       # Ilovani ishga tushirish nuqtasi (ReactDOM.createRoot)
 ┃ ┗ ...            # Boshqa helper yoki config fayllari
 ┣ public/
 ┣ index.html
 ┣ package.json
 ┣ tsconfig.json
 ┗ vite.config.ts
```

## Hissa qo‘shish (Contributing)

1. **Fork** qiling, branch yarating (`feature-XYZ`), o‘zgartirish kiriting va pull request yuboring.
2. Issue larni ko‘rib chiqing yoki yangilarini oching. Taklif va xatolar to‘g‘risida xabar berishdan tortinmang.


## Bog‘lanish (Contact)

- **Muallif:** Mansurov Akbar
- **Email:** akbarxon2005@gmail.com
- **Telegram:** https://t.me/mansurov_akbar

Agar savol yoki takliflar bo‘lsa, GitHub issues yoki yuqoridagi manzil orqali murojaat qilishingiz mumkin.

**Rahmat!**

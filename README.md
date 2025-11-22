# AlumniHub - קהילת בוגרים

פלטפורמה לחיבור בוגרי בתי ספר. מחזור ראשון: תיכון חדרה 2003.

## תכונות

- **פיד קהילתי** - שיתוף פוסטים, הזדמנויות ושאלות
- **אירועים** - יצירת אירועי מפגש עם RSVP
- **מדריך עסקים** - עסקים ושירותים של בוגרי המחזור
- **הודעות פרטיות** - תקשורת 1:1 בין חברים
- **פרופיל אישי** - מידע מקצועי ונטוורקינג

## התקנה

### דרישות מוקדמות

- Node.js 20+
- חשבון Supabase (לבסיס נתונים)

### שלבים

1. **התקנת חבילות**
   ```bash
   cd alumnihubnet
   npm install
   ```

2. **הגדרת משתני סביבה**
   ```bash
   cp .env.example .env
   ```

   עדכן את `.env` עם:
   - `DATABASE_URL` - כתובת ה-PostgreSQL מ-Supabase
   - `DIRECT_URL` - כתובת ישירה ל-Supabase
   - `NEXTAUTH_SECRET` - מחרוזת סודית (צור עם `openssl rand -base64 32`)

3. **הרצת מיגרציה**
   ```bash
   npx prisma db push
   ```

4. **הרצת seed**
   ```bash
   npm run db:seed
   ```

5. **הפעלת שרת פיתוח**
   ```bash
   npm run dev
   ```

   האפליקציה תרוץ ב-http://localhost:3000

## פריסה ל-Render

1. צור ריפו ב-GitHub ודחוף את הקוד
2. התחבר ל-Render וצור Web Service חדש
3. חבר לריפו ב-GitHub
4. הגדר:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. הוסף משתני סביבה ב-Render

## מבנה הפרויקט

```
alumnihubnet/
├── app/                  # Next.js App Router
│   ├── (auth)/          # עמודי התחברות/הרשמה
│   ├── (dashboard)/     # עמודים מוגנים
│   └── api/             # API routes
├── components/          # קומפוננטות React
├── lib/                 # לוגיקה עסקית
├── prisma/              # סכמת DB ו-seed
└── public/              # קבצים סטטיים
```

## טכנולוגיות

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma
- **Database**: PostgreSQL (Supabase)
- **Auth**: NextAuth.js

## רישיון

MIT

---

**כתב ויתור**: AlumniHub אינה קשורה רשמית לבית הספר. הפלטפורמה מופעלת באופן עצמאי.

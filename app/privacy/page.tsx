export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold mb-6">מדיניות פרטיות</h1>
          <p className="text-sm text-gray-500 mb-6">עודכן לאחרונה: נובמבר 2025</p>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3">1. מבוא</h2>
              <p>
                מדיניות פרטיות זו מתארת כיצד AlumniHub אוסף, משתמש ומגן על המידע האישי שלך.
                פרטיותך חשובה לנו ואנו מחויבים להגן עליה.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">2. מידע שאנו אוספים</h2>
              <p>אנו אוספים את סוגי המידע הבאים:</p>
              <ul className="list-disc pr-6 space-y-2">
                <li><strong>מידע אישי:</strong> שם, כתובת אימייל, עיר מגורים, תפקיד מקצועי</li>
                <li><strong>מידע פרופיל:</strong> תמונה, ביוגרפיה, קישורים לרשתות חברתיות</li>
                <li><strong>מידע עסקי:</strong> פרטי עסקים שתבחר לפרסם</li>
                <li><strong>תוכן:</strong> פוסטים, תגובות, הודעות שתשלח</li>
                <li><strong>מידע טכני:</strong> כתובת IP, סוג דפדפן, זמני גישה</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">3. כיצד אנו משתמשים במידע</h2>
              <p>המידע שלך משמש אותנו למטרות הבאות:</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>הפעלת השירות ואספקת הפונקציונליות</li>
                <li>יצירת קשר עמך בנוגע לחשבונך</li>
                <li>שיפור השירות והתאמתו לצרכיך</li>
                <li>שליחת עדכונים ותזכורות לאירועים</li>
                <li>מניעת הונאות והגנה על המערכת</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">4. שיתוף מידע</h2>
              <p>
                איננו מוכרים את המידע האישי שלך לצדדים שלישיים. המידע שלך עשוי להיות משותף:
              </p>
              <ul className="list-disc pr-6 space-y-2">
                <li>עם משתמשים אחרים באתר (לפי הגדרות הפרטיות שלך)</li>
                <li>עם ספקי שירות שעוזרים לנו להפעיל את האתר</li>
                <li>כאשר נדרש על פי חוק או צו בית משפט</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">5. אבטחת מידע</h2>
              <p>
                אנו נוקטים באמצעי אבטחה סבירים להגנה על המידע שלך, כולל הצפנת סיסמאות,
                שימוש ב-HTTPS, וגיבויים שוטפים. עם זאת, אין שיטת אבטחה מושלמת ולא ניתן
                להבטיח אבטחה מוחלטת.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">6. הזכויות שלך</h2>
              <p>יש לך את הזכות:</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>לגשת למידע האישי שלך</li>
                <li>לתקן מידע שגוי</li>
                <li>למחוק את החשבון והמידע שלך</li>
                <li>להתנגד לעיבוד מסוים של המידע</li>
                <li>לקבל עותק של המידע שלך</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">7. שמירת מידע</h2>
              <p>
                אנו שומרים את המידע שלך כל עוד החשבון שלך פעיל או כנדרש לספק לך שירותים.
                לאחר מחיקת החשבון, המידע יימחק תוך 30 יום, למעט מידע שנדרש לשמור על פי חוק.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">8. קטינים</h2>
              <p>
                השירות מיועד למשתמשים בני 18 ומעלה. איננו אוספים ביודעין מידע מקטינים.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">9. שינויים במדיניות</h2>
              <p>
                אנו עשויים לעדכן מדיניות זו מעת לעת. שינויים מהותיים יפורסמו באתר
                ותקבל הודעה באימייל.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">10. יצירת קשר</h2>
              <p>
                לשאלות בנוגע לפרטיות, ניתן לפנות אלינו:
                <a href="mailto:privacy@alumnihub.co.il" className="text-blue-600 hover:underline mr-1">
                  privacy@alumnihub.co.il
                </a>
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <a href="/login" className="text-blue-600 hover:underline text-sm">
              &larr; חזרה לדף ההתחברות
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

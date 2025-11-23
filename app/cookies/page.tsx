export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold mb-6">מדיניות עוגיות (Cookies)</h1>
          <p className="text-sm text-gray-500 mb-6">עודכן לאחרונה: נובמבר 2025</p>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3">1. מהן עוגיות?</h2>
              <p>
                עוגיות (Cookies) הן קבצי טקסט קטנים שנשמרים על המכשיר שלך כאשר אתה מבקר באתר.
                הן מאפשרות לאתר לזכור את ההעדפות שלך ולשפר את חוויית המשתמש.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">2. סוגי עוגיות שאנו משתמשים</h2>

              <h3 className="font-medium mt-4 mb-2">עוגיות הכרחיות</h3>
              <p>
                עוגיות אלה נדרשות לתפקוד בסיסי של האתר ולא ניתן לבטלן. הן כוללות:
              </p>
              <ul className="list-disc pr-6 space-y-1">
                <li>עוגיות אימות (שמירת מצב התחברות)</li>
                <li>עוגיות אבטחה (הגנה מפני CSRF)</li>
                <li>עוגיות הפעלה (session)</li>
              </ul>

              <h3 className="font-medium mt-4 mb-2">עוגיות פונקציונליות</h3>
              <p>
                עוגיות אלה מאפשרות לנו לזכור את ההעדפות שלך:
              </p>
              <ul className="list-disc pr-6 space-y-1">
                <li>העדפות שפה</li>
                <li>הגדרות תצוגה</li>
              </ul>

              <h3 className="font-medium mt-4 mb-2">עוגיות אנליטיות</h3>
              <p>
                עוגיות אלה עוזרות לנו להבין כיצד משתמשים באתר:
              </p>
              <ul className="list-disc pr-6 space-y-1">
                <li>מספר מבקרים</li>
                <li>דפים פופולריים</li>
                <li>זמן שהייה באתר</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">3. עוגיות צד שלישי</h2>
              <p>
                אנו עשויים להשתמש בשירותי צד שלישי שמציבים עוגיות משלהם:
              </p>
              <ul className="list-disc pr-6 space-y-2">
                <li><strong>Google Analytics</strong> - לניתוח תעבורה</li>
                <li><strong>Font Awesome</strong> - לאייקונים</li>
                <li><strong>Google Fonts</strong> - לגופנים</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">4. משך שמירת עוגיות</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-2">סוג</th>
                    <th className="text-right py-2">משך</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">עוגיות הפעלה</td>
                    <td className="py-2">עד סגירת הדפדפן</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">עוגיות אימות</td>
                    <td className="py-2">30 יום</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">עוגיות העדפות</td>
                    <td className="py-2">שנה</td>
                  </tr>
                  <tr>
                    <td className="py-2">עוגיות אנליטיות</td>
                    <td className="py-2">עד שנתיים</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">5. ניהול עוגיות</h2>
              <p>
                אתה יכול לנהל את העוגיות דרך הגדרות הדפדפן שלך. שים לב שחסימת עוגיות מסוימות
                עלולה לפגוע בתפקוד האתר.
              </p>
              <p className="mt-2">
                קישורים להגדרות דפדפנים נפוצים:
              </p>
              <ul className="list-disc pr-6 space-y-1">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Chrome</a></li>
                <li><a href="https://support.mozilla.org/he/kb/cookies" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Firefox</a></li>
                <li><a href="https://support.apple.com/he-il/guide/safari/sfri11471/mac" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Safari</a></li>
                <li><a href="https://support.microsoft.com/he-il/microsoft-edge/cookies" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Edge</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">6. עדכונים למדיניות</h2>
              <p>
                אנו עשויים לעדכן מדיניות זו מעת לעת. השינויים יפורסמו בדף זה.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">7. יצירת קשר</h2>
              <p>
                לשאלות בנוגע לעוגיות, ניתן לפנות אלינו:
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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold mb-6">תנאי שימוש</h1>
          <p className="text-sm text-gray-500 mb-6">עודכן לאחרונה: נובמבר 2025</p>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3">1. הסכמה לתנאים</h2>
              <p>
                בעצם השימוש באתר AlumniHub (להלן: "האתר" או "השירות"), אתה מסכים לתנאי השימוש הללו.
                אם אינך מסכים לתנאים אלה, אנא הימנע משימוש באתר.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">2. תיאור השירות</h2>
              <p>
                AlumniHub הוא פלטפורמה לחיבור בוגרי בתי ספר תיכון. השירות מאפשר למשתמשים ליצור פרופיל אישי,
                לשתף פוסטים, להשתתף באירועים, לפרסם עסקים ולתקשר עם בוגרים אחרים.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">3. הרשמה וחשבון משתמש</h2>
              <ul className="list-disc pr-6 space-y-2">
                <li>עליך לספק מידע מדויק ואמיתי בעת ההרשמה</li>
                <li>אתה אחראי לשמור על סודיות הסיסמה שלך</li>
                <li>אתה אחראי לכל הפעילות שמתבצעת דרך החשבון שלך</li>
                <li>עליך להיות בן 18 ומעלה לשימוש בשירות</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">4. התנהגות מקובלת</h2>
              <p>בעת השימוש בשירות, אתה מתחייב:</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>לא לפרסם תוכן פוגעני, מאיים, או מטריד</li>
                <li>לא להתחזות לאדם אחר</li>
                <li>לא לפרסם ספאם או תוכן פרסומי ללא אישור</li>
                <li>לא להפר זכויות יוצרים או קניין רוחני</li>
                <li>לכבד את פרטיות המשתמשים האחרים</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">5. תוכן משתמשים</h2>
              <p>
                אתה שומר על הבעלות על התוכן שאתה מפרסם. עם זאת, בפרסום תוכן באתר, אתה מעניק לנו רישיון
                לא בלעדי להציג, להפיץ ולשתף את התוכן במסגרת השירות.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">6. פרסום עסקים</h2>
              <p>
                משתמשים רשאים לפרסם עסקים במדריך העסקים. האחריות על נכונות המידע העסקי היא על המפרסם בלבד.
                אנו שומרים את הזכות להסיר פרסומים שאינם עומדים בתנאי השימוש.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">7. הגבלת אחריות</h2>
              <p>
                השירות מסופק "כפי שהוא" (AS IS). איננו אחראים לנזקים ישירים או עקיפים הנובעים משימוש בשירות.
                איננו אחראים לתוכן שמפרסמים משתמשים או לאיכות השירותים של עסקים המפורסמים במדריך.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">8. שינויים בתנאים</h2>
              <p>
                אנו שומרים את הזכות לעדכן תנאים אלה מעת לעת. שינויים מהותיים יפורסמו באתר ו/או יישלחו
                במייל למשתמשים רשומים.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">9. סיום שירות</h2>
              <p>
                אנו שומרים את הזכות להשעות או לסגור חשבון משתמש שמפר את תנאי השימוש,
                ללא התראה מוקדמת.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">10. יצירת קשר</h2>
              <p>
                לשאלות או בירורים בנוגע לתנאי השימוש, ניתן לפנות אלינו בכתובת:
                <a href="mailto:support@alumnihub.co.il" className="text-blue-600 hover:underline mr-1">
                  support@alumnihub.co.il
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

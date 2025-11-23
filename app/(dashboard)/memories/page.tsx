'use client';

import { useState, useEffect } from 'react';

interface Memory {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  memoryDate: string;
  author: { firstName: string; lastName: string };
  createdAt: string;
  yearsAgo: number;
}

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: '',
    content: '',
    memoryDate: '',
    imageUrl: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/memories');
      if (res.ok) {
        const data = await res.json();
        setMemories(data);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Find memories from today in previous years
  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  const onThisDayMemories = memories.filter(m => {
    const memDate = new Date(m.memoryDate);
    return memDate.getMonth() === todayMonth && memDate.getDate() === todayDay;
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        setNewMemory({ ...newMemory, imageUrl: url });
      } else {
        alert('שגיאה בהעלאת התמונה');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('שגיאה בהעלאת התמונה');
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async () => {
    if (!newMemory.title.trim() || !newMemory.content.trim() || !newMemory.memoryDate) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMemory),
      });

      if (res.ok) {
        fetchMemories();
        setShowCreateForm(false);
        setNewMemory({ title: '', content: '', memoryDate: '', imageUrl: '' });
      }
    } catch (error) {
      console.error('Error creating memory:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">טוען...</div>
      </div>
    );
  }

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">זיכרונות</h1>
          <p className="text-gray-600">היום לפני X שנים...</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <span>📸</span> שתף זיכרון
        </button>
      </div>

      {/* On This Day Section */}
      {onThisDayMemories.length > 0 && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 mb-6 text-white">
          <h2 className="text-xl font-bold mb-4">🎉 היום לפני שנים...</h2>
          <div className="space-y-4">
            {onThisDayMemories.map((memory) => (
              <div key={memory.id} className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-white/30 px-2 py-1 rounded text-sm">
                    לפני {memory.yearsAgo} שנים
                  </span>
                </div>
                <h3 className="font-semibold">{memory.title}</h3>
                <p className="text-sm opacity-90">{memory.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Memory Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
          <h3 className="font-semibold mb-4">שתפו זיכרון מהתיכון</h3>
          <input
            type="text"
            placeholder="כותרת הזיכרון"
            value={newMemory.title}
            onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
            className="w-full border rounded-lg px-4 py-2 mb-4"
          />
          <textarea
            placeholder="ספרו על הרגע הזה..."
            value={newMemory.content}
            onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
            className="w-full border rounded-lg px-4 py-2 mb-4 h-24 resize-none"
          />
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">מתי זה היה?</label>
            <input
              type="date"
              value={newMemory.memoryDate}
              onChange={(e) => setNewMemory({ ...newMemory, memoryDate: e.target.value })}
              className="border rounded-lg px-4 py-2"
              max="2003-12-31"
              min="2000-01-01"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">תמונה (אופציונלי)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="border rounded-lg px-4 py-2 w-full"
            />
            {uploading && <span className="text-sm text-gray-500">מעלה...</span>}
            {newMemory.imageUrl && (
              <img src={newMemory.imageUrl} alt="Preview" className="mt-2 h-32 object-cover rounded" />
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={submitting}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {submitting ? 'יוצר...' : 'פרסם זיכרון'}
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* Memories Timeline */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-700">כל הזיכרונות</h2>
        {memories.map((memory) => (
          <div key={memory.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {memory.imageUrl && (
              <img
                src={memory.imageUrl}
                alt={memory.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                  לפני {memory.yearsAgo} שנים
                </span>
                <span className="text-sm text-gray-500">{memory.memoryDate}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{memory.title}</h3>
              <p className="text-gray-600 mb-3">{memory.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  שותף ע"י {memory.author.firstName} {memory.author.lastName}
                </span>
                <span>{memory.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

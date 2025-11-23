'use client';

import { useState, useEffect } from 'react';

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  author: { firstName: string; lastName: string };
  createdAt: string;
  endsAt?: string;
  hasVoted: boolean;
  userVote?: string;
}

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '']);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const res = await fetch('/api/polls');
      if (res.ok) {
        const data = await res.json();
        setPolls(data);
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      const res = await fetch('/api/polls/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId, optionId }),
      });

      if (res.ok) {
        fetchPolls(); // Refresh polls to get updated vote counts
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleCreatePoll = async () => {
    if (!newQuestion.trim() || newOptions.filter(o => o.trim()).length < 2) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newQuestion,
          options: newOptions.filter(o => o.trim()),
        }),
      });

      if (res.ok) {
        fetchPolls();
        setShowCreateForm(false);
        setNewQuestion('');
        setNewOptions(['', '', '']);
      }
    } catch (error) {
      console.error('Error creating poll:', error);
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
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">סקרים וסטטיסטיקות</h1>
          <p className="text-gray-600">גלו מה חושבים חברי המחזור</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>➕</span> סקר חדש
        </button>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-3xl font-bold text-blue-600">{polls.length}</div>
          <div className="text-sm text-gray-600">סקרים פעילים</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-3xl font-bold text-green-600">
            {polls.reduce((sum, p) => sum + p.totalVotes, 0)}
          </div>
          <div className="text-sm text-gray-600">הצבעות סה"כ</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-3xl font-bold text-purple-600">
            {polls.filter(p => p.hasVoted).length}
          </div>
          <div className="text-sm text-gray-600">הצבעתי ב-</div>
        </div>
      </div>

      {/* Create Poll Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
          <h3 className="font-semibold mb-4">יצירת סקר חדש</h3>
          <input
            type="text"
            placeholder="מה השאלה שלך?"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 mb-4"
          />
          <div className="space-y-2 mb-4">
            {newOptions.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`אפשרות ${i + 1}`}
                value={opt}
                onChange={(e) => {
                  const updated = [...newOptions];
                  updated[i] = e.target.value;
                  setNewOptions(updated);
                }}
                className="w-full border rounded-lg px-4 py-2"
              />
            ))}
          </div>
          <button
            onClick={() => setNewOptions([...newOptions, ''])}
            className="text-blue-600 text-sm mb-4"
          >
            + הוסף אפשרות
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleCreatePoll}
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'יוצר...' : 'פרסם סקר'}
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

      {/* Polls List */}
      <div className="space-y-4">
        {polls.map((poll) => (
          <div key={poll.id} className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{poll.question}</h3>
                <p className="text-sm text-gray-500">
                  נוצר ע"י {poll.author.firstName} {poll.author.lastName} • {poll.createdAt}
                </p>
              </div>
              <span className="text-sm text-gray-500">{poll.totalVotes} הצבעות</span>
            </div>

            <div className="space-y-3">
              {poll.options.map((option) => (
                <div key={option.id}>
                  {poll.hasVoted ? (
                    <div className="relative">
                      <div
                        className={`h-10 rounded-lg ${
                          poll.userVote === option.id ? 'bg-blue-100' : 'bg-gray-100'
                        }`}
                        style={{ width: `${Math.max(option.percentage, 5)}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-between px-3">
                        <span className={poll.userVote === option.id ? 'font-semibold' : ''}>
                          {option.text}
                          {poll.userVote === option.id && ' ✓'}
                        </span>
                        <span className="font-semibold">{option.percentage}%</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleVote(poll.id, option.id)}
                      className="w-full text-right px-4 py-2 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      {option.text}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {poll.endsAt && (
              <p className="text-sm text-orange-600 mt-3">
                ⏰ הסקר נסגר ב-{poll.endsAt}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

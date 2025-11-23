'use client';

import { useState } from 'react';

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

// Demo data
const demoPolls: Poll[] = [
  {
    id: '1',
    question: 'איפה אתם גרים היום?',
    options: [
      { id: '1a', text: 'חדרה והסביבה', votes: 45, percentage: 36 },
      { id: '1b', text: 'תל אביב והמרכז', votes: 52, percentage: 42 },
      { id: '1c', text: 'ירושלים', votes: 12, percentage: 10 },
      { id: '1d', text: 'חו"ל', votes: 15, percentage: 12 },
    ],
    totalVotes: 124,
    author: { firstName: 'דני', lastName: 'כהן' },
    createdAt: '2025-11-20',
    hasVoted: true,
    userVote: '1b',
  },
  {
    id: '2',
    question: 'באיזה תחום אתם עובדים?',
    options: [
      { id: '2a', text: 'הייטק', votes: 38, percentage: 40 },
      { id: '2b', text: 'רפואה/בריאות', votes: 18, percentage: 19 },
      { id: '2c', text: 'חינוך', votes: 15, percentage: 16 },
      { id: '2d', text: 'עסקים/יזמות', votes: 12, percentage: 13 },
      { id: '2e', text: 'אחר', votes: 12, percentage: 12 },
    ],
    totalVotes: 95,
    author: { firstName: 'מיכל', lastName: 'לוי' },
    createdAt: '2025-11-18',
    hasVoted: false,
  },
  {
    id: '3',
    question: 'מתי נעשה מפגש מחזור הבא?',
    options: [
      { id: '3a', text: 'דצמבר 2025', votes: 28, percentage: 35 },
      { id: '3b', text: 'ינואר 2026', votes: 32, percentage: 40 },
      { id: '3c', text: 'פברואר 2026', votes: 20, percentage: 25 },
    ],
    totalVotes: 80,
    author: { firstName: 'יוסי', lastName: 'אברהם' },
    createdAt: '2025-11-15',
    endsAt: '2025-12-01',
    hasVoted: false,
  },
];

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>(demoPolls);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '']);

  const handleVote = (pollId: string, optionId: string) => {
    setPolls(polls.map(poll => {
      if (poll.id === pollId && !poll.hasVoted) {
        const newTotal = poll.totalVotes + 1;
        return {
          ...poll,
          hasVoted: true,
          userVote: optionId,
          totalVotes: newTotal,
          options: poll.options.map(opt => {
            const newVotes = opt.id === optionId ? opt.votes + 1 : opt.votes;
            return {
              ...opt,
              votes: newVotes,
              percentage: Math.round((newVotes / newTotal) * 100),
            };
          }),
        };
      }
      return poll;
    }));
  };

  const handleCreatePoll = () => {
    if (!newQuestion.trim() || newOptions.filter(o => o.trim()).length < 2) return;

    const validOptions = newOptions.filter(o => o.trim());
    const newPoll: Poll = {
      id: Date.now().toString(),
      question: newQuestion,
      options: validOptions.map((text, i) => ({
        id: `new-${i}`,
        text,
        votes: 0,
        percentage: 0,
      })),
      totalVotes: 0,
      author: { firstName: 'אני', lastName: '' },
      createdAt: new Date().toISOString().split('T')[0],
      hasVoted: false,
    };

    setPolls([newPoll, ...polls]);
    setShowCreateForm(false);
    setNewQuestion('');
    setNewOptions(['', '', '']);
  };

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
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              פרסם סקר
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

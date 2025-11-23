'use client';

import { useState, useEffect } from 'react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'freelance' | 'internship';
  description: string;
  salary?: string;
  contactEmail?: string;
  contactPhone?: string;
  poster: { firstName: string; lastName: string };
  createdAt: string;
  isActive: boolean;
}

const typeLabels: Record<string, string> = {
  'full-time': 'משרה מלאה',
  'part-time': 'משרה חלקית',
  'freelance': 'פרילנס',
  'internship': 'התמחות',
};

const typeColors: Record<string, string> = {
  'full-time': 'bg-green-100 text-green-700',
  'part-time': 'bg-blue-100 text-blue-700',
  'freelance': 'bg-purple-100 text-purple-700',
  'internship': 'bg-orange-100 text-orange-700',
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [submitting, setSubmitting] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time' as const,
    description: '',
    salary: '',
    contactEmail: '',
    contactPhone: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = filterType === 'all'
    ? jobs
    : jobs.filter(j => j.type === filterType);

  const handleCreate = async () => {
    if (!newJob.title.trim() || !newJob.company.trim() || !newJob.description.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });

      if (res.ok) {
        fetchJobs();
        setShowCreateForm(false);
        setNewJob({
          title: '',
          company: '',
          location: '',
          type: 'full-time',
          description: '',
          salary: '',
          contactEmail: '',
          contactPhone: '',
        });
      }
    } catch (error) {
      console.error('Error creating job:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">לוח דרושים</h1>
          <p className="text-gray-600">משרות מחברי המחזור, לחברי המחזור</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <span>💼</span> פרסם משרה
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600">{jobs.filter(j => j.type === 'full-time').length}</div>
          <div className="text-xs text-gray-600">משרות מלאות</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">{jobs.filter(j => j.type === 'part-time').length}</div>
          <div className="text-xs text-gray-600">משרות חלקיות</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
          <div className="text-2xl font-bold text-purple-600">{jobs.filter(j => j.type === 'freelance').length}</div>
          <div className="text-xs text-gray-600">פרילנס</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
          <div className="text-2xl font-bold text-orange-600">{jobs.filter(j => j.type === 'internship').length}</div>
          <div className="text-xs text-gray-600">התמחויות</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg text-sm ${filterType === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          הכל ({jobs.length})
        </button>
        {Object.entries(typeLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterType(key)}
            className={`px-4 py-2 rounded-lg text-sm ${filterType === key ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Create Job Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
          <h3 className="font-semibold mb-4">פרסום משרה חדשה</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="כותרת המשרה *"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="text"
              placeholder="שם החברה *"
              value={newJob.company}
              onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="text"
              placeholder="מיקום"
              value={newJob.location}
              onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <select
              value={newJob.type}
              onChange={(e) => setNewJob({ ...newJob, type: e.target.value as any })}
              className="border rounded-lg px-4 py-2"
            >
              {Object.entries(typeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="שכר (אופציונלי)"
              value={newJob.salary}
              onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="email"
              placeholder="אימייל ליצירת קשר"
              value={newJob.contactEmail}
              onChange={(e) => setNewJob({ ...newJob, contactEmail: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
          </div>
          <textarea
            placeholder="תיאור המשרה *"
            value={newJob.description}
            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
            className="w-full border rounded-lg px-4 py-2 mb-4 h-24 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={submitting}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'יוצר...' : 'פרסם משרה'}
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

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedJob(job)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[job.type]}`}>
                {typeLabels[job.type]}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
              {job.location && (
                <span className="flex items-center gap-1">
                  📍 {job.location}
                </span>
              )}
              {job.salary && (
                <span className="flex items-center gap-1">
                  💰 {job.salary}
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-sm text-gray-500">
                פורסם ע"י {job.poster.firstName} {job.poster.lastName}
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                צפה בפרטים →
              </button>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">💼</p>
            <p>אין משרות בקטגוריה זו כרגע</p>
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedJob(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-l from-green-500 to-emerald-600 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                  <p className="text-white/90 text-lg">{selectedJob.company}</p>
                </div>
                <button onClick={() => setSelectedJob(null)} className="text-white/80 hover:text-white text-2xl">
                  ×
                </button>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {typeLabels[selectedJob.type]}
                </span>
                {selectedJob.location && (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    📍 {selectedJob.location}
                  </span>
                )}
                {selectedJob.salary && (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    💰 {selectedJob.salary}
                  </span>
                )}
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-semibold mb-3">תיאור המשרה</h3>
              <p className="text-gray-700 whitespace-pre-wrap mb-6">{selectedJob.description}</p>

              <h3 className="font-semibold mb-3">יצירת קשר</h3>
              <div className="space-y-2">
                {selectedJob.contactEmail && (
                  <a
                    href={`mailto:${selectedJob.contactEmail}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <i className="fas fa-envelope"></i>
                    {selectedJob.contactEmail}
                  </a>
                )}
                {selectedJob.contactPhone && (
                  <a
                    href={`tel:${selectedJob.contactPhone}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <i className="fas fa-phone"></i>
                    <span dir="ltr">{selectedJob.contactPhone}</span>
                  </a>
                )}
              </div>

              <div className="mt-6 pt-4 border-t text-sm text-gray-500">
                פורסם ע"י {selectedJob.poster.firstName} {selectedJob.poster.lastName} • {selectedJob.createdAt}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

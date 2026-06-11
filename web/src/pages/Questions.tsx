/** Question Bank page — matching Stitch screen A2. */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  qid: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  preview: string;
  status: 'ENCRYPTED' | 'DRAFT' | 'FLAGGED';
  created: string;
}

const subjectColors: Record<string, { bg: string; text: string }> = {
  Physics: { bg: 'bg-blue-100', text: 'text-blue-800' },
  Chemistry: { bg: 'bg-amber-100', text: 'text-amber-800' },
  Biology: { bg: 'bg-green-100', text: 'text-green-800' },
};

const difficultyColors: Record<string, { bg: string; text: string; border: string }> = {
  Easy: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  Medium: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
  Hard: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
};

// Demo data matching the stitch wireframe
const demoQuestions: Question[] = [
  { id: '1', qid: 'PHY-8402', subject: 'Physics', difficulty: 'Hard', preview: 'A particle of mass m is projected with velocity v...', status: 'ENCRYPTED', created: '2023-10-24' },
  { id: '2', qid: 'BIO-9123', subject: 'Biology', difficulty: 'Easy', preview: 'Which of the following cellular organelles is resp...', status: 'DRAFT', created: '2023-10-23' },
  { id: '3', qid: 'CHE-7451', subject: 'Chemistry', difficulty: 'Medium', preview: 'Calculate the pH of a 0.1 M solution of acetic aci...', status: 'ENCRYPTED', created: '2023-10-23' },
  { id: '4', qid: 'PHY-8405', subject: 'Physics', difficulty: 'Medium', preview: "In a Young's double slit experiment, the distance...", status: 'ENCRYPTED', created: '2023-10-22' },
  { id: '5', qid: 'BIO-9128', subject: 'Biology', difficulty: 'Hard', preview: 'Explain the mechanism of countercurrent multiplier...', status: 'DRAFT', created: '2023-10-22' },
  { id: '6', qid: 'CHE-7459', subject: 'Chemistry', difficulty: 'Easy', preview: 'Identify the IUPAC name for the given organic comp...', status: 'ENCRYPTED', created: '2023-10-21' },
];

export default function Questions() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [questions] = useState<Question[]>(demoQuestions);

  const filtered = questions.filter((q) => {
    if (searchQuery && !q.preview.toLowerCase().includes(searchQuery.toLowerCase()) && !q.qid.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (subjectFilter && q.subject !== subjectFilter) return false;
    if (difficultyFilter && q.difficulty !== difficultyFilter) return false;
    if (statusFilter && q.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="flex gap-0 h-[calc(100vh-64px-48px)]">
      {/* Left: Table area */}
      <div className="flex-1 overflow-y-auto pr-0">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="flex items-center text-on-surface-variant font-micro text-micro mb-2">
            <a className="hover:text-primary cursor-pointer" onClick={() => navigate('/')}>Home</a>
            <span className="material-symbols-outlined text-[14px] mx-1">chevron_right</span>
            <span className="text-primary font-medium">Question Bank</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-page-title text-page-title font-bold text-on-surface">Question Bank</h2>
              <p className="font-body text-body text-on-surface-variant mt-1">{filtered.length.toLocaleString()} Questions</p>
            </div>
            <button
              onClick={() => navigate('/questions/new')}
              className="bg-[#1E40AF] text-white px-4 py-2 rounded font-label-medium text-label-medium hover:bg-primary transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Question
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input
              className="w-full pl-9 pr-3 py-1.5 bg-surface border border-outline-variant rounded focus:border-[#1E40AF] focus:ring-0 font-body text-body"
              placeholder="Search questions..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="py-1.5 pl-3 pr-8 bg-surface border border-outline-variant rounded focus:border-[#1E40AF] focus:ring-0 font-body text-body text-on-surface"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="">All Subjects</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
          </select>
          <select
            className="py-1.5 pl-3 pr-8 bg-surface border border-outline-variant rounded focus:border-[#1E40AF] focus:ring-0 font-body text-body text-on-surface"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select
            className="py-1.5 pl-3 pr-8 bg-surface border border-outline-variant rounded focus:border-[#1E40AF] focus:ring-0 font-body text-body text-on-surface"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="ENCRYPTED">Encrypted</option>
            <option value="DRAFT">Draft</option>
            <option value="FLAGGED">Flagged</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1E293B] text-white">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input className="rounded border-outline-variant bg-transparent text-[#1E40AF] focus:ring-0" type="checkbox" />
                </th>
                <th className="p-3 font-section-header text-section-header">Q.ID</th>
                <th className="p-3 font-section-header text-section-header">Subject</th>
                <th className="p-3 font-section-header text-section-header">Difficulty</th>
                <th className="p-3 font-section-header text-section-header w-1/3">Question Preview</th>
                <th className="p-3 font-section-header text-section-header">Status</th>
                <th className="p-3 font-section-header text-section-header">Created</th>
                <th className="p-3 font-section-header text-section-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body text-body text-on-surface">
              {filtered.map((q, idx) => (
                <tr
                  key={q.id}
                  className={`border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors ${idx % 2 === 1 ? 'bg-[#F8FAFC]' : ''}`}
                >
                  <td className="p-3 text-center">
                    <input className="rounded border-outline-variant text-[#1E40AF] focus:ring-0" type="checkbox" />
                  </td>
                  <td className="p-3 font-medium">{q.qid}</td>
                  <td className="p-3">
                    <span className={`${subjectColors[q.subject]?.bg} ${subjectColors[q.subject]?.text} px-2 py-0.5 rounded text-[11px] font-medium`}>
                      {q.subject}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`${difficultyColors[q.difficulty]?.bg} ${difficultyColors[q.difficulty]?.text} ${difficultyColors[q.difficulty]?.border} px-2 py-0.5 rounded-full text-[11px] font-medium border`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="p-3 truncate max-w-[200px]" title={q.preview}>
                    <span className="text-on-surface-variant">{q.preview}</span>
                  </td>
                  <td className="p-3">
                    {q.status === 'ENCRYPTED' ? (
                      <div className="flex items-center gap-1 text-green-700">
                        <span className="material-symbols-outlined text-[16px]">lock</span>
                        <span className="text-[11px] font-bold">ENCRYPTED</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">draft</span>
                        <span className="text-[11px] font-bold">DRAFT</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-on-surface-variant text-[12px]">{q.created}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => navigate(`/questions/${q.id}/edit`)}
                      className="text-on-surface-variant hover:text-[#1E40AF] mr-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button className="text-on-surface-variant hover:text-red-600">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Sidebar (Stats) */}
      <aside className="w-[320px] border-l border-outline-variant bg-surface-container-lowest pl-container-padding overflow-y-auto flex-shrink-0 ml-gutter">
        <h3 className="font-section-header text-section-header text-on-surface mb-6 mt-2">Database Statistics</h3>

        {/* Donut Chart Placeholder */}
        <div className="mb-8">
          <div className="text-label-medium font-label-medium text-on-surface-variant mb-4">Subject Distribution</div>
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
              <circle cx="80" cy="80" r="60" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="143.26 237.1" strokeDashoffset="0" />
              <circle cx="80" cy="80" r="60" fill="none" stroke="#f59e0b" strokeWidth="20" strokeDasharray="116.87 237.1" strokeDashoffset="-143.26" />
              <circle cx="80" cy="80" r="60" fill="none" stroke="#22c55e" strokeWidth="20" strokeDasharray="116.87 237.1" strokeDashoffset="-260.13" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="font-bold text-lg text-on-surface">3.8k</span>
              <span className="text-[10px] text-on-surface-variant">Total</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-body font-body text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-500"></div>Physics</div>
              <span className="font-medium text-on-surface">38%</span>
            </div>
            <div className="flex justify-between items-center text-body font-body text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-amber-500"></div>Chemistry</div>
              <span className="font-medium text-on-surface">31%</span>
            </div>
            <div className="flex justify-between items-center text-body font-body text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-green-500"></div>Biology</div>
              <span className="font-medium text-on-surface">31%</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-outline-variant/50 w-full my-6"></div>

        {/* Difficulty Breakdown */}
        <div className="mb-8">
          <div className="text-label-medium font-label-medium text-on-surface-variant mb-4">Difficulty Spread</div>
          <div className="h-4 w-full bg-surface-container rounded-full flex overflow-hidden mb-4">
            <div className="bg-green-500 h-full" style={{ width: '45%' }}></div>
            <div className="bg-amber-500 h-full" style={{ width: '35%' }}></div>
            <div className="bg-red-500 h-full" style={{ width: '20%' }}></div>
          </div>
          <div className="flex justify-between text-micro font-micro text-on-surface-variant">
            <span>Easy (45%)</span>
            <span>Med (35%)</span>
            <span>Hard (20%)</span>
          </div>
        </div>

        <div className="h-px bg-outline-variant/50 w-full my-6"></div>

        {/* Security Status */}
        <div>
          <div className="text-label-medium font-label-medium text-on-surface-variant mb-4">Security Status</div>
          <div className="bg-green-50 border border-green-200 rounded p-3 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-800">
              <span className="material-symbols-outlined text-[20px]">lock</span>
              <span className="font-body text-body font-medium">Encrypted</span>
            </div>
            <span className="font-bold text-green-900">3,612</span>
          </div>
          <div className="bg-surface border border-outline-variant rounded p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
              <span className="font-body text-body font-medium">Pending Review</span>
            </div>
            <span className="font-bold text-on-surface">235</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

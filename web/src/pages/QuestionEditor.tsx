/** Question Editor page — matching Stitch screen A3. */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface OptionData {
  label: string;
  value: string;
  isCorrect: boolean;
}

export default function QuestionEditor() {
  const navigate = useNavigate();
  const [questionBody, setQuestionBody] = useState(
    'A point charge q is placed at the center of a spherical conducting shell of inner radius R₁ and outer radius R₂. The shell has a net charge of Q. Determine the electric field E in the region r > R₂.'
  );
  const [subject, setSubject] = useState('Physics');
  const [topic, setTopic] = useState('Mendelian Genetics');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [marks, setMarks] = useState(4);
  const [negativeMarks, setNegativeMarks] = useState(-1);
  const [tags, setTags] = useState(['Core Syllabus', 'Numerical']);
  const [options, setOptions] = useState<OptionData[]>([
    { label: 'A', value: 'E = (q + Q) / (4πε₀r²)', isCorrect: false },
    { label: 'B', value: 'E = (q) / (4πε₀r²)', isCorrect: true },
    { label: 'C', value: 'E = (Q) / (4πε₀r²)', isCorrect: false },
    { label: 'D', value: 'E = 0', isCorrect: false },
  ]);
  const [saving, setSaving] = useState(false);

  const handleCorrectChange = (idx: number) => {
    setOptions(options.map((o, i) => ({ ...o, isCorrect: i === idx })));
  };

  const handleOptionChange = (idx: number, value: string) => {
    setOptions(options.map((o, i) => i === idx ? { ...o, value } : o));
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = async (_encrypt: boolean) => {
    setSaving(true);
    // TODO: Wire to api.createQuestion / api.updateQuestion
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    navigate('/questions');
  };

  const sha256Hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  return (
    <div className="overflow-y-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-on-surface-variant font-medium mb-6">
        <a className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/')}>Home</a>
        <span className="material-symbols-outlined text-[16px] mx-2">chevron_right</span>
        <a className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/questions')}>Question Bank</a>
        <span className="material-symbols-outlined text-[16px] mx-2">chevron_right</span>
        <span className="text-on-surface">Edit Question</span>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-gutter">
        {/* Left Column (60%) */}
        <div className="col-span-12 lg:col-span-7 space-y-gutter">
          {/* Question Body Section */}
          <section className="bg-white rounded-lg border border-surface-variant flex flex-col">
            <div className="p-4 border-b border-surface-variant bg-surface-container-lowest rounded-t-lg">
              <h2 className="font-section-header text-section-header text-on-surface flex items-center">
                <span className="material-symbols-outlined mr-2 text-[18px]">edit</span>
                Question Body
              </h2>
            </div>
            <div className="p-4">
              {/* Toolbar */}
              <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-surface-variant text-on-surface-variant">
                <button className="p-1 hover:bg-surface-container-low rounded"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
                <button className="p-1 hover:bg-surface-container-low rounded"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                <button className="p-1 hover:bg-surface-container-low rounded"><span className="material-symbols-outlined text-[18px]">format_underlined</span></button>
                <div className="w-px h-4 bg-outline-variant mx-2"></div>
                <button className="p-1 hover:bg-surface-container-low rounded"><span className="material-symbols-outlined text-[18px]">functions</span></button>
                <button className="p-1 hover:bg-surface-container-low rounded"><span className="material-symbols-outlined text-[18px]">image</span></button>
              </div>
              {/* Editor */}
              <textarea
                className="w-full min-h-[200px] font-body text-body text-on-surface leading-relaxed focus:outline-none border-0 resize-none bg-transparent"
                value={questionBody}
                onChange={(e) => setQuestionBody(e.target.value)}
              />
            </div>
          </section>

          {/* Security Status Bar */}
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-3 flex items-center text-[#B45309]">
            <span className="material-symbols-outlined mr-3">lock_open</span>
            <span className="font-label-medium text-label-medium">🔓 PLAINTEXT — Question will be encrypted with AES-256-GCM on save</span>
          </div>

          {/* Answer Options */}
          <section className="bg-white rounded-lg border border-surface-variant flex flex-col">
            <div className="p-4 border-b border-surface-variant bg-surface-container-lowest rounded-t-lg">
              <h2 className="font-section-header text-section-header text-on-surface flex items-center">
                <span className="material-symbols-outlined mr-2 text-[18px]">checklist</span>
                Answer Options
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {options.map((opt, idx) => (
                <div
                  key={opt.label}
                  className={`flex items-center space-x-3 p-3 rounded border ${
                    opt.isCorrect
                      ? 'border-[#10B981] bg-[#ECFDF5]'
                      : 'border-surface-variant bg-surface-bright'
                  }`}
                >
                  <input
                    className={`w-4 h-4 ${opt.isCorrect ? 'text-[#10B981] focus:ring-[#10B981]' : 'text-primary-container focus:ring-primary-container'}`}
                    name="correct_answer"
                    type="radio"
                    checked={opt.isCorrect}
                    onChange={() => handleCorrectChange(idx)}
                  />
                  <span className={`font-label-medium text-label-medium w-6 text-center rounded p-1 ${
                    opt.isCorrect ? 'text-white bg-[#10B981]' : 'text-on-surface-variant bg-surface-container'
                  }`}>
                    {opt.label}
                  </span>
                  <input
                    className={`flex-1 border-0 bg-transparent focus:ring-0 font-body text-body text-on-surface ${opt.isCorrect ? 'font-medium' : ''}`}
                    type="text"
                    value={opt.value}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                  />
                  {opt.isCorrect && (
                    <span className="material-symbols-outlined text-[#10B981]">check_circle</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* AI Normalizer */}
          <section className="bg-[#FAF5FF] rounded-lg border border-[#D8B4FE] flex items-center justify-between p-4">
            <div className="flex items-start space-x-4">
              <div className="bg-[#7C3AED] text-white p-2 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              </div>
              <div>
                <h3 className="font-section-header text-section-header text-[#4C1D95] flex items-center">
                  Linguistic Fingerprint Removal
                  <span className="ml-2 bg-[#7C3AED] text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">AI</span>
                </h3>
                <p className="font-body text-body text-[#6B21A8] mt-1 text-sm">Neutralize phrasing to prevent author identification and standardize tone.</p>
              </div>
            </div>
            <button className="bg-[#7C3AED] text-white px-4 py-2 rounded font-label-medium text-label-medium hover:bg-[#6D28D9] transition-colors flex items-center">
              Normalize Question
            </button>
          </section>
        </div>

        {/* Right Column (40%) */}
        <div className="col-span-12 lg:col-span-5 space-y-gutter">
          {/* Metadata Card */}
          <section className="bg-white rounded-lg border border-surface-variant flex flex-col">
            <div className="p-4 border-b border-surface-variant bg-surface-container-lowest rounded-t-lg">
              <h2 className="font-section-header text-section-header text-on-surface flex items-center">
                <span className="material-symbols-outlined mr-2 text-[18px]">label</span>
                Metadata
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-medium text-label-medium text-on-surface-variant mb-1">Subject</label>
                  <select
                    className="w-full border border-surface-variant rounded bg-surface-bright px-3 py-2 font-body text-body focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none text-on-surface"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option>Physics</option>
                    <option>Biology</option>
                    <option>Chemistry</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-medium text-label-medium text-on-surface-variant mb-1">Topic</label>
                  <input
                    className="w-full border border-surface-variant rounded bg-surface-bright px-3 py-2 font-body text-body focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none text-on-surface"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
              </div>

              {/* Difficulty Selector */}
              <div>
                <label className="block font-label-medium text-label-medium text-on-surface-variant mb-1">Difficulty</label>
                <div className="flex space-x-2">
                  {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-1.5 rounded font-label-medium text-label-medium ${
                        difficulty === d
                          ? 'border-2 border-primary-container bg-primary-fixed text-primary-container font-bold'
                          : 'border border-surface-variant bg-surface-bright text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Marks */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-medium text-label-medium text-on-surface-variant mb-1">Marks</label>
                  <input
                    className="w-full border border-surface-variant rounded bg-surface-bright px-3 py-2 font-body text-body focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none text-on-surface"
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block font-label-medium text-label-medium text-on-surface-variant mb-1">Negative Marks</label>
                  <input
                    className="w-full border border-surface-variant rounded bg-surface-bright px-3 py-2 font-body text-body focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none text-error"
                    type="number"
                    value={negativeMarks}
                    onChange={(e) => setNegativeMarks(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block font-label-medium text-label-medium text-on-surface-variant mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant border border-surface-variant">
                      {tag}
                      <button className="ml-1.5 hover:text-on-surface" onClick={() => removeTag(tag)}>
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </span>
                  ))}
                  <button className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-dashed border-outline text-outline hover:bg-surface-container">
                    <span className="material-symbols-outlined text-[14px] mr-1">add</span>Add Tag
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SHA-256 Hash Card */}
          <section className="bg-white rounded-lg border border-surface-variant p-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-section-header text-section-header text-on-surface flex items-center">
                <span className="material-symbols-outlined mr-2 text-[18px] text-[#10B981]">verified_user</span>
                SHA-256 Hash
              </h2>
              <span className="bg-[#ECFDF5] text-[#10B981] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border border-[#10B981]">VERIFIED</span>
            </div>
            <div className="flex items-center bg-surface-container-low rounded border border-surface-variant p-2">
              <code className="font-mono text-xs text-outline flex-1 truncate select-all">{sha256Hash}</code>
              <button className="ml-2 text-on-surface-variant hover:text-primary transition-colors p-1" title="Copy Hash">
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>
          </section>

          {/* Preview Card */}
          <section className="bg-white rounded-lg border border-surface-variant flex flex-col overflow-hidden">
            <div className="p-3 border-b border-surface-variant bg-surface-container-lowest flex justify-between items-center">
              <h2 className="font-section-header text-section-header text-on-surface flex items-center">
                <span className="material-symbols-outlined mr-2 text-[18px]">preview</span>
                Preview (Candidate View)
              </h2>
              <button className="text-primary hover:bg-primary-fixed rounded p-1 transition-colors">
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </button>
            </div>
            <div className="p-5 bg-[#F8FAFC] font-body text-body text-on-surface select-none">
              <p className="mb-4">{questionBody}</p>
              <ol className="space-y-2 list-[upper-alpha] list-inside ml-2">
                {options.map((opt) => (
                  <li key={opt.label} className="p-2 border border-transparent hover:border-surface-variant rounded cursor-pointer transition-colors">
                    {opt.value}
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Save Actions */}
          <section className="bg-white rounded-lg border border-surface-variant p-4 flex justify-end space-x-3">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-2 border border-primary-container text-primary-container rounded font-label-medium text-label-medium hover:bg-primary-fixed transition-colors font-medium"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-4 py-2 bg-primary-container text-white rounded font-label-medium text-label-medium hover:bg-primary transition-colors flex items-center font-medium"
            >
              <span className="material-symbols-outlined mr-2 text-[18px]">lock</span>
              {saving ? 'Encrypting...' : 'Save and Encrypt'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

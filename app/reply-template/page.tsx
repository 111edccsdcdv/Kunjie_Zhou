"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface SavedTemplate {
  question: string;
  suggestion: string;
}

export default function ReplyTemplatePage() {
  const [parentQuestion, setParentQuestion] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Load templates from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('replyTemplates');
      if (saved) {
        try {
          setSavedTemplates(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse saved templates from localStorage", e);
          // Optionally clear invalid data
          // localStorage.removeItem('replyTemplates');
        }
      }
    }
  }, []);

  // Save templates to localStorage whenever savedTemplates changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('replyTemplates', JSON.stringify(savedTemplates));
    }
  }, [savedTemplates]);

  const getAiSuggestion = async () => {
    if (!parentQuestion.trim()) {
      setError("请输入家长提问内容。");
      return;
    }

    setLoading(true);
    setError(null);
    setAiSuggestion("");

    try {
      const res = await fetch("/api/llm-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "你是一个小学教师家校沟通助手的AI，专门为教师提供回复家长提问的建议，建议内容需要专业、友好、清晰。" },
            { role: "user", content: `请根据以下家长提问，为小学教师提供回复建议：\n\n家长提问：${parentQuestion}` }
          ]
        }),
      });

      if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
      }

      const data = await res.json();
      const aiContent = data.choices?.[0]?.message?.content || "AI暂无回复。";
      setAiSuggestion(aiContent);

    } catch (e: any) {
      console.error("获取AI建议失败:", e);
      setError(`获取AI建议失败: ${e.message}`);
    }

    setLoading(false);
  };

  const saveTemplate = () => {
    if (parentQuestion.trim() && aiSuggestion.trim()) {
      const newTemplate = {
        question: parentQuestion.trim(),
        suggestion: aiSuggestion.trim(),
      };
      // Prevent saving duplicates based on suggestion content
      if (!savedTemplates.some(template => template.suggestion === newTemplate.suggestion)) {
        setSavedTemplates([...savedTemplates, newTemplate]);
        console.log("模板已保存:", newTemplate);
      }
    }
  };

  // Handle copying a template to clipboard
  const handleCopyTemplate = (templateContent: string) => {
    navigator.clipboard.writeText(templateContent);
    // Optional: Add a visual confirmation that the template is copied
    console.log("模板已复制:", templateContent);
  };

  // Handle deleting a template
  const handleDeleteTemplate = (indexToDelete: number) => {
    setSavedTemplates(savedTemplates.filter((_, index) => index !== indexToDelete));
    // If the deleted template was expanded, close it
    if (expandedIndex === indexToDelete) {
        setExpandedIndex(null);
    } else if (expandedIndex !== null && indexToDelete < expandedIndex) {
        // If a template before the expanded one is deleted, adjust the expandedIndex
        setExpandedIndex(expandedIndex - 1);
    }
    console.log("模板已删除 (索引: ", indexToDelete, ")");
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center relative overflow-x-hidden bg-white"
      style={{
        background: 'radial-gradient(circle at 30% 40%, rgba(182, 214, 255, 0.7) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(232, 230, 255, 0.7) 0%, transparent 50%), white',
      }}
    >
      {/* 顶部导航栏 */}
      <nav className="relative z-10 flex items-center justify-between bg-white/40 backdrop-blur-2xl border-b border-blue-100 px-8 py-4 mt-6 mb-8 shadow-lg rounded-[2.5rem] min-h-[72px] ring-2 ring-white/40 max-w-7xl w-full mx-auto" style={{boxShadow:'0 4px 32px 0 rgba(31,38,135,0.18),0 0 24px 2px #fff6,0 0 0 2px #fff4 inset',backdropFilter:'blur(24px)'}}>
        {/* 左侧logo */}
        <div className="flex items-center gap-2">
          {/* 扁平AI助教logo SVG */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="8" width="24" height="16" rx="8" fill="#4F8CFF"/>
            <ellipse cx="12" cy="16" rx="2.5" ry="3" fill="#fff"/>
            <ellipse cx="20" cy="16" rx="2.5" ry="3" fill="#fff"/>
            <rect x="13.5" y="21" width="5" height="2" rx="1" fill="#fff"/>
            <circle cx="16" cy="16" r="15" stroke="#4F8CFF" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        {/* 标题居中 */}
        <span
          className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-blue-900 tracking-wide select-none drop-shadow text-center"
          style={{
            fontFamily: `'Smiley Sans', 'Noto Sans Rounded SC', 'Noto Sans SC', 'Microsoft YaHei', 'sans-serif'`,
            letterSpacing: 1,
            fontWeight: 700
          }}
        >
          AI家校沟通助手
        </span>
        {/* 右侧菜单 */}
        <div className="flex items-center gap-4 text-gray-700">
          <Link href="/" className="hover:text-blue-500 transition">主页</Link>
          <Link href="/UserGuide" className="hover:text-blue-500 transition">使用指引</Link>
          <Link href="/settings" className="hover:text-blue-500 transition">设置</Link>
          <div className="relative group">
            <Image src="/avatar-girl.png" alt="avatar" width={36} height={36} className="rounded-full border border-blue-200 bg-blue-100 cursor-pointer" />
            <div className="absolute right-0 mt-2 w-28 bg-white/90 rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50">退出登录</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">回复模板管理</h1>

      {/* 主体内容区域 */}
      <main className="relative z-10 flex flex-col md:flex-row gap-8 max-w-6xl mx-auto py-6 px-4 w-full">
        {/* Left Column: Input and AI Suggestion */}
        <div className="flex-1 flex flex-col gap-8">
          {/* 家长提问输入区域 */}
          <section className="w-full bg-white/70 backdrop-blur-2xl rounded-2xl shadow-lg border border-blue-100 p-6">
              <h2 className="text-xl font-bold text-blue-800 mb-4">输入家长提问</h2>
              <textarea
                  className="w-full border border-blue-100 rounded-lg px-3 py-2 min-h-[100px] bg-white/40 focus:outline-blue-300 shadow-inner text-gray-900 placeholder-gray-500 resize-y"
                  placeholder="请在此粘贴或输入家长的问题..."
                  value={parentQuestion}
                  onChange={(e) => setParentQuestion(e.target.value)}
                  disabled={loading}
              ></textarea>
              <button
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={getAiSuggestion}
                  disabled={loading || !parentQuestion.trim()}
              >
                  {loading ? '获取建议中...' : '获取AI回复建议'}
              </button>
               {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </section>

          {/* AI回复建议区域 */}
          <section className="w-full bg-white/70 backdrop-blur-2xl rounded-2xl shadow-lg border border-blue-100 p-6 flex-1"> {/* Added flex-1 to make it fill remaining height */}
              <h2 className="text-xl font-bold text-blue-800 mb-4">AI回复建议</h2>
              {aiSuggestion ? (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-inner whitespace-pre-line text-gray-900 text-sm flex-1 overflow-y-auto"> {/* Added flex-1 and overflow-y-auto */}
                      {aiSuggestion}
                      <div className="mt-4 flex justify-end">
                          <button
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={saveTemplate}
                              disabled={loading || !aiSuggestion.trim() || savedTemplates.some(template => template.suggestion === aiSuggestion.trim())}
                          >
                              {savedTemplates.some(template => template.suggestion === aiSuggestion.trim()) ? '已保存' : '保存为模板'}
                          </button>
                      </div>
                  </div>
              ) : (
                  <p className="text-gray-600 text-sm">AI生成的回复建议将在此显示。</p>
              )}
          </section>
        </div>

        {/* Right Column: Saved Templates List */}
        <div className="flex-1 flex flex-col">
          {/* 已保存模板列表区域 */}
          <section className="w-full bg-white/70 backdrop-blur-2xl rounded-2xl shadow-lg border border-blue-100 p-6 flex-1 overflow-y-auto"> {/* Added flex-1 and overflow-y-auto */}
              <h2 className="text-xl font-bold text-blue-800 mb-4">已保存的回复模板 ({savedTemplates.length})</h2>
              {savedTemplates.length > 0 ? (
                  <div className="flex flex-col gap-4"> {/* Removed overflow-y-auto and flex-1 here, handled by parent section */}
                      {savedTemplates.map((template, index) => (
                          <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-blue-100 cursor-pointer transition hover:shadow-md" onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}>
                              {expandedIndex === index ? (
                                  <div className="whitespace-pre-line text-gray-900 text-sm mb-2">{template.suggestion}</div>
                              ) : (
                                  <div className="text-gray-900 text-sm font-medium mb-2">{template.question && typeof template.question === 'string' ? `关于${template.question.split('\n')[0] || '无标题提问'}的回复` : '无效模板数据'}</div>
                              )}
                              <div className="flex justify-end gap-2 text-xs">
                                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition" onClick={(e) => { e.stopPropagation(); handleCopyTemplate(template.suggestion); }}>复制</button>
                                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition" onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(index); }}>删除</button>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <p className="text-gray-600 text-sm">还没有保存的回复模板。</p>
              )}
          </section>
        </div>

      </main>
    </div>
  );
} 
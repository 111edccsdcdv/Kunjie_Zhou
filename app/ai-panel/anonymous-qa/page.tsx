'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bot, Loader2, Search, BadgeCheck, Inbox, CheckCircle2, ArrowLeft } from "lucide-react";
import clsx from "clsx";

// 假数据
const mockQuestions = Array.from({ length: 23 }).map((_, i) => ({
  id: `q${i + 1}`,
  text: `这是第${i + 1}条家长匿名提问内容，内容示例：如何更好地辅导孩子完成作业？`,
  created_at: new Date(Date.now() - i * 3600 * 1000).toISOString(),
  status: i % 3 === 0 ? "handled" : "unread",
}));

const PAGE_SIZE = 10;

export default function Page() {
  // 状态
  const [questions, setQuestions] = useState(mockQuestions);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "handled">("all");
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [aiReply, setAiReply] = useState<{ [qid: string]: string }>({});
  const [aiError, setAiError] = useState<{ [qid: string]: string }>({});
  const [copySuccess, setCopySuccess] = useState<{ [qid: string]: boolean }>({});

  // 过滤和分页
  const filtered = questions.filter(q =>
    (statusFilter === "all" || q.status === statusFilter) &&
    (search.trim() === "" || q.text.includes(search.trim()))
  );
  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pageQuestions = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 统计
  const totalCount = questions.length;
  const unreadCount = questions.filter(q => q.status === "unread").length;
  const handledCount = questions.filter(q => q.status === "handled").length;

  // 标记为已处理
  const markHandled = async (id: string) => {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, status: "handled" } : q));
    // await fetch(`/api/questions/${id}/mark-handled`, { method: "POST" }); // 预留
  };

  // AI推荐回复
  const handleAIReply = async (q: typeof mockQuestions[0]) => {
    setLoadingId(q.id);
    setAiError(e => ({ ...e, [q.id]: "" }));
    setAiReply(r => ({ ...r, [q.id]: "" }));
    try {
      // const res = await fetch("/api/generate-reply", { method: "POST", body: JSON.stringify({ question: q.text }) });
      // const data = await res.json();
      // setAiReply(r => ({ ...r, [q.id]: data.reply }));
      await new Promise(r => setTimeout(r, 1200));
      setAiReply(r => ({ ...r, [q.id]: `感谢您的提问，建议家长多与孩子沟通，关注学习习惯的培养。` }));
    } catch {
      setAiError(e => ({ ...e, [q.id]: "抱歉，AI暂时无法处理该请求，请稍后再试。" }));
    }
    setLoadingId(null);
  };

  // 复制回复
  const handleCopy = (qid: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(s => ({ ...s, [qid]: true }));
    setTimeout(() => setCopySuccess(s => ({ ...s, [qid]: false })), 1200);
  };

  // 加入教师回复模板
  const handleAddTemplate = async (qid: string, text: string) => {
    // await fetch("/api/reply-templates", { method: "POST", body: JSON.stringify({ text, fromQuestionId: qid }) });
    alert("已加入教师回复模板库！");
  };

  // 分页切换
  const handlePage = (p: number) => setPage(p);

  // 搜索/筛选重置页码
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  return (
    <div
      className="min-h-screen relative overflow-hidden px-0 md:px-8 py-0 md:py-8 bg-white"
      style={{
        background: 'radial-gradient(circle at 30% 40%, rgba(182, 214, 255, 0.7) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(232, 230, 255, 0.7) 0%, transparent 50%), white',
      }}
    >
      {/* 顶部导航栏 */}
      <nav className="relative z-10 flex items-center justify-center bg-white/40 backdrop-blur-2xl border-b border-blue-100 px-8 py-4 mt-6 mb-8 shadow-lg rounded-[2.5rem] min-h-[72px] ring-2 ring-white/40" style={{boxShadow:'0 4px 32px 0 rgba(31,38,135,0.18),0 0 24px 2px #fff6,0 0 0 2px #fff4 inset',backdropFilter:'blur(24px)'}}>
        {/* 左侧logo */}
        <div className="absolute left-8 flex items-center gap-2">
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
          className="text-lg font-bold text-blue-900 tracking-wide select-none drop-shadow text-center"
          style={{
            fontFamily: `'Smiley Sans', 'Noto Sans Rounded SC', 'Noto Sans SC', 'Microsoft YaHei', 'sans-serif'`,
            letterSpacing: 1,
            fontWeight: 700
          }}
        >
          AI家校沟通助手
        </span>
        {/* 右侧菜单 */}
        <div className="absolute right-8 flex items-center gap-4 text-gray-700">
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

      {/* 统计概览区 */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow border border-blue-100 p-6 flex flex-col items-center">
          <span className="text-gray-500 text-sm mb-1">总提问</span>
          <span className="text-2xl font-bold text-blue-700 flex items-center gap-2">{totalCount} <Inbox className="w-5 h-5 text-blue-300" /></span>
        </div>
        <div className="bg-white rounded-xl shadow border border-blue-100 p-6 flex flex-col items-center">
          <span className="text-gray-500 text-sm mb-1">未处理</span>
          <span className="text-2xl font-bold text-red-500 flex items-center gap-2">{unreadCount} <BadgeCheck className="w-5 h-5 text-red-300" /></span>
        </div>
        <div className="bg-white rounded-xl shadow border border-blue-100 p-6 flex flex-col items-center">
          <span className="text-gray-500 text-sm mb-1">已处理</span>
          <span className="text-2xl font-bold text-green-600 flex items-center gap-2">{handledCount} <CheckCircle2 className="w-5 h-5 text-green-300" /></span>
        </div>
      </section>

      {/* 搜索与筛选区 */}
      <section className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 mb-6 items-center justify-between px-2">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              className="w-full rounded-lg border border-blue-100 bg-white py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:outline-blue-300 shadow"
              placeholder="搜索提问内容..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 w-5 h-5 text-blue-300" />
          </div>
          <div className="flex gap-2 ml-2">
            <button
              className={clsx("px-3 py-1 rounded-lg text-sm font-medium border transition", statusFilter === "all" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-white text-gray-500 border-blue-100 hover:bg-blue-50")}
              onClick={() => setStatusFilter("all")}
            >全部</button>
            <button
              className={clsx("px-3 py-1 rounded-lg text-sm font-medium border transition", statusFilter === "unread" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-white text-gray-500 border-blue-100 hover:bg-blue-50")}
              onClick={() => setStatusFilter("unread")}
            >未处理</button>
            <button
              className={clsx("px-3 py-1 rounded-lg text-sm font-medium border transition", statusFilter === "handled" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-white text-gray-500 border-blue-100 hover:bg-blue-50")}
              onClick={() => setStatusFilter("handled")}
            >已处理</button>
          </div>
        </div>
      </section>

      {/* 匿名提问列表区 */}
      <section className="max-w-5xl mx-auto bg-white rounded-xl shadow border border-blue-100 p-0 overflow-hidden">
        <div className="divide-y divide-blue-50">
          {pageQuestions.map(q => (
            <div key={q.id} className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-0 px-4 py-5 group hover:bg-blue-50/40 transition">
              <div className="flex-1 min-w-0">
                <div className="text-gray-900 text-base font-medium mb-1">{q.text}</div>
                <div className="text-xs text-gray-400 mb-2">{new Date(q.created_at).toLocaleString()}</div>
                <div className="flex gap-2 items-center mb-1">
                  <span className={clsx("px-2 py-0.5 rounded text-xs font-semibold", q.status === "unread" ? "bg-red-100 text-red-500" : "bg-blue-100 text-blue-700")}>{q.status === "unread" ? "未处理" : "已处理"}</span>
                  <button
                    className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200 transition"
                    onClick={() => markHandled(q.id)}
                    disabled={q.status === "handled"}
                  >标记为已处理</button>
                  <button
                    className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 transition"
                    onClick={() => handleAddTemplate(q.id, q.text)}
                  >加入回复模板</button>
                </div>
                {/* AI推荐回复区 */}
                <div className="mt-2">
                  <button
                    className={clsx("inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition", loadingId === q.id && "opacity-60 cursor-not-allowed")}
                    onClick={() => handleAIReply(q)}
                    disabled={loadingId === q.id}
                  >
                    <Bot className="w-4 h-4" /> AI推荐回复
                    {loadingId === q.id && <Loader2 className="w-4 h-4 animate-spin ml-1" />}
                  </button>
                  {aiReply[q.id] && (
                    <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-3 flex flex-col gap-2">
                      <div className="text-gray-900 text-sm whitespace-pre-line">{aiReply[q.id]}</div>
                      <div className="flex gap-2">
                        <button
                          className={clsx("px-3 py-1 rounded bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition", copySuccess[q.id] && "bg-green-500")}
                          onClick={() => handleCopy(q.id, aiReply[q.id])}
                        >{copySuccess[q.id] ? "已复制" : "一键复制"}</button>
                        <button
                          className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition"
                          onClick={() => handleAddTemplate(q.id, aiReply[q.id])}
                        >加入教师回复模板库</button>
                      </div>
                    </div>
                  )}
                  {aiError[q.id] && (
                    <div className="mt-2 text-red-500 text-xs">{aiError[q.id]}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* 分页 */}
        <div className="flex justify-between items-center px-4 py-3 bg-blue-50 border-t border-blue-100">
          <span className="text-gray-500 text-sm">共 {total} 条，{totalPages} 页</span>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={clsx("w-8 h-8 rounded-lg text-sm font-medium border transition", page === i + 1 ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-blue-200 hover:bg-blue-100")}
                onClick={() => handlePage(i + 1)}
              >{i + 1}</button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 
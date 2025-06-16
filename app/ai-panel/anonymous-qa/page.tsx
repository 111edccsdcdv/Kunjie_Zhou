'use client';

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bot, Loader2, Search, BadgeCheck, Inbox, CheckCircle2, ArrowLeft } from "lucide-react";
import clsx from "clsx";

// 假数据
const questionBank = {
  '暑期活动': [
    '请问学校今年暑假会开展游学活动吗，具体时间和费用如何？',
    '想了解一下今年暑假学校有没有组织夏令营或者特色课程？',
    '关于暑假期间的校内活动，有没有什么详细的安排可以提前告知？',
    '孩子们暑假有什么推荐的校外活动，学校有合作机构吗？',
  ],
  '学习辅导': [
    '孩子在三年级数学学习上遇到了困难，有什么推荐的课外辅导资料吗？',
    '我发现孩子语文阅读理解能力比较弱，请问老师有什么好的方法建议吗？',
    '孩子对科学实验很感兴趣，学校有没有相关的社团或课后班？',
    '怎样才能有效提高孩子的英语口语水平？有没有好的学习资源？',
    '面对中考压力，如何帮助孩子调整心态，高效复习？',
  ],
  '学校通知': [
    '下周二的家长会，具体流程是什么，需要准备哪些材料？',
    '最近学校有没有发布关于学生期末考试安排的通知？',
    '关于春季运动会的报名时间和要求，请问在哪里可以查看？',
    '学校食堂的最新一周午餐菜单能否提前公布，是否有清真或素食选项？',
    '请问孩子们的校服什么时候可以领取或购买？具体尺码怎么选择？',
  ],
  '心理健康': [
    '我孩子最近情绪有点低落，作为家长应该如何引导和帮助他？',
    '孩子在学校和同学相处有些问题，老师有没有观察到？我们能怎么配合？',
    '如何培养孩子积极乐观的心态，面对学习和生活中的挑战？',
    '孩子有点焦虑，作为家长应该怎样和孩子沟通，缓解他的压力？',
  ],
  '成长适应': [
    '如何帮助孩子更好地适应从小学到初中的过渡期？',
    '孩子刚升入一年级，对新环境不太适应，有什么建议可以帮助他更快融入？',
    '青春期的孩子逆反心理比较强，家长应该如何正确处理亲子关系？',
    '如何引导孩子建立正确的价值观，培养良好的品德？',
  ],
};

const allQuestions = Object.values(questionBank).flat();

const mockQuestions = Array.from({ length: 20 }).map((_, i) => ({
  id: `q${i + 1}`,
  text: allQuestions[i % allQuestions.length],
  created_at: new Date(Date.now() - i * 3600 * 1000).toISOString(),
  status: i % 3 === 0 ? "handled" : "unread",
  isAnonymous: i % 2 === 0, // 偶数索引为匿名
  sender: i % 2 !== 0 ? `家长${Math.floor(i / 2) + 1}` : undefined, // 奇数索引为实名
}));

const PAGE_SIZE = 10;

// 定义问题类别和关键词 - 这些将不再被直接用于分类，但保留作为 DeepSeek 分类的参考
const questionCategories = [
  { name: '作业辅导', keywords: ['作业', '辅导', '学习方法', '考试', '成绩'] },
  { name: '学科问题', keywords: ['数学', '英语', '语文', '科学', '编程'] },
  { name: '心理健康', keywords: ['情绪', '压力', '沟通', '心理', '行为'] },
  { name: '校园活动', keywords: ['活动', '通知', '春游', '运动会'] },
  { name: '其他', keywords: [] }, // 兜底类别
];

export default function Page() {
  // 状态
  const [questions, setQuestions] = useState(mockQuestions);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "handled">("all");
  const [questionTypeFilter, setQuestionTypeFilter] = useState<"all" | "anonymous" | "real-name">("all"); // 新增：问题类型筛选
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [aiReply, setAiReply] = useState<{ [qid: string]: string }>({});
  const [aiError, setAiError] = useState<{ [qid: string]: string }>({});
  const [copySuccess, setCopySuccess] = useState<{ [qid: string]: boolean }>({});
  const [deepSeekClassifications, setDeepSeekClassifications] = useState<{ [qid: string]: string }>({});
  const [isDeepSeekClassifying, setIsDeepSeekClassifying] = useState(false); // 新增：DeepSeek 分类加载状态

  // 新增：回复对话框状态
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [currentQuestionToReply, setCurrentQuestionToReply] = useState<typeof mockQuestions[0] | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isGeneratingAIReply, setIsGeneratingAIReply] = useState(false);
  const [aiReplyError, setAiReplyError] = useState('');

  // 新增：高频问题关键词详情对话框状态
  const [showKeywordQuestionsDialog, setShowKeywordQuestionsDialog] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [questionsForSelectedKeyword, setQuestionsForSelectedKeyword] = useState<typeof mockQuestions>([]);

  // DeepSeek 分类处理
  useEffect(() => {
    const classifyAllQuestions = async () => {
      setIsDeepSeekClassifying(true); // 开始分类，设置加载状态为 true
      const newClassifications: { [qid: string]: string } = {};
      for (const q of questions) {
        try {
          const prompt = `请作为AI沟通助手，协助教师将以下家长提问归类为一个最简洁、最能代表主题的词语，不需要任何引号或标点符号，直接给出分类词语即可。例如：'孩子学习'，'学校活动'，'心理辅导'。\n提问内容: ${q.text}`;
          const res = await fetch("/api/llm-chat", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [{ role: "user", content: prompt }], model: "deepseek-chat" }),
          });
          if (res.ok) {
            const data = await res.json();
            newClassifications[q.id] = data.choices[0].message.content.trim();
          } else {
            console.error(`Failed to classify question ${q.id}:`, res.statusText);
            newClassifications[q.id] = '未分类';
          }
        } catch (error) {
          console.error(`Error classifying question ${q.id}:`, error);
          newClassifications[q.id] = '未分类';
        }
      }
      setDeepSeekClassifications(newClassifications);
      setIsDeepSeekClassifying(false); // 分类完成，设置加载状态为 false
    };

    classifyAllQuestions();
  }, [questions]); // 依赖于 questions 数组，当问题数据变化时重新分类

  // 过滤和分页
  const filtered = useMemo(() => questions.filter(q =>
    (statusFilter === "all" || q.status === statusFilter) &&
    (search.trim() === "" || q.text.includes(search.trim())) &&
    (questionTypeFilter === "all" ||
     (questionTypeFilter === "anonymous" && q.isAnonymous) ||
     (questionTypeFilter === "real-name" && !q.isAnonymous))
  ), [questions, statusFilter, search, questionTypeFilter]);

  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pageQuestions = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  // 统计
  const totalCount = questions.length;
  const unreadCount = questions.filter(q => q.status === "unread").length;
  const handledCount = questions.filter(q => q.status === "handled").length;

  // 高频问题类别统计
  const keywordStats = useMemo(() => {
    const stats: { [key: string]: number } = {};

    Object.values(deepSeekClassifications).forEach(categoryName => {
      stats[categoryName] = (stats[categoryName] || 0) + 1;
    });

    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .filter(item => item.count >= 2) // 确保只显示出现次数大于等于2的类别
      .sort((a, b) => b.count - a.count);
  }, [deepSeekClassifications]);

  // 处理类别点击
  const handleCategoryClick = (categoryName: string) => {
    setSelectedKeyword(categoryName); // 复用selectedKeyword状态，此时它代表类别名称
    const matchedQuestions = questions.filter(q =>
      deepSeekClassifications[q.id] === categoryName
    );
    setQuestionsForSelectedKeyword(matchedQuestions);
    setShowKeywordQuestionsDialog(true);
  };

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

  // 新增：处理回复按钮点击
  const handleReplyClick = (q: typeof mockQuestions[0]) => {
    setCurrentQuestionToReply(q);
    setReplyContent(''); // 清空之前的回复内容
    setAiReplyError('');
    setIsReplyDialogOpen(true);
  };

  // 新增：处理AI生成回复
  const handleGenerateAIReply = async () => {
    if (!currentQuestionToReply) return;
    setIsGeneratingAIReply(true);
    setAiReplyError('');
    try {
      // 根据当前回复框内容和原始问题构建更智能的提示词
      let promptContent = "请作为AI沟通助手，协助教师回复家长的提问。你将以教师的口吻和角色来提供回答建议。请删去markdown格式，分段尽可能简洁明了，快速传达意图。\n\n";
      if (replyContent.trim()) {
        promptContent += `以下是教师已输入的初步回复，请在此基础上进行完善和扩展：\n\n"""\n${replyContent}\n"""\n\n`;
      }
      promptContent += `家长原始提问：\n\n"""\n${currentQuestionToReply.text}\n"""\n\n请根据上述信息生成或完善回复建议。`;

      const res = await fetch("/api/llm-chat", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: promptContent }],
          model: "deepseek-chat", // 示例模型名称，请根据您的API实际支持的模型进行调整
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `API error: ${res.status}`);
      }

      const data = await res.json();
      setReplyContent(data.choices[0].message.content);
    } catch (err: any) {
      setAiReplyError(`抱歉，AI暂时无法生成回复：${err.message || '未知错误'}。请稍后再试。`);
    } finally {
      setIsGeneratingAIReply(false);
    }
  };

  // 新增：处理发送回复
  const handleSendReply = async () => {
    if (!currentQuestionToReply || !replyContent.trim()) return;

    console.log(`发送回复到家长 (问题ID: ${currentQuestionToReply.id}, 内容: ${replyContent})`);
    // 调用后端接口发送回复
    await fetch("/api/send-reply", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: currentQuestionToReply.id,
        replyContent: replyContent,
        teacherId: 'your-teacher-id', // !!! 请替换为实际教师ID !!!
        groupId: 'your-group-id', // !!! 请替换为实际班级群ID !!!
      }),
    });

    alert('回复已发送！');
    // 新增：将当前问题标记为已处理
    setQuestions(qs => qs.map(q => q.id === currentQuestionToReply?.id ? { ...q, status: "handled" } : q));

    setIsReplyDialogOpen(false);
    setReplyContent('');
    setCurrentQuestionToReply(null);
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

      {/* 高频问题类别统计图表区 */}
      <section className="max-w-5xl mx-auto bg-white rounded-xl shadow border border-blue-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-blue-800 mb-4">高频问题类别</h2>
        {isDeepSeekClassifying && keywordStats.length === 0 ? (
          <div className="text-center py-8 text-gray-500 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            AI正在帮您分析中……
          </div>
        ) : (
          <div className="space-y-4">
            {keywordStats.map((stat, index) => (
              <div
                key={stat.name}
                className="flex items-center cursor-pointer hover:bg-blue-50/40 transition p-2 rounded-lg"
                onClick={() => handleCategoryClick(stat.name)}
              >
                <span className="text-gray-700 w-24 flex-shrink-0">{stat.name}</span>
                <div className="flex-1 bg-blue-100 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(stat.count / Math.max(...keywordStats.map(s => s.count), 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-3 text-gray-700 font-semibold">{stat.count}</span>
              </div>
            ))}
          </div>
        )}
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
          {/* 新增：问题类型筛选 */}
          <div className="flex gap-2 ml-2 md:ml-0 mt-2 md:mt-0">
            <button
              className={clsx("px-3 py-1 rounded-lg text-sm font-medium border transition", questionTypeFilter === "all" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-white text-gray-500 border-blue-100 hover:bg-blue-50")}
              onClick={() => setQuestionTypeFilter("all")}
            >所有类型</button>
            <button
              className={clsx("px-3 py-1 rounded-lg text-sm font-medium border transition", questionTypeFilter === "anonymous" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-white text-gray-500 border-blue-100 hover:bg-blue-50")}
              onClick={() => setQuestionTypeFilter("anonymous")}
            >匿名提问</button>
            <button
              className={clsx("px-3 py-1 rounded-lg text-sm font-medium border transition", questionTypeFilter === "real-name" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-white text-gray-500 border-blue-100 hover:bg-blue-50")}
              onClick={() => setQuestionTypeFilter("real-name")}
            >实名提问</button>
          </div>
        </div>
      </section>

      {/* 匿名提问列表区 */}
      <section className="max-w-5xl mx-auto bg-white rounded-xl shadow border border-blue-100 p-0 overflow-hidden">
        <div className="divide-y divide-blue-50">
          {pageQuestions.map(q => (
            <div key={q.id} className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-0 px-4 py-5 group hover:bg-blue-50/40 transition">
              <div className="flex-1 min-w-0">
                <div className="text-gray-900 text-base font-medium mb-1">
                  {q.text}
                  {!q.isAnonymous && q.sender && (
                    <span className="ml-2 px-2 py-0.5 rounded text-xs font-semibold bg-gray-200 text-gray-700">来自: {q.sender}</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mb-2">{new Date(q.created_at).toLocaleString()}</div>
                <div className="flex gap-2 items-center mb-1">
                  <span className={clsx("px-2 py-0.5 rounded text-xs font-semibold", q.status === "unread" ? "bg-red-100 text-red-500" : "bg-blue-100 text-blue-700")}>{q.status === "unread" ? "未处理" : "已处理"}</span>
                  <span className={clsx("px-2 py-0.5 rounded text-xs font-semibold", q.isAnonymous ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-700")}>{q.isAnonymous ? "匿名提问" : "实名提问"}</span>
                  <button
                    className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200 transition"
                    onClick={() => markHandled(q.id)}
                    disabled={q.status === "handled"}
                  >标记为已处理</button>
                </div>
                {/* 新增：回复按钮 */}
                <div className="mt-2"> {/* 移除 w-full 使按钮不再占据全宽 */}
                  <button
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
                    onClick={() => handleReplyClick(q)}
                  >回复</button>
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

      {/* 新增：回复对话框 */}
      {isReplyDialogOpen && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-lg flex items-center justify-center z-50 p-4"> {/* 修改背景为毛玻璃效果 */}
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl mx-auto border border-blue-100 backdrop-filter backdrop-blur-lg bg-opacity-80 relative"> {/* 增大最大宽度 */}
            <h3 className="text-lg font-bold mb-4 text-blue-800">回复家长提问</h3>
            {currentQuestionToReply && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-700 font-medium mb-1">原问题:</p>
                <p className="text-sm text-gray-900">{currentQuestionToReply.text}</p>
              </div>
            )}
            <textarea
              className="w-full p-3 border border-blue-200 rounded-lg mb-4 h-64 focus:outline-blue-300 resize-y text-gray-800" // 增加高度
              placeholder="请输入您的回复内容..."
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
            ></textarea>
            {aiReplyError && <p className="text-red-500 text-sm mb-2">{aiReplyError}</p>}
            <div className="flex justify-between items-center">
              <button
                className={clsx(
                  "inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition",
                  isGeneratingAIReply && "opacity-60 cursor-not-allowed"
                )}
                onClick={handleGenerateAIReply}
                disabled={isGeneratingAIReply}
              >
                <Bot className="w-4 h-4" /> AI推荐回复
                {isGeneratingAIReply && <Loader2 className="w-4 h-4 animate-spin ml-1" />}
              </button>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  onClick={() => {
                    setIsReplyDialogOpen(false);
                    setReplyContent('');
                    setCurrentQuestionToReply(null);
                  }}
                >取消</button>
                <button
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                  onClick={handleSendReply}
                  disabled={!replyContent.trim()}
                >发送</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新增：高频问题关键词详情对话框 */}
      {showKeywordQuestionsDialog && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-auto border border-blue-100 backdrop-filter backdrop-blur-lg bg-opacity-80 relative">
            <h3 className="text-lg font-bold mb-4 text-blue-800">类别 "{selectedKeyword}" 相关问题</h3>
            <div className="max-h-96 overflow-y-auto pr-2">
              {questionsForSelectedKeyword.length > 0 ? (
                questionsForSelectedKeyword.map(q => (
                  <div key={q.id} className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-900 mb-1">
                      {/* 高亮关键词 */}
                      {q.text.split(new RegExp(`(${selectedKeyword})`, 'gi')).map((part, index) =>
                        part.toLowerCase() === selectedKeyword.toLowerCase() ? <span key={index} className="text-red-500 font-bold">{part}</span> : part
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(q.created_at).toLocaleString()}</p>
                    {!q.isAnonymous && q.sender && (
                      <span className="mt-1 inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-200 text-gray-700">来自: {q.sender}</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600">没有找到与该类别相关的问题。</p>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                onClick={() => setShowKeywordQuestionsDialog(false)}
              >关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
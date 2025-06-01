"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, Copy, BadgeCheck } from "lucide-react"; // Import Copy icon and BadgeCheck

export default function PostTemplate() {
  // 聊天历史与输入
  const [chatHistory, setChatHistory] = useState([
    { role: "system", content: "你是小学教师家校沟通AI助手，请优化、润色、隐私保护教师输入的通知内容。" },
  ]);
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [originText, setOriginText] = useState("");
  const [optimizeResult, setOptimizeResult] = useState(""); // AI优化结果
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false); // 复制成功提示
  const optimizeResultRef = useRef<HTMLDivElement>(null); // Ref for scroll

  // 上传文件
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    try {
      const text = await file.text();
      setOriginText(text);
      // 清空之前的优化结果和对话历史
      setOptimizeResult("");
      setChatHistory([{ role: "system", content: "你是小学教师家校沟通AI助手，请优化、润色、隐私保护教师输入的通知内容。" }]);
      setInput("");
    } catch (error) {
      console.error("文件读取失败:", error);
      setOriginText("文件读取失败，请手动粘贴内容。");
    }
    setLoading(false);
  };

  // 智能优化按钮点击事件 (从原始文本生成首次优化)
  const handleOptimize = async () => {
    if (!originText.trim()) return;
    setLoading(true);
    setOptimizeResult("");
    // 清空之前的对话历史，开始新的优化流程
    setChatHistory([{ role: "system", content: "你是小学教师家校沟通AI助手，请优化、润色、隐私保护教师输入的通知内容。" }]);
    setInput("");

    try {
      const res = await fetch("/api/llm-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "你是小学教师家校沟通AI助手，请优化、润色、隐私保护教师输入的通知内容。" },
            { role: "user", content: `请优化以下通知：\n${originText}` }
          ]
        }),
      });
      const data = await res.json();
      const aiContent = data.choices?.[0]?.message?.content || "AI暂无回复";
      setOptimizeResult(aiContent);
      // 将首次优化的结果也加入聊天历史，以便后续迭代基于此进行
      // setChatHistory((h) => [...h, { role: "assistant", content: aiContent }]); // Decided not to add the full initial optimization to chat history

    } catch (e) {
      console.error("AI接口调用失败:", e);
      setOptimizeResult("AI接口调用失败");
      setChatHistory((h) => [...h, { role: "assistant", content: "AI接口调用失败" }]);
    }
    setLoading(false);
     // 滚动到优化结果区域
     if (optimizeResultRef.current) {
       optimizeResultRef.current.scrollIntoView({ behavior: 'smooth' });
     }
  };

  // 复制优化结果
  const handleCopyOptimizeResult = () => {
    if (optimizeResult) {
      navigator.clipboard.writeText(optimizeResult);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // 2秒后恢复按钮文字
    }
  };

  // 发送到LLM（右侧对话框多轮对话进行迭代优化）
  const sendToLLM = async (userInput: string) => {
    if (!userInput.trim()) return;

    // 将用户输入添加到聊天历史
    const newUserMessage = { role: "user", content: userInput };
    setChatHistory((h) => [...h, newUserMessage]);
    setLoading(true);
    setInput(""); // 清空输入框

    // 构建发送给API的消息历史
    // 包括系统消息，当前的优化结果（如果有）作为上下文，以及用户当前的指令
    const messagesToSend = [
      chatHistory[0], // system message
    ];

    if (optimizeResult) {
        // Include the current optimized result in the context for the AI to refine
        messagesToSend.push({ role: "user", content: `基于以下内容进行进一步优化或回答我的问题：\n${optimizeResult}\n\n我的指令：${userInput}` });
    } else {
        // If no optimized result yet, just send the user's message (shouldn't happen if optimize is clicked first)
         messagesToSend.push(newUserMessage);
    }


    try {
      const res = await fetch("/api/llm-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesToSend }),
      });
      const data = await res.json();
      const aiContent = data.choices?.[0]?.message?.content || "AI暂无回复";

      // 将AI的新优化结果更新到 optimizeResult
      setOptimizeResult(aiContent);

      // 在右侧对话框中显示固定的确认消息，而不是AI的详细回复
      setChatHistory((h) => [...h, { role: "assistant", content: "内容已根据您的指令调整，如需进一步修改请继续对话。" }]);

    } catch (e) {
      console.error("AI接口调用失败:", e);
      // 如果API调用失败，显示错误信息在聊天历史中
      setChatHistory((h) => [...h, { role: "assistant", content: "AI接口调用失败，请稍后再试。" }]);
    }
    setLoading(false);
     // TODO: Scroll to the bottom of the chat history
  };

  // 发送消息到Chatbot
  const handleSend = async () => {
    if (!input.trim()) return;
    await sendToLLM(input);
  };

  // 确认发布 - 此处逻辑保留但不在页面上显示板块
  // const handleConfirm = () => {
  //   setFinalText(optimizeResult); // Final text is now the optimized result
  //   // alert("已调用机器人API群发（模拟）\n\n" + finalText); // 模拟调用API
  // };

  return (
    <div className="min-h-screen w-full flex flex-col items-center relative overflow-x-hidden">
      {/* Unified Radial gradient background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none select-none"
        style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(182, 214, 255, 0.7) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(232, 230, 255, 0.7) 0%, transparent 50%), white',
        }}
      />

      {/* 顶部导航栏 */}
      <nav className="relative z-10 flex items-center justify-between bg-white/40 backdrop-blur-2xl border-b border-blue-100 px-8 py-4 mt-6 mb-8 shadow-lg rounded-[2.5rem] min-h-[72px] ring-2 ring-white/40 max-w-7xl w-full mx-auto" style={{boxShadow:'0 4px 32px 0 rgba(31,38,135,0.18),0 0 24px 2px #fff6,0 0 0 2px #fff4 inset',backdropFilter:'blur(24px)'}}>
        {/* 左侧占位符 (配合 justify-between) */}
        <div className="flex items-center gap-2">{/* Optional: Could put a left-aligned logo here if not centered */}</div>
        {/* 标题居中 */}
        <span
          className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-blue-900 tracking-wide select-none drop-shadow text-center"
          style={{
            fontFamily: `'Smiley Sans', 'Noto Sans Rounded SC', 'Noto Sans SC', 'Microsoft YaHei', 'sans-serif'`,
            letterSpacing: 1,
            fontWeight: 700
          }}
        >
          {/* 扁平AI助教logo SVG */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle mr-2">
            <rect x="4" y="8" width="24" height="16" rx="8" fill="#4F8CFF"/>
            <ellipse cx="12" cy="16" rx="2.5" ry="3" fill="#fff"/>
            <ellipse cx="20" cy="16" rx="2.5" ry="3" fill="#fff"/>
            <rect x="13.5" y="21" width="5" height="2" rx="1" fill="#fff"/>
            <circle cx="16" cy="16" r="15" stroke="#4F8CFF" strokeWidth="2" fill="none"/>
          </svg>
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
      {/* 主体区域 - 修改为左右布局 */}
      <main className="relative z-10 flex flex-col md:flex-row gap-8 max-w-6xl mx-auto py-10 px-4 w-full">
        {/* 左侧：上传文件与原始文本 */}
        <section className="flex-1 flex flex-col">
          <div className="text-blue-900 font-semibold">原始通知内容与上传</div>
          <div className="text-gray-700 text-sm">您可以上传 Word/PDF/TXT 文件，或直接在此粘贴/输入通知文本或您想要通知的事项。</div>
          <div className="text-gray-700 text-sm mb-6">上传完毕后可以点击智能优化按钮就可以一键进行优化。</div>
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-blue-100 p-8 transition-transform duration-200 hover:scale-[1.02] flex flex-col">
            <div className="font-semibold mb-2">上传通知文件</div>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="file"
                accept=".doc,.docx,.pdf,.txt" // Added docx
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                选择文件
              </button>
              {fileName && <span className="text-sm text-gray-500">{fileName}</span>}
              {loading && <span className="text-xs text-blue-400 ml-2">正在处理...</span>}
            </div>
            <div className="font-semibold mb-2">粘贴或输入内容</div>
            <textarea
              className="w-full min-h-[250px] rounded-lg border border-blue-100 p-3 bg-white/40 focus:outline-blue-300 resize-y shadow-inner text-gray-900 placeholder-gray-500"
              placeholder="请粘贴或输入原始通知内容或事项..."
              value={originText}
              onChange={e => setOriginText(e.target.value)}
              disabled={loading}
            />
             <div className="flex justify-end mt-4">
                 <button
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleOptimize}
                    disabled={!originText.trim() || loading}
                >
                    智能优化 &gt;
                </button>
             </div>
          </div>
        </section>

        {/* 右侧：AI优化结果与对话 */}
        <section className="flex-1 flex flex-col">
           <div className="text-blue-900 font-semibold">AI优化结果与迭代</div>
           <div className="text-gray-700 text-sm mb-6">AI已在下方对您的通知进行了初步优化。您可以直接采纳或在下方的对话框中输入指令，与AI对话进一步精调内容。</div>

          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-blue-100 p-8 flex-1 flex flex-col transition-transform duration-200 hover:scale-[1.01]">
            {/* AI优化结果显示区 */}
            {optimizeResult && (
              <div ref={optimizeResultRef} className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow max-h-[300px] overflow-y-auto">
                <div className="font-semibold text-blue-800 mb-2 flex justify-between items-center">
                    <span>AI优化结果</span>
                    <button
                        className={`ml-2 px-3 py-1 rounded-lg shadow transition text-xs ${copySuccess ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                        onClick={handleCopyOptimizeResult}
                        disabled={!optimizeResult}
                      >
                        {copySuccess ? (
                           <span className="flex items-center"><BadgeCheck className="w-3 h-3 mr-1"/> 已复制</span>
                         ) : (
                           <span className="flex items-center"><Copy className="w-3 h-3 mr-1"/> 复制</span>
                         )}
                    </button>
                </div>
                <div className="whitespace-pre-line text-gray-900 text-sm">{optimizeResult}</div>
              </div>
            )}

            {/* AI对话助手 */}
            <div className="font-semibold mb-2 text-blue-800">AI对话助手</div>
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[250px]"> {/* Added max-height for scroll */}
              {chatHistory.slice(1).map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`rounded-xl px-4 py-2 max-w-[85%] text-sm shadow ${msg.role === "user" ? "bg-blue-100/80 text-gray-900" : "bg-blue-600 text-white"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && <div className="text-xs text-blue-400 self-center">AI正在思考...</div>}
            </div>
            {/* 输入框 */}
            <div className="flex gap-2 mt-4">
              <textarea // Changed to textarea for multi-line input
                className="flex-1 rounded-lg border border-blue-100 p-3 bg-white/40 focus:outline-blue-300 shadow-inner text-gray-900 placeholder-gray-500 resize-y min-h-[40px]"
                placeholder="请输入您的问题或优化指令..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} // Send on Enter, new line on Shift+Enter
                disabled={loading}
                rows={1} // Start with one row
              />
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSend}
                disabled={loading || !input.trim()}
              >发送</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
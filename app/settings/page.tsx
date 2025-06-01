"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SettingsPage() {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean | null, message: string | null }>({ success: null, message: null });

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: null });

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback: feedback.trim() }),
      });

      if (res.ok) {
        setSubmitStatus({ success: true, message: '反馈提交成功！感谢您的宝贵建议。' });
        setFeedback(''); // 清空输入框
      } else {
        setSubmitStatus({ success: false, message: '反馈提交失败，请稍后再试。' });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus({ success: false, message: '反馈提交失败，请检查网络连接。' });
    }

    setIsSubmitting(false);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center relative overflow-x-hidden bg-white"
       style={{
        background: 'radial-gradient(circle at 30% 40%, rgba(182, 214, 255, 0.7) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(232, 230, 255, 0.7) 0%, transparent 50%), white',
      }}
    >
      {/* Apple风格多层渐变光斑 */}
      <div className="pointer-events-none select-none absolute inset-0 z-0">
        <div className="absolute left-[-10vw] top-[-10vw] w-[40vw] h-[40vw] bg-gradient-to-br from-blue-200/60 via-white/0 to-blue-400/30 rounded-full blur-3xl opacity-70" />
        <div className="absolute right-[-8vw] top-[20vh] w-[32vw] h-[32vw] bg-gradient-to-br from-blue-300/40 via-white/0 to-blue-100/20 rounded-full blur-2xl opacity-60" />
        <div className="absolute left-[30vw] bottom-[-12vw] w-[36vw] h-[36vw] bg-gradient-to-tr from-blue-200/30 via-white/0 to-blue-400/20 rounded-full blur-2xl opacity-50" />
      </div>

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
          <Link href="/settings" className="hover:text-blue-500 transition font-semibold text-blue-600">设置</Link>
          <div className="relative group">
            <Image src="/avatar-girl.png" alt="avatar" width={36} height={36} className="rounded-full border border-blue-200 bg-blue-100 cursor-pointer" />
            <div className="absolute right-0 mt-2 w-28 bg-white/90 rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50">退出登录</button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主体内容区域 */}
      <main className="relative z-10 flex flex-col items-center max-w-4xl mx-auto py-10 px-4 w-full">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">设置</h1>

        {/* 设置选项卡/区域将在此添加 */}

        {/* 1. 账户设置 */}
        <section className="w-full bg-white/70 backdrop-blur-2xl rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-blue-800 mb-4">账户设置</h2>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">头像</label>
                    {/* 头像上传/修改区域 */}
                    <div className="flex items-center gap-4">
                        <Image src="/avatar-girl.png" alt="avatar" width={60} height={60} className="rounded-full border border-blue-200 bg-blue-100" />
                        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">修改头像</button>
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">密码</label>
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">修改密码</button>
                </div>
            </div>
        </section>

        {/* 2. 通知设置 */}
        <section className="w-full bg-white/70 backdrop-blur-2xl rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-blue-800 mb-4">通知设置</h2>
            <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 text-gray-700">
                    <input type="checkbox" className="accent-blue-500" defaultChecked />
                    <span>接收新的匿名提问通知</span>
                </label>
                <label className="flex items-center gap-2 text-gray-700">
                    <input type="checkbox" className="accent-blue-500" defaultChecked />
                    <span>接收通知阅读状态更新提醒</span>
                </label>
                <label className="flex items-center gap-2 text-gray-700">
                    <input type="checkbox" className="accent-blue-500" />
                    <span>按频率提醒高频问题 (开发中)</span>
                </label>
            </div>
        </section>

        {/* 3. AI助教设置 */}
        <section className="w-full bg-white/70 backdrop-blur-2xl rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-blue-800 mb-4">AI助教设置</h2>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">AI优化消息风格</label>
                    <select className="border border-blue-100 rounded-lg px-3 py-2 text-gray-900 bg-white/40">
                        <option>更正式</option>
                        <option>更亲切</option>
                        <option>默认</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">匿名提问标注偏好</label>
                    <label className="flex items-center gap-2 text-gray-700">
                         <input type="checkbox" className="accent-blue-500" defaultChecked />
                         <span>智能识别并标注高频问题</span>
                    </label>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">AI回复模板推荐模式</label>
                     <select className="border border-blue-100 rounded-lg px-3 py-2 text-gray-900 bg-white/40">
                        <option>优先推荐简洁模板</option>
                        <option>优先推荐详细模板</option>
                        <option>默认</option>
                    </select>
                </div>
            </div>
        </section>

        {/* 4. 通用设置 */}
        <section className="w-full bg-white/70 backdrop-blur-2xl rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-blue-800 mb-4">通用设置</h2>
            <div className="flex flex-col gap-4">
                 <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">语言</label>
                    <select className="border border-blue-100 rounded-lg px-3 py-2 text-gray-900 bg-white/40">
                        <option>中文（简体）</option>
                        {/* 其他语言选项 */}
                    </select>
                </div>
            </div>
        </section>

        {/* 5. 关于与帮助 */}
        <section className="w-full bg-white/70 backdrop-blur-2xl rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-blue-800 mb-4">关于与帮助</h2>
            <div className="flex flex-col gap-4">
                {/* 提供反馈入口 */}
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">提供反馈</label>
                    <textarea
                        className="w-full border border-blue-100 rounded-lg px-3 py-2 min-h-[100px] bg-white/40 text-gray-900 placeholder-gray-500"
                        placeholder="请输入您的建议或遇到的问题..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        disabled={isSubmitting}
                    ></textarea>
                    <button
                        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSubmitFeedback}
                        disabled={isSubmitting || !feedback.trim()}
                    >
                        {isSubmitting ? '提交中...' : '提交反馈'}
                    </button>
                     {submitStatus.message && (
                        <p className={`mt-2 text-sm ${submitStatus.success ? 'text-green-600' : 'text-red-600'}`}>
                            {submitStatus.message}
                        </p>
                    )}
                </div>
                {/* 隐私政策和使用条款链接 */}
                <div className="text-sm text-gray-600">
                    <Link href="/privacy" className="hover:underline">隐私政策</Link> | <Link href="/terms" className="hover:underline">使用条款</Link>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
} 
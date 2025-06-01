"use client";
import Image from "next/image";
import Link from "next/link";

export default function UserGuide() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-blue-300 flex flex-col items-center relative overflow-x-hidden">
      {/* Apple风格多层渐变光斑 */}
      <div className="pointer-events-none select-none absolute inset-0 z-0">
        {/* Unified Radial gradient background */} 
        <div
          className="absolute inset-0 z-0 pointer-events-none select-none"
          style={{
            background: 'radial-gradient(circle at 30% 40%, rgba(182, 214, 255, 0.7) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(232, 230, 255, 0.7) 0%, transparent 50%), white',
          }}
        />
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
          <Link href="/UserGuide" className="hover:text-blue-500 transition font-semibold text-blue-600">使用指引</Link>
          <Link href="/settings" className="hover:text-blue-500 transition">设置</Link>
          <div className="relative group">
            <Image src="/avatar-girl.png" alt="avatar" width={36} height={36} className="rounded-full border border-blue-200 bg-blue-100 cursor-pointer" />
            <div className="absolute right-0 mt-2 w-28 bg-white/90 rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50">退出登录</button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主体内容区域 */}
      <main className="relative z-10 flex flex-col items-center max-w-6xl mx-auto py-10 px-4 w-full">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">使用指引</h1>
        <p className="text-lg text-gray-700 mb-12 text-center">我们希望用技术温暖连接每一次家校沟通。</p>

        {/* 功能模块板块 */}

        {/* 1. 发布模板（Message Publishing Assistant）*/}
        <section className="w-full bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-blue-100 p-8 mb-12 flex flex-col md:flex-row items-center gap-8">
          {/* 左侧模拟界面图 */}
          <div className="flex-1 relative">
            <div className="w-full h-80 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-blue-700 text-xl font-semibold overflow-hidden relative">
              {/* 模拟的上传文件框和输入框 */}
              <div className="absolute top-4 left-4 right-4 bottom-4 bg-white/80 rounded-lg p-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg shadow">选择文件</button>
                  <span className="text-sm text-gray-500">示例文件.txt</span>
                </div>
                <textarea
                  className="flex-1 w-full min-h-[100px] rounded-lg border border-blue-100 p-3 bg-white/40 text-gray-900 placeholder-gray-500 text-sm"
                  placeholder="粘贴或输入内容..."
                  value="【关于...通知】\n时间：...\n地点：..."
                  readOnly
                />
                 <div className="flex justify-end">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow">智能优化</button>
                 </div>
              </div>
            </div>
            {/* 标注 */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded">上传文件区</div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded">编辑提示区</div>
          </div>
          {/* 右侧说明文字 */}
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-blue-800">发布模板（Message Publishing Assistant）</h2>
            <p className="text-gray-700">
              此功能帮助教师快速创建和优化通知。您可以上传 Word、PDF 或 TXT 文件，或直接在文本框中输入通知内容。
            </p>
            <p className="text-gray-700">
              AI 将自动对您的通知进行初步优化，包括润色措辞、规范格式以及保护敏感信息。
            </p>
            <p className="text-gray-700">
              优化结果会显示在左侧区域，您可以直接采纳或根据需要进行进一步编辑和调整。
            </p>
          </div>
        </section>

        {/* 2. 匿名提问管理与汇总（Anonymous Q&A Dashboard）*/}
        <section className="w-full bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-blue-100 p-8 mb-12 flex flex-col md:flex-row-reverse items-center gap-8">
          {/* 右侧模拟界面图 */}
          <div className="flex-1 relative">
            <div className="w-full h-80 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-blue-700 text-xl font-semibold overflow-hidden relative">
               {/* 模拟的提问列表 */}
               <div className="absolute top-4 left-4 right-4 bottom-4 bg-white/80 rounded-lg p-4 flex flex-col gap-3 overflow-y-auto">
                   <div className="p-3 bg-white rounded-lg shadow-sm border border-blue-100">
                       <div className="font-semibold text-blue-800 text-sm mb-1">问题：孩子感冒需要请假吗？</div>
                       <div className="text-xs text-gray-500 mb-2">频率：高 | AI 分类：健康问题</div>
                       <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200">设置为模板回复</button>
                   </div>
                    <div className="p-3 bg-white rounded-lg shadow-sm border border-blue-100">
                       <div className="font-semibold text-blue-800 text-sm mb-1">问题：明天有体育课吗？</div>
                       <div className="text-xs text-gray-500 mb-2">频率：中 | AI 分类：课程安排</div>
                        <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200">设置为模板回复</button>
                   </div>
                   <div className="p-3 bg-white rounded-lg shadow-sm border border-blue-100">
                       <div className="font-semibold text-blue-800 text-sm mb-1">问题：作业提交截止日期？</div>
                       <div className="text-xs text-gray-500 mb-2">频率：高 | AI 分类：学习事务</div>
                        <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200">设置为模板回复</button>
                   </div>
               </div>
            </div>
             {/* 标注 */}
             <div className="absolute top-6 right-1/2 translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded">问题列表</div>
          </div>
          {/* 左侧说明文字 */}
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-blue-800">匿名提问管理与汇总（Anonymous Q&A Dashboard）</h2>
            <p className="text-gray-700">
              此板块汇总家长匿名提出的所有问题，帮助教师快速掌握家长关注的焦点。
            </p>
            <p className="text-gray-700">
              系统会通过 AI 智能识别和标注高频问题，方便您优先处理或将其设置为模板回复，提高沟通效率。
            </p>
            <p className="text-gray-700">
              您可以直接在列表中查看问题详情，并进行回复或标记处理。
            </p>
          </div>
        </section>

        {/* 3. 阅读追踪功能（Notification Reading Tracker）*/}
        <section className="w-full bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-blue-100 p-8 mb-12 flex flex-col md:flex-row items-center gap-8">
           {/* 左侧模拟界面图 */}
           <div className="flex-1 relative">
              <div className="w-full h-80 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-blue-700 text-xl font-semibold overflow-hidden relative">
                  {/* 模拟的阅读追踪列表 */}
                   <div className="absolute top-4 left-4 right-4 bottom-4 bg-white/80 rounded-lg p-4 flex flex-col gap-3 overflow-y-auto text-sm">
                        <div className="font-semibold text-blue-800 mb-2">通知标题：关于春游活动的通知</div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">已读家长：王小明，李华... (15人)</span>
                            <span className="text-red-600 font-semibold">未读家长：张伟，陈丽... (5人)</span>
                        </div>
                         <div className="flex justify-end">
                             <button className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200">一键提醒未读家长</button>
                         </div>
                         <div className="mt-2 p-3 bg-white rounded-lg shadow-sm border border-blue-100">
                             <div className="font-semibold text-blue-800 text-sm mb-1">未读家长列表</div>
                             <ul className="list-disc list-inside text-gray-700">
                                 <li>张伟</li>
                                 <li>陈丽</li>
                                 <li>赵敏</li>
                             </ul>
                         </div>
                   </div>
              </div>
              {/* 标注 */}
              <div className="absolute bottom-6 right-6 bg-red-500 text-white text-xs px-2 py-1 rounded">一键提醒区域</div>
              <div className="absolute bottom-6 left-6 bg-blue-500 text-white text-xs px-2 py-1 rounded">未读家长列表</div>
           </div>
           {/* 右侧说明文字 */}
           <div className="flex-1 flex flex-col gap-4">
             <h2 className="text-2xl font-bold text-blue-800">阅读追踪功能（Notification Reading Tracker）</h2>
             <p className="text-gray-700">
               即使在不支持阅读状态直读的平台，本系统也能通过 AI 智能分析，间接推测家长是否已阅读您的群发通知。
             </p>
             <p className="text-gray-700">
               此功能提供未读家长列表和"一键提醒"按钮，帮助您精准触达未收到信息的家长，确保重要通知不遗漏。
             </p>
           </div>
        </section>

        {/* 4. 回复模板（AI Response Suggestion）*/}
        <section className="w-full bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-blue-100 p-8 mb-12 flex flex-col md:flex-row-reverse items-center gap-8">
            {/* 右侧模拟界面图 */}
            <div className="flex-1 relative">
                <div className="w-full h-80 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-blue-700 text-xl font-semibold overflow-hidden relative">
                    {/* 模拟的chatbot界面 */}
                    <div className="absolute top-4 left-4 right-4 bottom-4 bg-white/80 rounded-lg p-4 flex flex-col gap-3">
                        <div className="flex justify-start">
                            <div className="rounded-xl px-4 py-2 max-w-[80%] text-sm bg-blue-100/80 text-gray-900 shadow">老师您好，孩子今天有点咳嗽，可以请假吗？</div>
                        </div>
                        <div className="flex justify-end">
                             <div className="flex flex-col items-end max-w-[80%]">
                                <div className="rounded-xl px-4 py-2 text-sm bg-blue-600 text-white shadow">好的家长，请提供孩子的姓名和班级信息，并在返校时提供医院证明。感谢您的理解！</div>
                                <button className="mt-1 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">采纳此回复</button>
                             </div>
                        </div>
                        <div className="flex-1 flex items-end">
                            <input className="flex-1 rounded-lg border border-blue-100 p-2 bg-white/40 text-gray-900 placeholder-gray-500 text-sm" placeholder="编辑或输入回复..." />
                            <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow text-sm">发送</button>
                        </div>
                    </div>
                </div>
                 {/* 标注 */}
                 <div className="absolute bottom-6 right-6 bg-green-500 text-white text-xs px-2 py-1 rounded">采纳回复按钮</div>
                 <div className="absolute bottom-6 left-6 bg-blue-500 text-white text-xs px-2 py-1 rounded">编辑区</div>
            </div>
            {/* 左侧说明文字 */}
            <div className="flex-1 flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-blue-800">回复模板（AI Response Suggestion）</h2>
              <p className="text-gray-700">
                面对家长的提问，系统能基于问题内容和历史数据，智能推荐合适的回复模板。
              </p>
              <p className="text-gray-700">
                教师可以直接采纳 AI 推荐的回复，也可在此基础上进行修改和个性化编辑，确保回复的专业和准确性。
              </p>
              <p className="text-gray-700">
                这大大减少了重复性回复的工作量，让教师更专注于教学。
              </p>
            </div>
        </section>

      </main>
    </div>
  );
} 
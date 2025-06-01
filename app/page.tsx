import Link from "next/link";
import Image from "next/image";
import { HiOutlineDocumentText, HiOutlineQuestionMarkCircle, HiOutlineBell, HiOutlineEnvelope } from "react-icons/hi2";

const features = [
  {
    title: "发布模板",
    desc: "上传通知文件或文本，AI优化措辞并群发。",
    icon: <HiOutlineDocumentText className="h-12 w-12 text-blue-400" />,
    link: "/post-template",
  },
  {
    title: "匿名提问汇总",
    desc: "查看家长匿名提问与高频统计。",
    icon: <HiOutlineQuestionMarkCircle className="h-12 w-12 text-purple-400" />,
    link: "/ai-panel/anonymous-qa",
  },
  {
    title: "通知阅读追踪",
    desc: "追踪家长已读/未读，支持一键提醒。",
    icon: <HiOutlineBell className="h-12 w-12 text-blue-300" />,
    link: "/notification-tracker",
  },
  {
    title: "回复模板管理",
    desc: "管理常用回复模板，AI生成标准答复。",
    icon: <HiOutlineEnvelope className="h-12 w-12 text-purple-300" />,
    link: "/reply-template",
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden bg-white"
      style={{
        background: 'radial-gradient(circle at 30% 40%, rgba(182, 214, 255, 0.7) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(232, 230, 255, 0.7) 0%, transparent 50%), white',
      }}
    >
      {/* 顶部导航栏 */}
      <nav className="relative z-10 flex items-center justify-center bg-white/40 backdrop-blur-2xl border-b border-blue-100 px-8 py-4 mt-6 mb-8 shadow-lg rounded-[2.5rem] min-h-[72px] ring-2 ring-white/40 max-w-7xl w-full mx-auto" style={{boxShadow:'0 4px 32px 0 rgba(31,38,135,0.18),0 0 24px 2px #fff6,0 0 0 2px #fff4 inset',backdropFilter:'blur(24px)'}}>
        {/* 左侧logo */}
        <div className="absolute left-8 flex items-center gap-2">
          <Image src="/robot-3d.png" alt="logo" width={44} height={44} className="rounded-full bg-white shadow border border-blue-200" />
        </div>
        {/* 标题居中 */}
        <span
          className="flex items-center gap-2 text-lg font-bold text-blue-900 tracking-wide select-none drop-shadow text-center"
          style={{
            fontFamily: `'Quicksand', 'Nunito', 'Noto Sans Rounded', 'Noto Sans SC', 'Poppins', 'Microsoft YaHei', 'sans-serif'`,
            letterSpacing: 1,
            fontWeight: 700
          }}
        >
          {/* 扁平AI助教logo SVG */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="8" width="24" height="16" rx="8" fill="#4F8CFF"/>
            <ellipse cx="12" cy="16" rx="2.5" ry="3" fill="#fff"/>
            <ellipse cx="20" cy="16" rx="2.5" ry="3" fill="#fff"/>
            <rect x="13.5" y="21" width="5" height="2" rx="1" fill="#fff"/>
            <circle cx="16" cy="16" r="15" stroke="#4F8CFF" strokeWidth="2" fill="none"/>
          </svg>
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
      {/* 宣传标题 */}
      <div className="w-full flex justify-center mt-14 mb-14">
        <div className="text-2xl text-blue-900 drop-shadow-lg tracking-wider" style={{fontFamily: `'SF Pro SC', 'SF Pro Display', 'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', 'Arial', 'sans-serif'`, fontWeight: 300}}>用技术温暖连接每一次家校沟通，让AI助教成为您身边的贴心协作伙伴。</div>
      </div>
      {/* 主功能区：一排横向平铺，等大长方形卡片 */}
      <main className="flex-1 flex flex-col items-center justify-center py-32 px-2 pt-8 relative">
        <div className="relative z-10 flex flex-row gap-4 w-full max-w-7xl pb-16 justify-center">
          {features.map((f) => (
            <div key={f.title} className="group">
              <Link
                href={f.link}
                className="card-3d rounded-[1.5rem] flex flex-col items-center justify-center
                  bg-white/30 backdrop-blur-2xl border border-blue-200/60 shadow-2xl
                  transition-transform duration-300 hover:shadow-2xl
                  w-[240px] h-[420px] mx-auto
                  ring-2 ring-white/40"
                style={{
                  boxShadow: `0 8px 32px 0 rgba(31,38,135,0.18), 0 0 32px 4px #fff7, 0 0 0 2px #fff4 inset, 0 8px 32px 0 #fff4 inset`,
                  border: "1.5px solid rgba(180,200,255,0.25)",
                  backdropFilter: "blur(32px)",
                  WebkitBackdropFilter: "blur(32px)",
                  background: "linear-gradient(135deg,rgba(255,255,255,0.32) 60%,rgba(200,220,255,0.18) 100%)",
                }}
              >
                <div className="mb-5 mt-7">{f.icon}</div>
                <div className="text-xl font-bold text-blue-900 mb-4 drop-shadow-lg" style={{fontFamily: `'Noto Sans SC', 'Poppins', 'Microsoft YaHei', 'sans-serif'`, fontWeight: 700}}>{f.title}</div>
                <div className="text-gray-700 text-base text-center leading-relaxed px-6" style={{fontFamily: `'Noto Sans SC', 'Poppins', 'Microsoft YaHei', 'sans-serif'`, fontWeight: 300}}>{f.desc}</div>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

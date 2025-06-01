'use client';
import Link from "next/link";
import { useState } from "react";
import { HiOutlineArrowLeft, HiOutlineBell, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2";
import Image from "next/image";

// 假数据
const notification = {
  id: "n1",
  title: "关于春游活动的通知",
  date: "2024-05-01 09:00",
};
const parents = [
  { id: 1, parentName: "王老师", childName: "小明", read: true, readTime: "2024-05-01 10:12", remark: "" },
  { id: 2, parentName: "李家长", childName: "李雷", read: false, readTime: "", remark: "提醒过" },
  { id: 3, parentName: "张家长", childName: "张三", read: true, readTime: "2024-05-01 10:30", remark: "" },
  { id: 4, parentName: "赵家长", childName: "赵四", read: false, readTime: "", remark: "" },
];

export default function NotificationDetailPage() {
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [data, setData] = useState(parents);
  const [reminded, setReminded] = useState<number[]>([]);

  // 筛选
  const filtered = data.filter(p => filter === 'all' ? true : filter === 'read' ? p.read : !p.read);

  // 批量提醒
  const handleBatchRemind = () => {
    const ids = data.filter(p => !p.read).map(p => p.id);
    setReminded(r => Array.from(new Set([...r, ...ids])));
    alert('已批量提醒未读家长！');
  };
  // 单独提醒
  const handleRemind = (id: number) => {
    setReminded(r => r.includes(id) ? r : [...r, id]);
    alert('已提醒该家长！');
  };
  // 备注编辑
  const handleRemark = (id: number, remark: string) => {
    setData(ds => ds.map(p => p.id === id ? { ...p, remark } : p));
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden bg-white"
      style={{
        background: 'radial-gradient(circle at 30% 40%, rgba(182, 214, 255, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(232, 230, 255, 0.4) 0%, transparent 50%), white',
      }}
    >
      {/* 左上蓝色正圆渐变 */}
      <div style={{position:'absolute',left:'-12vw',top:'-10vw',width:'38vw',height:'38vw',pointerEvents:'none',zIndex:0,
        background:'radial-gradient(circle 19vw at 30% 35%, #b6d6ff 60%, transparent 100%)',
        borderRadius:'50%',filter:'blur(2px)',opacity:0.7}} />
      {/* 右下淡紫色正圆渐变 */}
      <div style={{position:'absolute',right:'-10vw',bottom:'-8vw',width:'28vw',height:'28vw',pointerEvents:'none',zIndex:0,
        background:'radial-gradient(circle 14vw at 70% 65%, #e8e6ff 60%, transparent 100%)',
        borderRadius:'50%',filter:'blur(2px)',opacity:0.7}} />
      {/* 顶部导航栏 */}
      <nav className="relative z-10 flex items-center justify-center bg-white/40 backdrop-blur-2xl border-b border-blue-100 px-8 py-4 mt-6 mb-8 shadow-lg rounded-[2.5rem] min-h-[72px] ring-2 ring-white/40 max-w-7xl w-full mx-auto" style={{boxShadow:'0 4px 32px 0 rgba(31,38,135,0.18),0 0 24px 2px #fff6,0 0 0 2px #fff4 inset',backdropFilter:'blur(24px)'}}>
        {/* 左侧logo */}
        <div className="absolute left-8 flex items-center gap-2">
          <Image src="/robot-3d.png" alt="logo" width={44} height={44} className="rounded-full bg-white shadow border border-blue-200" />
        </div>
        {/* 标题居中 */}
        <span
          className="flex items-center gap-2 text-lg font-bold text-blue-900 tracking-wide select-none drop-shadow text-center"
          style={{fontFamily: `'Quicksand', 'Nunito', 'Noto Sans Rounded', 'Noto Sans SC', 'Poppins', 'Microsoft YaHei', 'sans-serif'`,letterSpacing: 1,fontWeight: 700}}
        >
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
          <Link href="/guide" className="hover:text-blue-500 transition">使用指引</Link>
          <Link href="/settings" className="hover:text-blue-500 transition">设置</Link>
          <div className="relative group">
            <Image src="/avatar-girl.png" alt="avatar" width={36} height={36} className="rounded-full border border-blue-200 bg-blue-100 cursor-pointer" />
            <div className="absolute right-0 mt-2 w-28 bg-white/90 rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50">退出登录</button>
            </div>
          </div>
        </div>
      </nav>
      {/* 返回按钮与通知信息 */}
      <div className="max-w-5xl mx-auto w-full flex items-center gap-4 mb-6 px-2">
        <Link href="/notification-tracker" className="flex items-center gap-1 text-blue-500 hover:underline"><HiOutlineArrowLeft className="w-5 h-5"/>返回</Link>
        <div className="flex-1 text-xl font-bold text-blue-900">{notification.title}</div>
        <div className="text-gray-700 text-sm">{notification.date}</div>
      </div>
      {/* 操作区 */}
      <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row gap-4 mb-4 px-2">
        <div className="flex gap-2">
          <button className={`px-3 py-1 rounded-lg text-sm font-medium border transition ${filter==='all'?'bg-blue-100 text-blue-700 border-blue-200':'bg-white text-gray-500 border-blue-100 hover:bg-blue-50'}`} onClick={()=>setFilter('all')}>全部</button>
          <button className={`px-3 py-1 rounded-lg text-sm font-medium border transition ${filter==='read'?'bg-blue-100 text-blue-700 border-blue-200':'bg-white text-gray-500 border-blue-100 hover:bg-blue-50'}`} onClick={()=>setFilter('read')}>已读</button>
          <button className={`px-3 py-1 rounded-lg text-sm font-medium border transition ${filter==='unread'?'bg-blue-100 text-blue-700 border-blue-200':'bg-white text-gray-500 border-blue-100 hover:bg-blue-50'}`} onClick={()=>setFilter('unread')}>未读</button>
        </div>
        <div className="flex-1 flex justify-end gap-2">
          <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium shadow border border-blue-100 transition" onClick={handleBatchRemind}><HiOutlineBell className="w-5 h-5 inline-block mr-1"/>批量提醒未读家长</button>
        </div>
      </div>
      {/* 家长阅读状态表格 */}
      <section className="max-w-5xl mx-auto w-full bg-white/60 backdrop-blur-xl rounded-2xl shadow border border-blue-100 p-0 overflow-hidden z-10">
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="py-3 px-4 text-left text-blue-900">家长姓名</th>
              <th className="py-3 px-4 text-left text-blue-900">孩子姓名</th>
              <th className="py-3 px-4 text-center text-blue-900">是否已读</th>
              <th className="py-3 px-4 text-center text-blue-900">阅读时间</th>
              <th className="py-3 px-4 text-center text-blue-900">备注</th>
              <th className="py-3 px-4 text-center text-blue-900">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p=>(
              <tr key={p.id} className="border-t border-blue-50 hover:bg-blue-50/40 transition">
                <td className="py-3 px-4 text-blue-900">{p.parentName}</td>
                <td className="py-3 px-4 text-blue-900">{p.childName}</td>
                <td className="py-3 px-4 text-center">
                  {p.read ? <HiOutlineCheckCircle className="w-5 h-5 text-green-500 inline"/> : <HiOutlineXCircle className="w-5 h-5 text-red-400 inline"/>}
                </td>
                <td className="py-3 px-4 text-center text-blue-900">{p.readTime || '-'}</td>
                <td className="py-3 px-4 text-center">
                  <input
                    className="border border-blue-100 rounded px-2 py-1 w-24 text-xs bg-white/80 text-blue-900 placeholder:text-gray-400"
                    value={p.remark}
                    onChange={e=>handleRemark(p.id, e.target.value)}
                    placeholder="备注/标签"
                  />
                </td>
                <td className="py-3 px-4 text-center">
                  {!p.read && <button className={`px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-medium hover:bg-blue-200 transition ${reminded.includes(p.id)?'opacity-60 cursor-not-allowed':''}`} disabled={reminded.includes(p.id)} onClick={()=>handleRemind(p.id)}><HiOutlineBell className="w-4 h-4 inline"/> 单独提醒</button>}
                  {reminded.includes(p.id) && <span className="ml-2 text-green-600 text-xs">已提醒</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
} 
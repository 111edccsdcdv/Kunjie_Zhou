'use client';
import Link from "next/link";
import { useState } from "react";
import { HiOutlineDocumentText, HiOutlinePlus } from "react-icons/hi2";
// @ts-ignore
import { PieChart, Pie, Cell } from "recharts";
import Image from "next/image";

// 假数据
const notifications = [
  { id: "n1", title: "关于春游活动的通知", date: "2024-05-01", expired: false },
  { id: "n2", title: "五一假期安全提醒", date: "2024-04-28", expired: true },
  { id: "n3", title: "家长会时间安排", date: "2024-04-25", expired: true },
];

const stats = {
  total: 36,
  read: 28,
  unread: 8,
};

const donutData = [
  { name: "已读", value: stats.read },
  { name: "未读", value: stats.unread },
];
const donutColors = ["#4F8CFF", "#E3E8F0"];

export default function NotificationTrackerPage() {
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
      <section className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-6 mb-8 px-2 z-10">
        <div className="flex-1 flex flex-row gap-6">
          <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl shadow border border-blue-100 p-6 flex flex-col items-center min-w-[140px]">
            <span className="text-gray-500 text-sm mb-1">总家长数</span>
            <span className="text-2xl font-bold text-blue-700">{stats.total}</span>
          </div>
          <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl shadow border border-blue-100 p-6 flex flex-col items-center min-w-[140px]">
            <span className="text-gray-500 text-sm mb-1">已读人数</span>
            <span className="text-2xl font-bold text-green-600">{stats.read}</span>
          </div>
          <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl shadow border border-blue-100 p-6 flex flex-col items-center min-w-[140px]">
            <span className="text-gray-500 text-sm mb-1">未读人数</span>
            <span className="text-2xl font-bold text-red-500">{stats.unread}</span>
          </div>
          <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl shadow border border-blue-100 p-6 flex flex-col items-center min-w-[140px]">
            <span className="text-gray-500 text-sm mb-1">阅读率</span>
            <span className="text-2xl font-bold text-blue-900">{Math.round(stats.read / stats.total * 100)}%</span>
          </div>
        </div>
        {/* 圆环图 */}
        <div className="flex items-center justify-center min-w-[180px]">
          {/* @ts-ignore */}
          <PieChart width={120} height={120}>
            {/* @ts-ignore */}
            <Pie
              data={donutData}
              cx={60}
              cy={60}
              innerRadius={38}
              outerRadius={54}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {/* @ts-ignore */}
              {donutData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={donutColors[idx]} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </section>
      {/* 导出和新建通知按钮 */}
      <div className="max-w-7xl mx-auto w-full flex justify-end gap-4 px-2 mb-2 z-10">
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium shadow border border-blue-100 transition">
          <span className="w-5 h-5 inline-block align-middle">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M10 3v10m0 0l-4-4m4 4l4-4" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 17h12" strokeLinecap="round"/></svg>
          </span> 导出为Excel
        </button>
      </div>
      {/* 通知发送记录区 */}
      <section className="max-w-7xl mx-auto w-full bg-white/60 backdrop-blur-xl rounded-2xl shadow border border-blue-100 p-0 overflow-hidden z-10">
        <div className="divide-y divide-blue-50">
          {notifications.map(n => (
            <div key={n.id} className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-0 px-6 py-5 group hover:bg-blue-50/40 transition">
              <div className="flex-1 min-w-0">
                <div className="text-blue-900 text-lg font-bold mb-1 flex items-center gap-2">
                  <HiOutlineDocumentText className="w-6 h-6 text-blue-400" />
                  {n.title}
                  {n.expired && <span className="ml-2 px-2 py-0.5 rounded bg-gray-100 text-gray-400 text-xs">已过期</span>}
                </div>
                <div className="text-xs text-gray-400 mb-2">{n.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/notification-tracker/${n.id}`} className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium shadow border border-blue-100 transition">查看阅读情况</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 
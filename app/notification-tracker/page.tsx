'use client';
import Link from "next/link";
import { useState } from "react";
import { HiOutlineDocumentText, HiOutlinePlus } from "react-icons/hi2";
// @ts-ignore
import { PieChart, Pie, Cell } from "recharts";
import Image from "next/image";

// 定义 Notification 接口
interface Notification {
  id: string;
  title: string;
  date: string;
  expired: boolean;
  category: string; // 新增的类别字段
  content: string; // 新增的通知内容字段
}

// 假数据
const notifications: Notification[] = [
  { id: "n1", title: "关于2024年春季运动会安排的通知", date: "2024-05-01", expired: false, category: "学校活动", content: "亲爱的同学们、家长们，我校定于2024年5月15日（星期三）上午8:30在学校操场隆重举行春季运动会。本次运动会将设短跑、跳远、铅球、接力等多个项目，旨在增强学生体质，培养团队协作精神。请各位同学根据自身兴趣和特长积极报名参加各项比赛，展现青春风采！报名截止日期为5月10日，请班主任老师协助组织报名工作，确保各项准备就绪。期待大家在运动会上取得优异成绩！" },
  { id: "n2", title: "庆祝六一儿童节文艺汇演报名通知", date: "2024-04-28", expired: true, category: "学校活动", content: "为庆祝即将到来的六一国际儿童节，我校将于5月28日（星期二）下午2:00在学校礼堂举办盛大的文艺汇演。本次汇演旨在为孩子们提供一个展示才艺、放飞梦想的舞台。现面向全体学生征集各类节目，包括歌舞、朗诵、乐器演奏、相声小品等。欢迎同学们踊跃报名，发挥创意，展现你们的独特魅力！报名截止日期为5月15日，请同学们将节目名称、表演形式及参演人员名单报至班主任处。期待一场精彩纷呈的儿童节盛宴！" },
  { id: "n3", title: "学校科技节创新作品征集通知", date: "2024-04-25", expired: false, category: "学校活动", content: "一年一度的学校科技节即将于5月20日启动，本届科技节的主题是\"创新引领未来\"。为激发学生的科学兴趣和创新精神，特向全体师生征集创新作品。作品形式不限，可以是科学实验、小发明、科幻画、编程作品等。请大家发挥想象力，提交您的奇思妙想和实践成果！优秀作品将在科技节期间进行展示，并有机会获得学校表彰。征集截止日期为5月10日，请将作品及相关说明提交至教务处。期待您的参与，共同探索科学的奥秘！" },
  { id: "n4", title: "寒假社会实践活动总结大会通知", date: "2024-04-20", expired: true, category: "学校活动", content: "各位参与2024年寒假社会实践活动的同学：学校定于4月28日（星期日）上午9:00在多功能厅举行寒假社会实践活动总结大会。请各位同学务必准时参加，并准备好您的实践报告和心得体会。本次大会旨在分享实践经验，总结活动成果，并对表现优秀的同学进行表彰。请大家提前做好准备，将您的收获和感悟与大家分享。感谢所有同学的积极参与！" },
  { id: "n5", title: "青少年情绪管理与压力应对讲座", date: "2024-04-18", expired: false, category: "心理辅导", content: "为了帮助青少年更好地应对学业和生活中的压力，提升情绪管理能力，学校特邀知名心理专家李老师于4月25日（星期四）下午3:00在学校报告厅举办\"青少年情绪管理与压力应对\"专题讲座。本次讲座将通过案例分析、互动问答等形式，为同学们提供实用的情绪调节技巧和压力应对策略。欢迎全体学生及家长积极参加，共同关注青少年的心理健康。期待您的到来，让我们一起学习如何更好地管理情绪，拥抱积极人生！" },
];

const donutData = [
  { name: "已读", value: 10 }, // 示例数据
  { name: "未读", value: 3 },  // 示例数据
];
const donutColors = ["#4F8CFF", "#E3E8F0"];

export default function NotificationTrackerPage() {
  const [showContentModal, setShowContentModal] = useState(false);
  const [currentNotificationContent, setCurrentNotificationContent] = useState('');

  const handleViewContent = (content: string) => {
    setCurrentNotificationContent(content);
    setShowContentModal(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100"
    >
      {/* 顶部导航栏 */}
      <nav className="relative z-10 flex items-center justify-between bg-white/40 backdrop-blur-2xl border-b border-blue-100 px-8 py-4 mt-6 mb-8 shadow-lg rounded-[2.5rem] min-h-[72px] ring-2 ring-white/40 max-w-7xl w-full mx-auto" style={{boxShadow:'0 4px 32px 0 rgba(31,38,135,0.18),0 0 24px 2px #fff6,0 0 0 2px #fff4 inset',backdropFilter:'blur(24px)'}}>
        {/* 左侧logo (New SVG Logo) */}
        <div className="absolute left-8 flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="8" width="24" height="16" rx="8" fill="#4F8CFF"/>
            <ellipse cx="12" cy="16" rx="2.5" ry="3" fill="#fff"/>
            <ellipse cx="20" cy="16" rx="2.5" ry="3" fill="#fff"/>
            <rect x="13.5" y="21" width="5" height="2" rx="1" fill="#fff"/>
            <circle cx="16" cy="16" r="15" stroke="#4F8CFF" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        {/* 标题居中 (Restored to Center) */}
        <span
          className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-blue-900 tracking-wide select-none drop-shadow text-center"
          style={{fontFamily: `'Quicksand', 'Nunito', 'Noto Sans Rounded', 'Noto Sans SC', 'Poppins', 'Microsoft YaHei', 'sans-serif'`,letterSpacing: 1,fontWeight: 700}}
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
                <button onClick={() => handleViewContent(n.content)} className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium shadow border border-blue-100 transition">查看具体通知内容</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 通知内容模态框 */}
      {showContentModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
            <h3 className="text-xl font-bold text-blue-900 mb-4">通知内容</h3>
            <p className="text-gray-700 whitespace-pre-wrap mb-6">{currentNotificationContent}</p>
            <button
              onClick={() => setShowContentModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full mt-6">
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow border border-blue-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-blue-900">回复优化助手</h3>
            <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">新功能</span>
          </div>
          <p className="text-gray-600 mb-4">教师可以针对系统外的提问手动输入进行回复优化</p>
          <div className="flex items-center text-blue-600">
            <span className="text-sm font-medium">立即使用</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
} 
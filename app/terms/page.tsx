"use client";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center py-10 px-4"
      style={{
        background: 'radial-gradient(circle at 30% 40%, rgba(182, 214, 255, 0.7) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(232, 230, 255, 0.7) 0%, transparent 50%), white',
      }}
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">使用条款</h1>
        <p className="text-gray-700 mb-4">
          欢迎使用AI家校沟通助手。在使用本服务前，请仔细阅读以下使用条款。
        </p>

        <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-6">服务内容与限制</h2>
         <p className="text-gray-700 mb-4">
          本网页服务内容仅供相关科研实验使用，旨在为AI助教的研发提供数据支持。禁止将本服务用于任何非法或未经授权的目的。
        </p>

        <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-6">用户行为规范</h2>
        <p className="text-gray-700 mb-4">
          您承诺在使用本服务时遵守所有适用的法律法规，不发布任何侵犯他人权利、具有攻击性或非法内容。所有页面上的沟通信息均会在允许的情况下才会上传和使用，您对此表示同意。
        </p>

         <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-6">隐私与数据使用</h2>
        <p className="text-gray-700 mb-4">
          我们尊重并保护您的隐私。AI的使用及沟通数据将仅用于科研目的，不会进行任何形式的泄露。详细信息请参阅我们的<Link href="/privacy" className="text-blue-600 hover:underline">隐私政策</Link>。
        </p>

        <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-6">通用使用条款</h2>
        <p className="text-gray-700 mb-4">
          除了上述特定说明外，本服务的使用还遵循通用的互联网服务使用条款，包括但不限于：
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-6">
          <li>知识产权</li>
          <li>免责声明</li>
          <li>责任限制</li>
          <li>服务中断与终止</li>
          <li>链接到第三方网站</li>
          <li>条款的修订</li>
        </ul>
        <p className="text-gray-700 mb-4">
          有关这些通用条款的详细信息，请参阅下文的详细说明或与我们联系。
        </p>

        {/* 您可以在此处添加详细的通用使用条款内容 */}
        <div className="bg-gray-100 p-4 rounded-lg text-gray-600 text-sm italic mb-6">
          [此处是通用使用条款的详细内容，应包括关于知识产权、免责声明、责任限制、服务中断与终止、第三方网站链接、条款修订等具体章节。在实际应用中，需要根据具体服务内容和法律法规进行详细撰写。]
        </div>

        <div className="mt-8 text-center">
           <Link href="/settings" className="text-blue-600 hover:underline">返回设置</Link>
        </div>

      </div>
    </div>
  );
} 
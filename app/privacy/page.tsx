"use client";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center py-10 px-4"
      style={{
        background: 'radial-gradient(circle at 30% 40%, rgba(182, 214, 255, 0.7) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(232, 230, 255, 0.7) 0%, transparent 50%), white',
      }}
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">隐私政策</h1>
        <p className="text-gray-700 mb-4">
          欢迎使用AI家校沟通助手。我们深知隐私对您的重要性，并致力于保护您的个人信息。
        </p>

        <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-6">我们如何使用您的数据</h2>
        <p className="text-gray-700 mb-4">
          本网页服务内容仅供相关科研实验提供数据，所有收集到的数据将用于提升AI助教的功能和性能。我们承诺，未经您明确同意，您的个人信息不会以任何其他目的被使用或泄露。
        </p>

        <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-6">信息互通与隐私保护</h2>
        <p className="text-gray-700 mb-4">
          我们严格保护家长和教师双方的使用信息，确保信息不会非法互通。所有在平台上的沟通信息，只有在符合相关法律法规并获得您允许的情况下，才会被上传和用于科研目的。
        </p>

        <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-6">AI使用与数据安全</h2>
        <p className="text-gray-700 mb-4">
          在使用AI功能及处理沟通数据时，我们采取严格的安全措施，确保数据不会发生任何形式的泄露。
        </p>

        <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-6">通用隐私政策条款</h2>
        <p className="text-gray-700 mb-4">
          除了上述特定说明外，我们还遵循通用的互联网隐私政策原则，包括但不限于：
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-6">
          <li>信息收集的类型与目的</li>
          <li>Cookie及类似技术的使用</li>
          <li>第三方服务提供商</li>
          <li>您的权利与选择</li>
          <li>数据安全措施</li>
          <li>隐私政策的更新</li>
        </ul>
         <p className="text-gray-700 mb-4">
          有关这些通用条款的详细信息，请参阅下文的详细说明或与我们联系。
        </p>

        {/* 您可以在此处添加详细的通用隐私政策内容 */}
        <div className="bg-gray-100 p-4 rounded-lg text-gray-600 text-sm italic mb-6">
          [此处是通用隐私政策的详细内容，应包括关于信息收集、使用、保护、Cookie、第三方服务、用户权利、条款更新等具体章节。在实际应用中，需要根据具体服务内容和法律法规进行详细撰写。]
        </div>

        <div className="mt-8 text-center">
           <Link href="/settings" className="text-blue-600 hover:underline">返回设置</Link>
        </div>

      </div>
    </div>
  );
} 
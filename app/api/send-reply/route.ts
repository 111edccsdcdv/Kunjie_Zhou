import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received reply data:', data);

    // 在这里可以添加逻辑来将回复数据保存到数据库或进行其他处理
    // 例如：
    // await saveReplyToDatabase(data.questionId, data.replyContent, data.teacherId, data.groupId);

    return NextResponse.json({ message: 'Reply sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error processing reply:', error);
    return NextResponse.json({ error: 'Failed to process reply' }, { status: 500 });
  }
} 
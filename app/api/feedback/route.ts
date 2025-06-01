import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const feedbackData = await request.json();
    console.log('Received feedback:', feedbackData);

    // 在这里可以添加将反馈发送到实际后端或存储的逻辑
    // 目前仅模拟成功响应
    return NextResponse.json({ message: 'Feedback received successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error receiving feedback:', error);
    return NextResponse.json({ message: 'Failed to receive feedback.' }, { status: 500 });
  }
} 
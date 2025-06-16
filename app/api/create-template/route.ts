import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received template data:', data);

    // 在这里可以添加逻辑来将模板数据保存到数据库或进行其他处理
    // 例如：
    // await saveTemplateToDatabase(data.content, data.teacherId);

    return NextResponse.json({ message: 'Template created successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error processing template creation:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
} 
// app/api/frameworks/route.ts
import { NextResponse } from 'next/server';
import { frameworkRegistry } from '@/server/frameworks/registry';

export async function POST(req: Request) {
  const body = await req.json();
  console.log('API Request Body:', body);
  const { framework, data } = body;

  if (!framework || !frameworkRegistry[framework]) {
    console.error('Framework not found:', framework);
    return NextResponse.json({ error: 'Framework not found' }, { status: 404 });
  }

  const result = frameworkRegistry[framework](data);
  return NextResponse.json(result);
}

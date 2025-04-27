import { NextRequest, NextResponse } from 'next/server';
import { IpaWithExamplesDto } from '@clarte/dto';

// app/api/proxy/ipa-symbols.'all
const NESTJS_API_BASE_URL = process.env.NESTJS_API_URL;
if (!NESTJS_API_BASE_URL) {
  console.error(
    'FATAL ERROR: NESTJS_API_URL environment variable is not defined!'
  );
}

export async function GET(request: NextRequest) {
  if (!NESTJS_API_BASE_URL) {
    return NextResponse.json(
      { message: 'API backend endpoint is not configured on the server.' },
      { status: 500 }
    );
  }
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');
    const targetUrl = new URL(`/ipa-symbols/all`, NESTJS_API_BASE_URL);
    console.log('targetUrl:' + targetUrl);
    if (limit !== null) {
      targetUrl.searchParams.append('limit', limit);
    }
    console.log(`[API Route] Fetching from backend: ${targetUrl.toString()}`);

    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        // Add Authorization header if your backend requires it
        // 'Authorization': `Bearer ${process.env.BACKEND_API_TOKEN}`
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        `[API Route] Backend request failed: ${response.status} ${response.statusText}`,
        { url: targetUrl.toString(), responseBody: errorData }
      );
      return NextResponse.json(
        {
          message: `Failed to fetch data from backend: ${response.statusText}`,
        },
        { status: response.status }
      );
    }
    const data: IpaWithExamplesDto[] = await response.json();

    // 7. Return the data successfully to the client
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('[API Route] Unexpected error:', error);
    // Return a generic 500 error for unexpected issues
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

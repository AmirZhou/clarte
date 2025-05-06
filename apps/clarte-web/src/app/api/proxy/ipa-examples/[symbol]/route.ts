import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  // 1. Read the internal backend API URL from environment variables
  //    set in the k8s web-deployment.yaml
  const backendApiBaseUrl = process.env.NESTJS_API_URL; // locally it's http://clarte.local/api set in .env, in cluster it's set in the deploy yaml as a run time var together with NODE_ENV, HOST, and PORT, and it's using cluster dns as 'http://clarte-api-svc:80'

  if (!backendApiBaseUrl) {
    console.error(
      '[Proxy Route Handler] FATAL ERROR: Backend API URL environment variable is not defined!'
    );
    return NextResponse.json(
      { message: 'API backend endpoint is not configured on the server.' },
      { status: 503 } // Service Unavailable might be appropriate
    );
  }

  // 2. Extract parameters needed for the backend call
  const symbol = params.symbol; // Get symbol from the dynamic route segment
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit'); // Get limit from query params

  // 3. Construct the target URL for the actual backend service
  const targetUrl = new URL(
    `${backendApiBaseUrl}/ipa-symbols/${symbol}/examples`,
    backendApiBaseUrl
  );
  if (limit) {
    targetUrl.searchParams.append('limit', limit);
  }
  console.log(
    `[Proxy Route Handler] Forwarding request to backend: ${targetUrl.toString()}`
  );

  try {
    // 4. Make the fetch request to the internal backend service
    const backendResponse = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        // Add any other headers needed for the backend,
        // potentially forwarding headers from the original request if necessary
      },
      cache: 'no-store', // Ensure fresh data is fetched from the backend
    });

    // 5. Handle the backend response
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(
        `[Proxy Route Handler] Backend request failed: ${backendResponse.status} ${backendResponse.statusText}`,
        { url: targetUrl.toString(), errorText }
      );
      // Return an appropriate error response to the client
      return NextResponse.json(
        { message: `Backend error: ${backendResponse.statusText}` },
        { status: backendResponse.status } // Forward the status code
      );
    }
    // 6. Stream or parse the backend response and return it to the client
    const data = await backendResponse.json();
    console.log(data);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('[Proxy Route Handler] Fetch error:', {
      url: targetUrl.toString(),
      error,
    });
    return NextResponse.json(
      {
        message:
          'An internal server error occurred while contacting the backend.',
      },
      { status: 500 } // Internal Server Error
    );
  }
}

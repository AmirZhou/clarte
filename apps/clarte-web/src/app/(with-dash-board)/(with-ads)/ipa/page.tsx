export const dynamic = 'force-dynamic';

import { IpaWithExamplesDto } from '@clarte/dto';
import IpaInteractionWrapper from './components/IpaInteractionWrapper';

async function getIpaData(): Promise<IpaWithExamplesDto[]> {
  // Read the environment variable pointing to the K8s service for the backend
  const backendApiBaseUrl = process.env.NESTJS_API_URL; // Use the name you set in web-deployment.yaml

  if (!backendApiBaseUrl) {
    console.error(
      '[Page Server] Backend API URL (NESTJS_API_URL) is not configured.'
    );
    // In a real app, you might want to throw an error here
    return [];
  }
  const targetUrl = new URL(`${backendApiBaseUrl}/ipa-symbols/all`);
  console.log(`Base Url: ${backendApiBaseUrl}`);
  console.log(`TargetUrl: ${targetUrl}`);
  const limit = '30'; // Replace with dynamic value if necessary
  if (limit) {
    targetUrl.searchParams.append('limit', limit);
  }
  try {
    // Log the URL we are actually trying to fetch
    console.log(
      `[Page Server] Fetching directly from backend: ${targetUrl.toString()}`
    );

    const response = await fetch(targetUrl.toString(), {
      // Fetch the backend directly
      method: 'GET',
      headers: { Accept: 'application/json' },
      // Important for server-to-server calls within the cluster during dev/test
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text(); // Read error text from backend
      console.error(
        `[Page Server] Backend fetch failed: ${response.status} ${response.statusText}`,
        { url: targetUrl.toString(), errorText }
      );
      return [];
    }

    const data: IpaWithExamplesDto[] = await response.json();
    console.log(`[Page Server] Successfully fetched ${data.length} items.`); // Log success
    return data;
  } catch (error) {
    // Log network errors or other fetch issues
    console.error('[Page Server] Fetch error:', {
      url: targetUrl.toString(),
      error,
    });
    return []; // Return empty on error or re-throw
  }
  // const internalApiUrl = `http://127.0.0.1:${process.env.PORT}/api/proxy/ipa-symbols/all`; // Use Route Handler

  // try {
  //   console.log(`[Page Server] Fetching from: ${internalApiUrl}`);

  //   const response = await fetch(internalApiUrl, {
  //     method: 'GET',
  //     headers: { Accept: 'application/json' },
  //   });

  //   if (!response.ok) {
  //     console.error(`[Page Server] Backend fetch failed: ${response.status}`);
  //     return [];
  //   }
  //   const data: IpaWithExamplesDto[] = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error('[Page Server] Fetch error:', error);
  //   return []; // Return empty on error or re-throw
  // }
}

export default async function Page() {
  const allSymbolsWithExamples = await getIpaData();

  return (
    <>
      <IpaInteractionWrapper symbolsData={allSymbolsWithExamples} />
    </>
  );
}

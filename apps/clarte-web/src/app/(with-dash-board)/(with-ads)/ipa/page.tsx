export const dynamic = 'force-dynamic';

import { IpaWithExamplesDto, IpaWithoutExamplesDto } from '@clarte/dto';
import IpaInteractionWrapper from './components/IpaInteractionWrapper';

async function getSymbolsList(): Promise<IpaWithoutExamplesDto[]> {
  const backendApiBaseUrl = process.env.NESTJS_API_URL;
  if (!backendApiBaseUrl) {
    console.error(
      '[Page Server] Backend API URL environment variable is not configured.'
    );
    return []; // Return empty array on configuration error
  }

  // Construct URL for the backend endpoint that returns the list WITHOUT examples
  const targetUrl = new URL(`${backendApiBaseUrl}/ipa-symbols/symbols-list`);

  try {
    console.log(
      `[Page Server] Fetching symbol list from backend: ${targetUrl.toString()}`
    );
    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[Page Server] Backend fetch for symbol list failed: ${response.status} ${response.statusText}`,
        { url: targetUrl.toString(), errorText }
      );
      return [];
    }
    const data: IpaWithoutExamplesDto[] = await response.json();
    console.log(`[Page Server] Successfully fetched ${data.length} symbols.`);
    return data;
  } catch (error) {
    console.error('[Page Server] Fetch error for symbol list:', {
      url: targetUrl.toString(),
      error,
    });
    return [];
  }
}

export default async function Page() {
  const symbolsList = await getSymbolsList();

  return (
    <div className="w-full">
      <IpaInteractionWrapper symbolsData={symbolsList} />
    </div>
  );
}

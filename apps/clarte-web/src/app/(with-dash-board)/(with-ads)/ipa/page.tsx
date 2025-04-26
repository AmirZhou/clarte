import IPAInfo from './components/IPAInfo';
import { IpaWithExamplesDto } from '@clarte/dto';
import { IPASymbolIcon } from '@/components/icons';
import IpaInteractionWrapper from './components/IpaInteractionWrapper';

async function getIpaData(): Promise<IpaWithExamplesDto[]> {
  const internalApiUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `https://${process.env.NEXT_PUBLIC_SITE_URLL}/api/proxy/ipa-symbols/all` // Use Route Handler
    : 'http://localhost:3000/api/proxy/ipa-symbols/all'; // Fallback for local dev

  try {
    console.log(`[Page Server] Fetching from: ${internalApiUrl}`);

    const response = await fetch(internalApiUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      console.error(`[Page Server] Backend fetch failed: ${response.status}`);
      return [];
    }
    const data: IpaWithExamplesDto[] = await response.json();
    return data;
  } catch (error) {
    console.error('[Page Server] Fetch error:', error);
    return []; // Return empty on error or re-throw
  }
}

export default async function Page() {
  const allSymbolsWithExamples = await getIpaData();

  return (
    <>
      <IpaInteractionWrapper symbolsData={allSymbolsWithExamples} />
    </>
  );
}

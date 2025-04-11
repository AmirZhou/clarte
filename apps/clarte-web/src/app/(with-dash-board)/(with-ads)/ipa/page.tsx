import IPAInfo from './components/IPAInfo';
import { IpaWithExamplesDto } from '@clarte/dto';
import { IPASymbolIcon } from '@/components/icons';

async function getIpaData(): Promise<IpaWithExamplesDto[]> {
  const internalApiUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/proxy/ipa-symbols/all` // Use Route Handler
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
  console.log(allSymbolsWithExamples);

  return (
    <div className="flex gap-16 w-full justify-center">
      <div className="w-1/2 flex flex-col gap-4">
        <h2 className="text-2xl">French IPA Chart</h2>
        <div className="ipa-full-chart flex flex-wrap gap-2 justify-center">
          {/* Added flex, flex-wrap, gap-2 and justify-center for layout */}
          {allSymbolsWithExamples.map((symbol) => (
            <IPASymbolIcon key={symbol.id} symbol={symbol.symbol} />
          ))}
        </div>
      </div>
      <IPAInfo />
    </div>
  );
}

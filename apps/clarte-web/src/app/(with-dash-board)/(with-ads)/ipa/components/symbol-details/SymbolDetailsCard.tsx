/**
 * SymbolDetailsCard.tsx
 *
 * Component Description:
 * -----------------------
 * A container component that displays details for a selected symbol.
 * It receives the `selectedSymbol` object and an array of `examples`, along with
 * loading and error states. It displays the symbol's information and delegates
 * the rendering of the examples list to a child component.
 *
 * Purpose:
 * --------
 * To encapsulate and visually organize symbol-specific information in a card layout.
 *
 * Props:
 * - symbol: IpaWithoutExamplesDto
 * - examples: FetchedExample[]
 * - isLoading: boolean
 * - error: string | null
 *
 * Author: [Amir Yue Zhou]
 * Created: [May7,2025]
 */

// do I need to set useClient, what trade-offs here?
import { IpaWithoutExamplesDto } from '@clarte/dto';
import { FetchedExample } from '../IpaInteractionWrapper';
import ExampleList from './ExampleList';

interface SymbolDetailsCardProps {
  symbolData: IpaWithoutExamplesDto;
  examples: FetchedExample[];
  isLoadingExamples: boolean;
  errorMessage: string | null;
}

export function SymbolDetailsCard({
  symbolData,
  examples, // use the examples to populate the ExampleList components, which maps to ExampleItem, which nests an ExampleAudioPlayer component
  isLoadingExamples, // this is received from the IpaInteractionWrapper, and is used to optional display the Examples list.
  errorMessage, // also received from the top, display an error rather than a list if something failed.
}: SymbolDetailsCardProps) {
  return (
    <div className="w-96 h-[480px] p-12 bg-card text-card-foreground rounded-3xl">
      <h2 className="text-center text-9xl">{symbolData.symbol}</h2>
      <ExampleList
        examples={examples}
        isLoadingExamples={isLoadingExamples}
        errorMessage={errorMessage}
      />
    </div>
  );
}

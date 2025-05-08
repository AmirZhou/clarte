import { FetchedExample } from '../IpaInteractionWrapper';


interface ExampleListProp {
  examples?: FetchedExample[];
  isLoadingExamples: boolean; // when this change, the component refresh itself, any concerns?
  errorMessage: string | null;
}

export function ExampleList({
  examples,
  isLoadingExamples,
  errorMessage,
}: ExampleListProp) {
  // this should be the gsap controller's place
  // useGsap
  // pass ref to those ExampleItem
}

import { FetchedExample } from '../IpaInteractionWrapper';

interface ExampleItemProp {
  example: FetchedExample;
  isActive: boolean;
}

export default function ExampleItem({ example, isActive }: ExampleItemProp) {
  return (
    <div>
      <p>{example.frenchEntry}</p>
      <p>{example.ipaNotation}</p>
    </div>
  );
}

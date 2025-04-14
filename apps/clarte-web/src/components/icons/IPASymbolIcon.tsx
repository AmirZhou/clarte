import { cn } from '@/utils/cn';

interface IPASymbolIconProps extends React.ComponentProps<'div'> {
  symbol: string;
}

export function IPASymbolIcon({
  symbol,
  className,
  ...props
}: IPASymbolIconProps) {
  return (
    <div className="p-[2px] rounded-full bg-gradient-to-br from-[#ffffff40] to-[#ffffff10]">
      <div
        ref={props.ref || null}
        className={cn(
          'w-12 h-12 flex items-center justify-center text-center text-2xl hover:text-emerald-500 font-ipa font-bold rounded-full text-emerald-400',
          'bg-linear-to-br from-[#ffffff40] from-5% to-[#ffffff10] to-90%',
          'backdrop-blur-md transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/40 hover:scale-105',
          className
        )}
        {...props}
      >
        {symbol}
      </div>
    </div>
  );
}

IPASymbolIcon.displayName = 'IPASymbolIcon';

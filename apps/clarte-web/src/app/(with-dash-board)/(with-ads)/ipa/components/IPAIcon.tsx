'use client';
import { useRef } from 'react';
import { SVGIcon } from '@/components/icons';
import { IPA } from '@/types';

interface IPAIconProps {
  ipa: IPA;
  onSelect: (ipa: IPA) => void;
  isActive: boolean;
}

export default function IPAIcon({ ipa, isActive, onSelect }: IPAIconProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleClick = () => {
    if (audioRef.current) {
      // currently it will not replay the sound if it is already playing
      audioRef.current.play();
    }
    onSelect(ipa);
  };

  return (
    <>
      <audio ref={audioRef} src={`/ipa-sounds/${ipa.name}.mp3`} />
      <div
        className={`flex justify-center items-center rounded-full h-9 w-9 cursor-pointer transition-colors duration-200 ${
          isActive
            ? 'bg-red-400' // Active state background
            : 'bg-red-300 hover:bg-red-200' // Default and hover state background
        }`}
        onClick={handleClick}
      >
        <SVGIcon
          className={`w-4 h-4 stroke-0 transition-colors duration-75 ${
            isActive
              ? 'fill-amber-200' // Active state fill
              : 'fill-emerald-700 hover:fill-emerald-600' // Default and hover state fill
          }`}
          name={ipa.name}
          path={ipa.path}
          viewBox={ipa.viewbox}
        />
      </div>
    </>
  );
}

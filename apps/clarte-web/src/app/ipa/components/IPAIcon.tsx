'use client';
import { useRef } from 'react';
import { SVGIcon } from '@/components/icons';

interface IPAIconProps {
  ipa: {
    path: string;
    viewbox: string;
    name: string;
  };
}

export default function IPAIcon({ ipa }: IPAIconProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <>
      <audio ref={audioRef} src={`/ipa-sounds/${ipa.name}.mp3`} />
      <div
        className="flex justify-center items-center rounded-full bg-red-300 h-16 w-16"
        onClick={handleClick}
      >
        <SVGIcon
          className="w-6 h-6 stroke-0 fill-emerald-700"
          name={ipa.name}
          path={ipa.path}
          viewBox={ipa.viewbox}
        />
      </div>
    </>
  );
}

// components/ExampleList.tsx
'use client';

import { FetchedExample } from '../IpaInteractionWrapper'; // Adjust path if needed
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ExampleItem from './ExampleItem'; // Ensure this component is created

gsap.registerPlugin(useGSAP);

interface ExampleListProp {
  examples?: FetchedExample[];
  isLoadingExamples: boolean;
  errorMessage: string | null;
}

export default function ExampleList({
  examples = [],
  isLoadingExamples,
  errorMessage,
}: ExampleListProp) {
  const renderCount = useRef(0);
  renderCount.current += 1;
  const prevExamplesRef = useRef(examples);
  // console.log(`[Render #${renderCount.current}] START. examples: ${examples.length}, isLoading: ${isLoadingExamples}, currentIndex: ${currentIndex}, isGsapSetupDone: ${isGsapSetupDone}`);

  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTweening, setIsTweening] = useState(false);
  const [isGsapSetupDone, setIsGsapSetupDone] = useState(false);

  // Effect 1: Reset core carousel state when 'examples' prop reference changes
  useEffect(() => {
    if (prevExamplesRef.current !== examples) {
      console.log(
        `[useEffect examples] Examples prop changed. New examples length: ${examples.length}. Resetting internal state.`
      );
      slidesRef.current = [];
      setCurrentIndex(0);
      setIsGsapSetupDone(false);
      prevExamplesRef.current = examples;
    }
  }, [examples]);

  // Callback ref to populate slidesRef.current. Does NOT set state.
  const assignSlideRef = useCallback((el: HTMLDivElement | null) => {
    if (el && !slidesRef.current.includes(el)) {
      slidesRef.current.push(el);
      console.log(
        `[assignSlideRef] Added ref. Total refs: ${slidesRef.current.length} / Expected: ${examples.length}`
      );
    }
  }, []); // Stable callback

  // Effect 2: Set isGsapSetupDone after all refs are collected for the current examples.
  useLayoutEffect(() => {
    console.log(
      `[useLayoutEffect] Checking refs. examples.length: ${examples.length}, slidesRef.current.length: ${slidesRef.current.length}, current isGsapSetupDone: ${isGsapSetupDone}`
    );

    if (examples.length > 0 && slidesRef.current.length === examples.length) {
      if (!isGsapSetupDone) {
        // Only set if changing from false to true
        console.log(
          '[useLayoutEffect] All refs collected. Setting isGsapSetupDone = true.'
        );
        setIsGsapSetupDone(true);
      }
    } else if (examples.length === 0) {
      // No examples, consider setup "done" as there's nothing to set up.
      if (!isGsapSetupDone) {
        // If it was false, set to true.
        console.log(
          '[useLayoutEffect] No examples. Setting isGsapSetupDone = true (base state).'
        );
        setIsGsapSetupDone(true);
      }
    }
    // If examples.length > 0 but refs not yet collected, isGsapSetupDone remains false (due to useEffect[examples] reset).
  }, [examples.length, slidesRef.current.length, isGsapSetupDone]); // Rerun if these change

  // Effect 3: GSAP setup for initial slide positions and reacting to currentIndex changes
  const { contextSafe } = useGSAP(
    () => {
      console.log(
        `[useGSAP] Fired. isGsapSetupDone: ${isGsapSetupDone}, examples.length: ${examples.length}, slidesRef.current.length: ${slidesRef.current.length}, currentIndex: ${currentIndex}`
      );

      // Guard: Only run if GSAP setup is marked as done and refs match examples
      if (!isGsapSetupDone || slidesRef.current.length !== examples.length) {
        console.log(
          '[useGSAP] Guarded: Conditions not met for applying GSAP styles (isGsapSetupDone is false or refs mismatch).'
        );
        return;
      }
      if (examples.length === 0) {
        console.log('[useGSAP] No examples to set up styles for.');
        return;
      }

      const slides = slidesRef.current;
      console.log(
        `[useGSAP Setup] Applying positions for ${slides.length} slides. CurrentIndex: ${currentIndex}`
      );
      slides.forEach((slide, i) => {
        gsap.set(slide, {
          xPercent: i === currentIndex ? 0 : i < currentIndex ? -100 : 100,
          opacity: i === currentIndex ? 1 : 0,
          position: i === currentIndex ? 'relative' : 'absolute',
          willChange: 'transform, opacity',
        });
      });
    },
    // Dependencies: Re-run when currentIndex changes or when isGsapSetupDone becomes true.
    { scope: containerRef, dependencies: [currentIndex, isGsapSetupDone] }
    // 'examples' is removed from here; its change flows through the other effects to update isGsapSetupDone.
  );

  const goToSlide = contextSafe((direction: number) => {
    console.log(
      `[goToSlide] Called. isTweening: ${isTweening}, isGsapSetupDone: ${isGsapSetupDone}, examples.length: ${examples.length}, currentIndex: ${currentIndex}`
    );
    if (isTweening || examples.length <= 1 || !isGsapSetupDone) {
      console.warn(
        `[goToSlide] Aborted: isTweening=${isTweening}, examples.length=${examples.length}, isGsapSetupDone=${isGsapSetupDone}`
      );
      return;
    }

    const slides = slidesRef.current;
    if (
      slides.length !== examples.length ||
      !slides[currentIndex] ||
      (examples.length > 0 && !slides[0])
    ) {
      console.warn(
        `[goToSlide] Aborted: Slide array integrity issue. slides.length=${slides.length}, examples.length=${examples.length}, currentIndex=${currentIndex}`
      );
      setIsTweening(false);
      return;
    }

    const currentSlideElement = slides[currentIndex];
    let nextIndex = currentIndex + direction;

    if (nextIndex >= examples.length) nextIndex = 0;
    else if (nextIndex < 0) nextIndex = examples.length - 1;

    if (!slides[nextIndex]) {
      console.error(
        `[goToSlide] Error: nextSlideElement at index ${nextIndex} is undefined.`
      );
      setIsTweening(false);
      return;
    }
    const nextSlideElement = slides[nextIndex];
    setIsTweening(true);
    console.log(
      `[goToSlide] Animating from index ${currentIndex} to ${nextIndex}`
    );

    gsap.set(nextSlideElement, {
      xPercent: direction > 0 ? 100 : -100,
      opacity: 1,
      position: 'relative',
      zIndex: 1,
      willChange: 'transform, opacity',
    });
    gsap.set(currentSlideElement, {
      zIndex: 0,
      position: 'absolute',
      willChange: 'transform, opacity',
    });

    gsap.to(currentSlideElement, {
      xPercent: direction > 0 ? -100 : 100,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        console.log(
          `[goToSlide] currentSlide (index ${currentIndex}) animation complete.`
        );
        gsap.set(currentSlideElement, {
          position: 'absolute',
          opacity: 0,
          willChange: 'auto',
        });
      },
    });

    gsap.to(nextSlideElement, {
      xPercent: 0,
      opacity: 1,
      duration: 0.5,
      onComplete: () => {
        console.log(
          `[goToSlide] nextSlide (index ${nextIndex}) animation complete. Updating currentIndex.`
        );
        setCurrentIndex(nextIndex);
        setIsTweening(false);
        gsap.set(nextSlideElement, { willChange: 'auto' });
      },
    });
  });

  // console.log(`[ExampleList Render] Before return. isLoading: ${isLoadingExamples}, error: ${errorMessage}, examplesCount: ${examples.length}, isGsapSetupDone: ${isGsapSetupDone}`);

  if (isLoadingExamples) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        <p>Loading examples...</p>
      </div>
    );
  }
  if (errorMessage) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        <p>Error: {errorMessage}</p>
      </div>
    );
  }
  if (examples.length === 0 && !isLoadingExamples) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        <p>No examples found.</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-4 w-full max-w-md items-center p-4 border"
      ref={containerRef}
    >
      <div className="example-slides-container relative w-full h-48 md:h-56 overflow-hidden rounded-lg shadow-lg bg-gray-800">
        {examples.map((example, i) => (
          <div
            key={example.id}
            ref={assignSlideRef}
            className="example-slide-item absolute inset-0 w-full h-full flex justify-center items-center"
          >
            <ExampleItem example={example} isActive={i === currentIndex} />
          </div>
        ))}
      </div>
      {examples.length > 1 && (
        <div className="flex flex-row justify-between items-center w-full mt-2 px-2">
          <button
            onClick={() => goToSlide(-1)}
            disabled={isTweening || !isGsapSetupDone}
            className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors disabled:opacity-50"
            aria-label="Previous example"
          >
            <ChevronLeft size={28} />
          </button>
          <p className="text-sm text-gray-600 select-none">
            Example {currentIndex + 1} / {examples.length}
          </p>
          <button
            onClick={() => goToSlide(1)}
            disabled={isTweening || !isGsapSetupDone}
            className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors disabled:opacity-50"
            aria-label="Next example"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
}

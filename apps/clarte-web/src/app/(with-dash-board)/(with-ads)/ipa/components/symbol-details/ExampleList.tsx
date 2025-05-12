'use client';

import { FetchedExample } from '../IpaInteractionWrapper';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ExampleItem from './ExampleItem';

gsap.registerPlugin(useGSAP); // register the hook to avoid React version discrepancies
interface ExampleListProp {
  examples?: FetchedExample[];
  isLoadingExamples: boolean; // when this change, the component refresh itself, any concerns?
  errorMessage: string | null;
}

export default function ExampleList({
  examples = [],
  isLoadingExamples,
  errorMessage,
}: ExampleListProp) {
  // Two essential refs gsap work with
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTweening, setIsTweening] = useState(false);
  const [refsReady, setRefsReady] = useState(false);

  const assignSlideRef = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      // Add to ref array if not already present for this element
      // (Helps avoid duplicates if React reuses elements, though less likely with key changes)
      if (!slidesRef.current.find((refEl) => refEl === el)) {
        slidesRef.current.push(el);
      }
    }
    // After potential ref assignments (during render), check if all refs are collected
    // This check is more reliable if done in a layout effect or after all items are mapped
    // For simplicity here, we'll rely on useGSAP's dependency on 'examples' and 'refsReady'
  }, []); // No dependencies, this function itself doesn't change

  // Effect to reset slides and current index when 'examples' prop changes
  useEffect(() => {
    slidesRef.current = []; // Clear out old refs
    setCurrentIndex(0); // Reset to the first slide
    setRefsReady(false); // Mark refs as not ready for the new set
    // The actual collection of new refs will happen during the render triggered by this effect
  }, [examples]);

  // Effect to check if all refs are collected after a render based on 'examples'
  useEffect(() => {
    if (
      examples &&
      examples.length > 0 &&
      slidesRef.current.length === examples.length
    ) {
      setRefsReady(true);
    } else if (examples && examples.length === 0) {
      setRefsReady(true); // Ready in the sense that there's nothing to set up
    } else {
      setRefsReady(false);
    }
  }, [examples, slidesRef.current.length]); // Re-run when examples or the collected refs count changes

  const { contextSafe } = useGSAP(
    () => {
      // Guard: Only run if we have examples, refs are ready, and lengths match
      if (
        !refsReady ||
        !examples ||
        examples.length === 0 ||
        slidesRef.current.length !== examples.length
      ) {
        // Don't run GSAP if no examples or if refs aren't fully populated yet
        return;
      }

      const slides = slidesRef.current;
      console.log(
        `[GSAP Setup] Initializing ${slides.length} slides. CurrentIndex: ${currentIndex}`
      );
      // Initial setup: position all slides
      // Only the current slide is visible and in normal flow
      // Others are stacked absolutely and hidden, ready to be animated in.
      slides.forEach((slide, i) => {
        gsap.set(slide, {
          xPercent: i === currentIndex ? 0 : i < currentIndex ? -100 : 100,
          opacity: i === currentIndex ? 1 : 0,
          position: i === currentIndex ? 'relative' : 'absolute',
          willChange: 'transform, opacity',
        });
      });
    },
    { scope: containerRef, dependencies: [examples, currentIndex, refsReady] }
  );

  const goToSlide = contextSafe((direction: number) => {
    if (isTweening || !examples || examples.length <= 1 || !refsReady) {
      console.warn(
        'GSAP goToSlide: Tweening, no/few examples, or refs not ready.'
      );
      return;
    }

    const slides = slidesRef.current;
    // Safety check for slides and current index
    if (
      slides.length === 0 ||
      currentIndex < 0 ||
      currentIndex >= slides.length ||
      !slides[currentIndex]
    ) {
      console.warn(
        'GSAP goToSlide: Invalid current slide or slides array empty.'
      );
      setIsTweening(false);
      return;
    }
    const currentSlideElement = slides[currentIndex];
    let nextIndex = currentIndex + direction;

    // Loop around
    if (nextIndex >= examples.length) {
      nextIndex = 0;
    } else if (nextIndex < 0) {
      nextIndex = examples.length - 1;
    }
    // Safety check for next slide
    if (nextIndex < 0 || nextIndex >= slides.length || !slides[nextIndex]) {
      console.warn('GSAP goToSlide: Invalid next slide index.');
      setIsTweening(false);
      return;
    }
    const nextSlideElement = slides[nextIndex];
    setIsTweening(true); // Set tweening true only if we proceed

    // Prepare the next slide (position it off-screen and make it visible)
    // and ensure it's on top for the transition
    gsap.set(nextSlideElement, {
      xPercent: direction > 0 ? 100 : -100,
      opacity: 1,
      position: 'relative', // Bring to front for animation
      zIndex: 1,
      willChange: 'transform, opacity', // Hint browser during animation
    });

    gsap.set(currentSlideElement, {
      zIndex: 0,
      position: 'absolute', // Keep current slide in flow but allow next to slide over
      willChange: 'transform, opacity', // Hint browser during animation
    });
    // Animate current slide out
    gsap.to(currentSlideElement, {
      xPercent: direction > 0 ? -100 : 100, // Slide out to left or right
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        // After sliding out, fully hide it and reset its position for potential reuse
        gsap.set(currentSlideElement, {
          position: 'absolute',
          opacity: 0,
          willChange: 'auto',
        });
      },
    });

    // Animate next slide in
    gsap.to(nextSlideElement, {
      xPercent: 0,
      opacity: 1,
      duration: 0.5,
      onComplete: () => {
        setCurrentIndex(nextIndex); // Update the current index
        setIsTweening(false); // Animation finished
        gsap.set(nextSlideElement, { willChange: 'auto' });
      },
    });

    // Handle loading, error, and empty states
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

    if (!examples || examples.length === 0) {
      return (
        <div className="flex justify-center items-center h-full text-gray-500">
          <p>No examples found.</p>
        </div>
      );
    }
  });
  return (
    <div
      className="flex flex-col gap-4 w-full max-w-md items-center p-4 border"
      ref={containerRef}
    >
      {/* Slides container - relative for absolute positioning of slides, overflow hidden for carousel effect */}
      <div className="example-slides-container relative w-full h-48 md:h-56 overflow-hidden rounded-lg shadow-lg bg-gray-800">
        {examples.map((example, i) => (
          <div
            key={example.id} // Use the unique example ID as the key
            ref={assignSlideRef} // Assign ref to each slide div
            className="example-slide-item absolute inset-0 w-full h-full" // Class for potential direct styling
            // Initial styles are mostly set by GSAP
          >
            {/* Pass the example data and isActive status to ExampleItem */}
            <ExampleItem example={example} isActive={i === currentIndex} />
          </div>
        ))}
      </div>

      {/* Animation Controller Container - only show if more than one example */}
      {examples.length > 1 && (
        <div className="flex flex-row justify-between items-center w-full mt-2 px-2">
          <button
            onClick={() => goToSlide(-1)}
            className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            aria-label="Previous example"
          >
            <ChevronLeft size={28} />
          </button>
          <p className="text-sm text-gray-600 select-none">
            Example {currentIndex + 1} / {examples.length}
          </p>
          <button
            onClick={() => goToSlide(1)}
            className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            aria-label="Next example"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
}

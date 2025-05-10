'use client';

import { FetchedExample } from '../IpaInteractionWrapper';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useState, useEffect } from 'react';
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

  // Function to add slide elements to the slidesRef array
  // This is called via the 'ref' prop on each mapped slide
  const assignSlideRef = (el: HTMLDivElement | null) => {
    if (el && !slidesRef.current.includes(el)) {
      slidesRef.current.push(el);
    }
  };
  // Effect to reset slides and current index when 'examples' prop changes
  useEffect(() => {
    slidesRef.current = []; // Clear out old refs
    setCurrentIndex(0); // Reset to the first slide
    // GSAP animations will be re-initialized by the useGSAP hook due to 'examples' dependency
  }, [examples]);

  const { contextSafe } = useGSAP(
    () => {
      if (
        !examples ||
        examples.length === 0 ||
        slidesRef.current.length !== examples.length
      ) {
        // Don't run GSAP if no examples or if refs aren't fully populated yet
        return;
      }

      const slides = slidesRef.current;
      // Initial setup: position all slides
      // Only the current slide is visible and in normal flow
      // Others are stacked absolutely and hidden, ready to be animated in.
      slides.forEach((slide, i) => {
        gsap.set(slide, {
          xPercent: i === currentIndex ? 0 : i < currentIndex ? -100 : 100,
          opacity: i === currentIndex ? 1 : 0,
          position: i === currentIndex ? 'relative' : 'absolute',
        });
      });
    },
    { scope: containerRef, dependencies: [examples, currentIndex] }
  );

  const goToSlide = contextSafe((direction: number) => {
    if (isTweening || !examples || examples.length <= 1) return;
    setIsTweening(true);

    const slides = slidesRef.current;
    const currentSlideElement = slides[currentIndex];
    let nextIndex = currentIndex + direction;

    // Loop around
    if (nextIndex >= examples.length) {
      nextIndex = 0;
    } else if (nextIndex < 0) {
      nextIndex = examples.length - 1;
    }
    const nextSlideElement = slides[nextIndex];
    // Prepare the next slide (position it off-screen and make it visible)
    // and ensure it's on top for the transition
    gsap.set(nextSlideElement, {
      xPercent: direction > 0 ? 100 : -100,
      opacity: 1,
      position: 'relative', // Bring to front for animation
      zIndex: 1,
    });

    gsap.set(currentSlideElement, {
      zIndex: 0,
      position: 'absolute', // Keep current slide in flow but allow next to slide over
    });
    // Animate current slide out
    gsap.to(currentSlideElement, {
      xPercent: direction > 0 ? -100 : 100, // Slide out to left or right
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        // After sliding out, fully hide it and reset its position for potential reuse
        gsap.set(currentSlideElement, { position: 'absolute', opacity: 0 });
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

        // After animation, ensure only the new current slide is 'relative' and visible
        // and others are reset to absolute and hidden.
        slides.forEach((s, i) => {
          gsap.set(s, {
            position: i === nextIndex ? 'relative' : 'absolute',
            opacity: i === nextIndex ? 1 : 0,
            xPercent: i === nextIndex ? 0 : i < nextIndex ? -100 : 100, // Reset xPercent for others
            zIndex: i === nextIndex ? 1 : 0,
          });
        });
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

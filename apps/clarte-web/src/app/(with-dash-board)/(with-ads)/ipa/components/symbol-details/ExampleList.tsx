'use client';

import { FetchedExample } from '../IpaInteractionWrapper';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ExampleItem from './ExampleItem';

// Helper for consistent log formatting
const log = (message: string, data?: any) => {
  console.log(`[ExampleList] ${message}`, data ? data : '');
};

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
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTweening, setIsTweening] = useState(false);
  const examplesIdRef = useRef<number[]>([]);

  // Check if examples have changed by comparing IDs
  // This is a reliable way to detect changes without effects
  const examplesChanged =
    examples.length > 0 &&
    (examplesIdRef.current.length !== examples.length ||
      examples.some((ex, i) => ex.id !== examplesIdRef.current[i]));

  // If examples changed, update our reference IDs and reset slides
  if (examplesChanged) {
    log(
      `Examples changed! Old count: ${examplesIdRef.current.length}, New count: ${examples.length}`
    );
    log(`Old IDs: ${examplesIdRef.current.join(', ')}`);
    log(`New IDs: ${examples.map((ex) => ex.id).join(', ')}`);

    examplesIdRef.current = examples.map((ex) => ex.id);
    slidesRef.current = [];
    log('Reset slidesRef.current to empty array');

    if (currentIndex !== 0) {
      log(`Resetting currentIndex from ${currentIndex} to 0`);
      setCurrentIndex(0);
    }
  }

  // Function to add slide elements to the slidesRef array
  const assignSlideRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (el && !slidesRef.current.includes(el)) {
        slidesRef.current.push(el);
        log(
          `Slide ref added. Total slides: ${slidesRef.current.length}/${examples.length}`
        );
      }
    },
    [examples.length]
  );

  const { contextSafe } = useGSAP(
    () => {
      log(
        `useGSAP triggered. Examples: ${examples.length}, Slides: ${slidesRef.current.length}, Current: ${currentIndex}`
      );

      if (
        !examples ||
        examples.length === 0 ||
        slidesRef.current.length !== examples.length
      ) {
        log('GSAP setup skipped - slides not ready or examples empty');
        return;
      }

      const slides = slidesRef.current;
      // Initial setup: position all slides
      slides.forEach((slide, i) => {
        gsap.set(slide, {
          xPercent: i === currentIndex ? 0 : i < currentIndex ? -100 : 100,
          opacity: i === currentIndex ? 1 : 0,
          position: i === currentIndex ? 'relative' : 'absolute',
        });
      });
      log('GSAP slide positions initialized successfully');
    },
    { scope: containerRef, dependencies: [examples, currentIndex] }
  );

  const goToSlide = contextSafe((direction: number) => {
    log(`goToSlide called with direction: ${direction}`);

    if (isTweening) {
      log('Animation in progress, ignoring slide request');
      return;
    }

    if (!examples || examples.length <= 1) {
      log(`Not enough examples to slide: ${examples?.length || 0}`);
      return;
    }

    setIsTweening(true);

    const slides = slidesRef.current;
    if (slides.length !== examples.length) {
      log(
        `Slide refs (${slides.length}) don't match examples (${examples.length}), aborting`
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

    log(`Sliding from index ${currentIndex} to ${nextIndex}`);

    if (nextIndex < 0 || nextIndex >= slides.length || !slides[nextIndex]) {
      console.warn(
        `Invalid next slide index: ${nextIndex}, slides: ${slides.length}`
      );
      setIsTweening(false);
      return;
    }
    const nextSlideElement = slides[nextIndex];

    // Prepare the next slide
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

    // Animate current slide out
    gsap.to(currentSlideElement, {
      xPercent: direction > 0 ? -100 : 100,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
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
        setCurrentIndex(nextIndex);
        setIsTweening(false);
        gsap.set(nextSlideElement, { willChange: 'auto' });
        log(`Animation complete. New current index: ${nextIndex}`);
      },
    });
  });

  // Handle loading, error, and empty states
  if (isLoadingExamples) {
    log('Rendering loading state');
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        <p>Loading examples...</p>
      </div>
    );
  }

  if (errorMessage) {
    log(`Rendering error state: ${errorMessage}`);
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        <p>Error: {errorMessage}</p>
      </div>
    );
  }

  if (!examples || examples.length === 0) {
    log('Rendering empty state');
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        <p>No examples found.</p>
      </div>
    );
  }

  log(
    `Rendering carousel with ${examples.length} examples, current: ${currentIndex}`
  );
  return (
    <div
      className="flex flex-col gap-4 w-full max-w-md items-center p-4 border"
      ref={containerRef}
    >
      {/* Slides container */}
      <div className="example-slides-container relative w-full h-48 md:h-56 overflow-hidden rounded-lg shadow-lg bg-gray-800">
        {examples.map((example, i) => (
          <div
            key={example.id}
            ref={assignSlideRef}
            className="example-slide-item absolute inset-0 w-full h-full"
          >
            <ExampleItem example={example} isActive={i === currentIndex} />
          </div>
        ))}
      </div>

      {/* Animation Controller Container */}
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
// 'use client';

// import { FetchedExample } from '../IpaInteractionWrapper';
// import gsap from 'gsap';
// import { useGSAP } from '@gsap/react';
// import { useRef, useState, useCallback } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import ExampleItem from './ExampleItem';

// gsap.registerPlugin(useGSAP);

// interface ExampleListProp {
//   examples?: FetchedExample[];
//   isLoadingExamples: boolean;
//   errorMessage: string | null;
// }

// export default function ExampleList({
//   examples = [],
//   isLoadingExamples,
//   errorMessage,
// }: ExampleListProp) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const slidesRef = useRef<HTMLDivElement[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isTweening, setIsTweening] = useState(false);
//   const examplesIdRef = useRef<number[]>([]);

//   // Check if examples have changed by comparing IDs
//   // This is a reliable way to detect changes without effects
//   const examplesChanged =
//     examples.length > 0 &&
//     (examplesIdRef.current.length !== examples.length ||
//       examples.some((ex, i) => ex.id !== examplesIdRef.current[i]));

//   // If examples changed, update our reference IDs and reset slides
//   if (examplesChanged) {
//     examplesIdRef.current = examples.map((ex) => ex.id);
//     slidesRef.current = [];
//     if (currentIndex !== 0) setCurrentIndex(0);
//   }

//   // Function to add slide elements to the slidesRef array
//   const assignSlideRef = useCallback((el: HTMLDivElement | null) => {
//     if (el && !slidesRef.current.includes(el)) {
//       slidesRef.current.push(el);
//     }
//   }, []);

//   const { contextSafe } = useGSAP(
//     () => {
//       if (
//         !examples ||
//         examples.length === 0 ||
//         slidesRef.current.length !== examples.length
//       ) {
//         return;
//       }

//       const slides = slidesRef.current;
//       // Initial setup: position all slides
//       slides.forEach((slide, i) => {
//         gsap.set(slide, {
//           xPercent: i === currentIndex ? 0 : i < currentIndex ? -100 : 100,
//           opacity: i === currentIndex ? 1 : 0,
//           position: i === currentIndex ? 'relative' : 'absolute',
//         });
//       });
//     },
//     { scope: containerRef, dependencies: [examples, currentIndex] }
//   );

//   const goToSlide = contextSafe((direction: number) => {
//     if (isTweening || !examples || examples.length <= 1) return;
//     setIsTweening(true);

//     const slides = slidesRef.current;
//     if (slides.length !== examples.length) {
//       setIsTweening(false);
//       return;
//     }

//     const currentSlideElement = slides[currentIndex];
//     let nextIndex = currentIndex + direction;

//     // Loop around
//     if (nextIndex >= examples.length) {
//       nextIndex = 0;
//     } else if (nextIndex < 0) {
//       nextIndex = examples.length - 1;
//     }

//     if (nextIndex < 0 || nextIndex >= slides.length || !slides[nextIndex]) {
//       console.warn('GSAP goToSlide: Invalid next slide index.');
//       setIsTweening(false);
//       return;
//     }
//     const nextSlideElement = slides[nextIndex];

//     // Prepare the next slide
//     gsap.set(nextSlideElement, {
//       xPercent: direction > 0 ? 100 : -100,
//       opacity: 1,
//       position: 'relative',
//       zIndex: 1,
//       willChange: 'transform, opacity',
//     });

//     gsap.set(currentSlideElement, {
//       zIndex: 0,
//       position: 'absolute',
//       willChange: 'transform, opacity',
//     });

//     // Animate current slide out
//     gsap.to(currentSlideElement, {
//       xPercent: direction > 0 ? -100 : 100,
//       opacity: 0,
//       duration: 0.5,
//       onComplete: () => {
//         gsap.set(currentSlideElement, {
//           position: 'absolute',
//           opacity: 0,
//           willChange: 'auto',
//         });
//       },
//     });

//     // Animate next slide in
//     gsap.to(nextSlideElement, {
//       xPercent: 0,
//       opacity: 1,
//       duration: 0.5,
//       onComplete: () => {
//         setCurrentIndex(nextIndex);
//         setIsTweening(false);
//         gsap.set(nextSlideElement, { willChange: 'auto' });
//       },
//     });
//   });

//   // Handle loading, error, and empty states
//   if (isLoadingExamples) {
//     return (
//       <div className="flex justify-center items-center h-full text-gray-500">
//         <p>Loading examples...</p>
//       </div>
//     );
//   }

//   if (errorMessage) {
//     return (
//       <div className="flex justify-center items-center h-full text-red-500">
//         <p>Error: {errorMessage}</p>
//       </div>
//     );
//   }

//   if (!examples || examples.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-full text-gray-500">
//         <p>No examples found.</p>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="flex flex-col gap-4 w-full max-w-md items-center p-4 border"
//       ref={containerRef}
//     >
//       {/* Slides container */}
//       <div className="example-slides-container relative w-full h-48 md:h-56 overflow-hidden rounded-lg shadow-lg bg-gray-800">
//         {examples.map((example, i) => (
//           <div
//             key={example.id}
//             ref={assignSlideRef}
//             className="example-slide-item absolute inset-0 w-full h-full"
//           >
//             <ExampleItem example={example} isActive={i === currentIndex} />
//           </div>
//         ))}
//       </div>

//       {/* Animation Controller Container */}
//       {examples.length > 1 && (
//         <div className="flex flex-row justify-between items-center w-full mt-2 px-2">
//           <button
//             onClick={() => goToSlide(-1)}
//             className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
//             aria-label="Previous example"
//           >
//             <ChevronLeft size={28} />
//           </button>
//           <p className="text-sm text-gray-600 select-none">
//             Example {currentIndex + 1} / {examples.length}
//           </p>
//           <button
//             onClick={() => goToSlide(1)}
//             className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
//             aria-label="Next example"
//           >
//             <ChevronRight size={28} />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

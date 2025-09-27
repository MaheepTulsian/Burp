import React, { useEffect, useRef, useState } from "react";

const HumanoidSection = () => {
  const sectionRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ticking = useRef(false);
  const lastScrollY = useRef(0);

  const cardStyle = {
    height: "60vh",
    maxHeight: "600px",
    borderRadius: "20px",
    transition:
      "transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
    willChange: "transform, opacity",
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleScroll = () => {
      if (!ticking.current) {
        lastScrollY.current = window.scrollY;

        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;

          const sectionRect = sectionRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const totalScrollDistance = viewportHeight * 2;

          let progress = 0;
          if (sectionRect.top <= 0) {
            progress = Math.min(
              1,
              Math.max(0, Math.abs(sectionRect.top) / totalScrollDistance)
            );
          }

          if (progress >= 0.66) {
            setActiveCardIndex(2);
          } else if (progress >= 0.33) {
            setActiveCardIndex(1);
          } else {
            setActiveCardIndex(0);
          }

          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const isFirstCardVisible = isIntersecting;
  const isSecondCardVisible = activeCardIndex >= 1;
  const isThirdCardVisible = activeCardIndex >= 2;

  return (
    // <div ref={sectionRef} className="relative" style={{ height: "300vh" }}>
    //   <section
    //     className="w-full h-screen py-10 md:py-16 sticky top-0 overflow-hidden bg-white"
    //     id="why-humanoid"
    //   >
    //     <div className="container px-6 lg:px-8 mx-auto h-full flex flex-col">
    //       {/* Section Header */}
    //       <div className="mb-2 md:mb-3">
    //         <div className="flex items-center gap-4 mb-2 pt-8">
    //           <div className="pulse-chip opacity-0 animate-fade-in">
    //             <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">
    //               02
    //             </span>
    //             <span>Burp</span>
    //           </div>
    //         </div>

    //         <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-1 md:mb-2 [text-stroke:1px_black] text-transparent">
    //           Why Use Burp
    //         </h2>
    //       </div>

    //       {/* Cards */}
    //       <div
    //         ref={cardsContainerRef}
    //         className="relative flex-1 perspective-1000"
    //       >
    //         {/* PYUSD Card */}
    //         <div
    //           className={`absolute inset-0 overflow-hidden shadow-2xl rounded-2xl ${
    //             isFirstCardVisible ? "animate-card-enter" : ""
    //           }`}
    //           style={{
    //             ...cardStyle,
    //             zIndex: 10,
    //             transform: `translateY(${
    //               isFirstCardVisible ? "90px" : "200px"
    //             }) scale(0.9)`,
    //             opacity: isFirstCardVisible ? 0.95 : 0,
    //             background:
    //               "linear-gradient(135deg, #4A6FA5 0%, #A9B0B9 100%)", // blue + grey
    //           }}
    //         >
    //           {/* Badge */}
    //           <div className="absolute top-4 right-4 z-20">
    //             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-md text-white">
    //               <img src="/logos/pyusd.svg" alt="PYUSD" className="w-6 h-6" />
    //               <span className="text-sm font-semibold tracking-wide">
    //                 PYUSD
    //               </span>
    //             </div>
    //           </div>

    //           {/* Text */}
    //           <div className="relative z-10 p-6 md:p-8 h-full flex items-center">
    //             <div className="max-w-lg">
    //               <h3 className="text-3xl md:text-4xl font-display font-bold leading-tight mb-4">
    //                 <span className=" [text-stroke:1px_black]">
    //                   Trust & Stability
    //                 </span>{" "}
    //                 with <span className="text-blue-200">PYUSD</span>
    //               </h3>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Fluence Card */}
            

    //         {/* Self Card */}
    //         <div
    //           className={`absolute inset-0 overflow-hidden shadow-2xl rounded-2xl ${
    //             isThirdCardVisible ? "animate-card-enter" : ""
    //           }`}
    //           style={{
    //             ...cardStyle,
    //             zIndex: 30,
    //             transform: `translateY(${
    //               isThirdCardVisible
    //                 ? activeCardIndex === 2
    //                   ? "15px"
    //                   : "0"
    //                 : "200px"
    //             }) scale(1)`,
    //             opacity: isThirdCardVisible ? 1 : 0,
    //             pointerEvents: isThirdCardVisible ? "auto" : "none",
    //             background:
    //               "linear-gradient(135deg, #FFD700 0%, #FFF5CC 100%)", // gold + white
    //           }}
    //         >
    //           {/* Badge */}
    //           <div className="absolute top-4 right-4 z-20">
    //             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm border border-yellow-200/50 shadow-md text-yellow-900">
    //               <img src="/logos/self.svg" alt="Self" className="w-6 h-6" />
    //               <span className="text-sm font-semibold tracking-wide">
    //                 Self
    //               </span>
    //             </div>
    //           </div>

    //           {/* Text */}
    //           <div className="relative z-10 p-6 md:p-8 h-full flex items-center">
    //             <div className="max-w-lg">
    //               <h3 className="text-3xl md:text-4xl font-display font-bold leading-tight mb-4">
    //                 <span className=" [text-stroke:1px_black]">
    //                   Unlocking Self-Sovereign Identity
    //                 </span>{" "}
    //                 & Ownership
    //               </h3>
    //             </div>
    //           </div>
    //         </div>
    //         {/* -------------------- */}

    //         <div
    //           className={`absolute inset-0 overflow-hidden shadow-2xl rounded-2xl ${
    //             isSecondCardVisible ? "animate-card-enter" : ""
    //           }`}
    //           style={{
    //             ...cardStyle,
    //             zIndex: 20,
    //             transform: `translateY(${
    //               isSecondCardVisible
    //                 ? activeCardIndex === 1
    //                   ? "55px"
    //                   : "45px"
    //                 : "200px"
    //             }) scale(0.95)`,
    //             opacity: isSecondCardVisible ? 1 : 0,
    //             pointerEvents: isSecondCardVisible ? "auto" : "none",
    //             background:
    //               "linear-gradient(135deg, #000000 0%, #434343 50%, #B0B0B0 100%)", // black to silver
    //           }}
    //         >
    //           {/* Badge */}
    //           <div className="absolute top-4 right-4 z-20">
    //             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-md text-white">
    //               <img
    //                 src="/logos/fluence.svg"
    //                 alt="Fluence"
    //                 className="w-6 h-6"
    //               />
    //               <span className="text-sm font-semibold tracking-wide">
    //                 Fluence
    //               </span>
    //             </div>
    //           </div>

    //           {/* Text */}
    //           <div className="relative z-10 p-6 md:p-8 h-full flex items-center">
    //             <div className="max-w-lg">
    //               <h3 className="text-3xl md:text-4xl font-display font-bold leading-tight mb-4">
    //                 <span className=" [text-stroke:3px_white]">
    //                   Powering Decentralized AI
    //                 </span>{" "}
    //                 with <span className="text-gray-200">Fluence</span>
    //               </h3>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </section>
    // </div>
    <>
    </>
  );
};

export default HumanoidSection;

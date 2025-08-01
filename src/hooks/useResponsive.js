import { useState, useEffect } from "react";

// Custom hook for responsive breakpoints
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [breakpoint, setBreakpoint] = useState("lg");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });

      // Set breakpoint based on width
      if (width < 576) {
        setBreakpoint("xs");
      } else if (width < 768) {
        setBreakpoint("sm");
      } else if (width < 992) {
        setBreakpoint("md");
      } else if (width < 1200) {
        setBreakpoint("lg");
      } else {
        setBreakpoint("xl");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once to set initial values

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = breakpoint === "xs" || breakpoint === "sm";
  const isTablet = breakpoint === "md";
  const isDesktop = breakpoint === "lg" || breakpoint === "xl";

  return {
    screenSize,
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
  };
};

// Custom hook for touch detection
export const useTouch = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };

    checkTouch();
    window.addEventListener("touchstart", checkTouch, { once: true });

    return () => {
      window.removeEventListener("touchstart", checkTouch);
    };
  }, []);

  return isTouch;
};

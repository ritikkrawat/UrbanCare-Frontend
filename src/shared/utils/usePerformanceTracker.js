import { useEffect, useRef } from "react";

const usePerformanceTracker = (componentName) => {
  const renderStart = useRef(performance.now());

  useEffect(() => {
    const renderEnd = performance.now();

    console.log(
      `%c[COMPONENT RENDER] ${componentName}`,
      "color: purple; font-weight: bold;"
    );

    console.table({
      Component: componentName,
      RenderTime: `${(
        renderEnd - renderStart.current
      ).toFixed(2)} ms`,
    });
  }, [componentName]);
};

export default usePerformanceTracker;
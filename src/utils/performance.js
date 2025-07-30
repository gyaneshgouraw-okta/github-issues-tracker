/**
 * Performance utilities for React 19 optimizations
 */

// Performance monitoring hook
export function usePerformanceMonitor(componentName) {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(`${componentName}-start`);
    
    return () => {
      performance.mark(`${componentName}-end`);
      performance.measure(
        `${componentName}-render`,
        `${componentName}-start`,
        `${componentName}-end`
      );
    };
  }
  
  return () => {}; // No-op for environments without performance API
}

// Bundle size analyzer
export function analyzeBundleSize() {
  if (typeof window !== 'undefined' && window.performance) {
    const navigation = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');
    
    const jsResources = resources.filter(resource => 
      resource.name.includes('.js') && !resource.name.includes('node_modules')
    );
    
    const totalJSSize = jsResources.reduce((total, resource) => {
      return total + (resource.transferSize || 0);
    }, 0);
    
    console.log('Performance Analysis:', {
      totalJSSize: `${(totalJSSize / 1024).toFixed(2)} KB`,
      loadTime: `${navigation.loadEventEnd - navigation.fetchStart} ms`,
      domContentLoaded: `${navigation.domContentLoadedEventEnd - navigation.fetchStart} ms`,
      jsResources: jsResources.length
    });
    
    return {
      totalJSSize,
      loadTime: navigation.loadEventEnd - navigation.fetchStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      resourceCount: jsResources.length
    };
  }
  
  return null;
}

// React 19 optimization helpers
export const optimizationHelpers = {
  // Debounce function for performance
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle function for performance
  throttle: (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // Memory usage monitor
  getMemoryUsage: () => {
    if (typeof performance !== 'undefined' && performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576 * 100) / 100,
        total: Math.round(performance.memory.totalJSHeapSize / 1048576 * 100) / 100,
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576 * 100) / 100
      };
    }
    return null;
  }
};

/**
 * React Compiler Configuration
 * This file configures the React Compiler for optimal performance
 */

const ReactCompilerConfig = {
  // Start with annotation mode for gradual adoption
  compilationMode: 'annotation',
  
  // Conservative error handling during initial phase
  panicThreshold: 'all_errors',
  
  // Sources to compile - start with specific directories
  sources: (filename) => {
    return filename.includes('src/views/components') || 
           filename.includes('src/views/pages') ||
           filename.includes('src/contexts');
  },
  
  // Skip compilation for certain patterns
  skip: (filename) => {
    return filename.includes('node_modules') ||
           filename.includes('.test.') ||
           filename.includes('.spec.');
  },
  
  // Enable experimental features
  enableTreatRefLikeIdentifierInHooks: true,
  enablePreserveExistingMemoizationGuarantees: true,
  
  // Logging for development
  logger: {
    logLevel: 'info',
    logDir: './logs/react-compiler'
  }
};

export default ReactCompilerConfig;

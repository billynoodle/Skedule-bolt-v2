// Enhanced logging system with canvas-specific logging
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

interface LogConfig {
  enabled: boolean;
  level: LogLevel;
  canvasDebug: boolean;
}

const config: LogConfig = {
  enabled: true,
  level: 'DEBUG',
  canvasDebug: true // Enable detailed canvas logging
};

function formatMessage(component: string, message: string, data?: any): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${component}] ${message}`;
}

export function log(component: string, message: string, data?: any) {
  if (!config.enabled || LOG_LEVELS[config.level] > LOG_LEVELS.DEBUG) return;

  console.group(formatMessage(component, message));
  if (data) {
    console.log('Data:', data);
    
    // Canvas-specific debug info
    if (config.canvasDebug && data.canvas) {
      console.group('Canvas Debug Info');
      console.log('Dimensions:', {
        width: data.canvas.width,
        height: data.canvas.height
      });
      console.log('Mode:', data.canvas.isDrawingMode ? 'draw' : 'select');
      console.log('Objects:', data.canvas.getObjects().length);
      console.log('Context:', data.canvas.contextContainer ? 'valid' : 'invalid');
      console.groupEnd();
    }
  }
  console.groupEnd();
}

export function error(component: string, message: string, err?: any) {
  if (!config.enabled || LOG_LEVELS[config.level] > LOG_LEVELS.ERROR) return;

  console.group(`%c${formatMessage(component, message)}`, 'color: red');
  if (err) {
    console.error('Error details:', {
      message: err.message || err,
      stack: err.stack,
      ...(err instanceof Error ? { name: err.name } : {})
    });
  }
  console.groupEnd();
}

export function canvasDebug(canvas: fabric.Canvas | null) {
  if (!config.canvasDebug || !canvas) return;

  return {
    dimensions: {
      width: canvas.width,
      height: canvas.height,
      viewportTransform: canvas.viewportTransform
    },
    state: {
      isDrawingMode: canvas.isDrawingMode,
      selection: canvas.selection,
      defaultCursor: canvas.defaultCursor,
      hoverCursor: canvas.hoverCursor
    },
    objects: canvas.getObjects().map(obj => ({
      id: obj.id,
      type: obj.type,
      selectable: obj.selectable,
      evented: obj.evented,
      visible: obj.visible
    })),
    context: {
      valid: !!canvas.contextContainer,
      type: canvas.contextContainer?.constructor.name
    }
  };
}
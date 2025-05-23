import logger from '../../utils/logger.mjs';
import { withErrorHandling } from '../../utils/common.mjs';

export class BaseService {
  constructor(serviceName) {
    this.serviceName = serviceName;
    this.logger = logger;
  }

  // 包装方法，添加错误处理和日志记录
  wrapMethod(method, errorMessage) {
    return withErrorHandling(async (...args) => {
      this.logger.debug(`${this.serviceName}.${method.name} 开始执行`, { args });
      const result = await method.apply(this, args);
      this.logger.debug(`${this.serviceName}.${method.name} 执行完成`, { result });
      return result;
    }, errorMessage);
  }

  // 记录错误
  logError(methodName, error, context = {}) {
    this.logger.error(`${this.serviceName}.${methodName} 执行失败`, {
      error: error.message,
      stack: error.stack,
      ...context
    });
  }

  // 记录警告
  logWarning(methodName, message, context = {}) {
    this.logger.warn(`${this.serviceName}.${methodName}: ${message}`, context);
  }

  // 记录信息
  logInfo(methodName, message, context = {}) {
    this.logger.info(`${this.serviceName}.${methodName}: ${message}`, context);
  }

  // 记录调试信息
  logDebug(methodName, message, context = {}) {
    this.logger.debug(`${this.serviceName}.${methodName}: ${message}`, context);
  }
} 
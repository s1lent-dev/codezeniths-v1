import { LoggingService } from './logging.service';

export * from './logging.types';
export { LoggingService };

export const logger = new LoggingService();

import {
  Module,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*');
    // consumer
    //   .apply(LoggingMiddleware)
    //   .forRoutes('coffees');
    // consumer
    //   .apply(LoggingMiddleware)
    //   .forRoutes(
    //     { path: 'coffees', method: RequestMethod.GET },
    //   );
    // consumer
    //   .apply(LoggingMiddleware)
    //   .exclude('coffees')
    //   .forRoutes('*');
  }
}

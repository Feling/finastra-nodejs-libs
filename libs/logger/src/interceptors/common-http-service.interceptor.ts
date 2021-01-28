import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {
    this.logger.setContext('http');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let req = context.switchToHttp().getRequest();
    if (context['contextType'] === 'graphql') {
      req = GqlExecutionContext.create(context).getContext().req;
    }

    this.logger.log(`START: ${context.getClass().name}.${context.getHandler().name}(): ${req.method} ${req.url}`);

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(`STOP: ${context.getClass().name}.${context.getHandler().name}(): ${req.method} ${req.url}`),
        ),
      );
  }
}
import * as Sentry from '@sentry/nextjs';

import { ICrashReporterService } from '@nextjs-clean-architecture/core/application/services/crash-reporter.service.interface';

export class CrashReporterService implements ICrashReporterService {
  report(error: any): string {
    return Sentry.captureException(error);
  }
}

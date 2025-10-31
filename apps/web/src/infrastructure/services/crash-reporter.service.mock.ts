import { ICrashReporterService } from '@repo/core/application/services/crash-reporter.service.interface';

export class MockCrashReporterService implements ICrashReporterService {
  report(_: any): string {
    return 'errorId';
  }
}

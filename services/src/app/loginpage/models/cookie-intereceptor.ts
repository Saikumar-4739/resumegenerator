import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  private isFirstTime = true; // Variable to track if it's the first time
  private validCookieIds: Set<string> = new Set(); // Use a Set for efficient lookup

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const cookieId = request.cookies?.['cookie_id']; // Safe access to cookies

    console.log('Received cookie ID:', cookieId);

    if (cookieId) {
      // Extract session ID if cookie ID contains a prefix
      const sessionId = this.extractSessionId(cookieId);
      console.log('Extracted session ID:', sessionId);

      // Store all encountered session IDs
      this.validCookieIds.add(sessionId);
    }

    // Handle the first-time case
    if (this.isFirstTime && !cookieId) {
      this.isFirstTime = false;
      return next.handle().pipe(
        tap(() => console.log('First-time check complete'))
      );
    }

    // Validate the session ID
    const sessionId = this.extractSessionId(cookieId);
    if (!cookieId || !this.isValidSessionId(sessionId)) {
      response.status(401).json({ message: 'Invalid session' });
      return of(); // Return an empty observable to end the request
    }

    return next.handle().pipe(
      tap(() => console.log('Session validation complete'))
    );
  }

  private extractSessionId(cookieId: string): string {
    if (!cookieId) {
      return '';
    }
    
    // Assuming 's:' prefix and splitting to get session ID
    const parts = cookieId.split('.');
    return parts[0]?.substring(2) || ''; // Extract session ID
  }

  private isValidSessionId(sessionId: string): boolean {
    console.log('Validating session ID:', sessionId);
    return this.validCookieIds.has(sessionId);
  }

  getValidSessionIds(): string[] {
    return Array.from(this.validCookieIds);
  }
}

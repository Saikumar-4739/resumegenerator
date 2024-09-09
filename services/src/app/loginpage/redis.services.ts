import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { SessionData } from 'express-session';
import { LoginDetails } from './models/login.details';

interface CustomSession extends SessionData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any; // or define the exact type based on your user model
}


@Injectable()
export class SessionService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  setSession(req: Request & { session: CustomSession }, user: LoginDetails) {
    req.session.user = user;
    console.log('User set in session:', req.session.user);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSession(req: Request & { session: CustomSession }): any {
    return req.session.user;
  }

  destroySession(req: Request & { session: CustomSession }): void {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
      }
    });
  }

  async getAllSessionIds(req: Request & { session: CustomSession }): Promise<string[]> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req.session as any).store.all((err: any, sessions: any) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const sessionIds = Object.keys(sessions);
          resolve(sessionIds);
        }
      });
    });
  }
  
}
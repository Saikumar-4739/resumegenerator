import { Body, Controller, Get, Post, Req, Res, Session } from '@nestjs/common';
import { LoginService } from './login.services';
import { LoginResponse } from './models/login.response';
import { LoginDetails } from './models/login.details';
import { Request, Response } from 'express';
import session from 'express-session';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MemoryStore = require('memorystore')(session);

const sessionStore = new MemoryStore({
  checkPeriod: 86400000 // Prune expired entries every 24h
});

@Controller('login')
export class LoginController {
  private ids: string[] = [];
  private cookiesids: string[] = [];

  constructor(private readonly loginService: LoginService) {}

  @Post('check')
  async login(
    @Body() details: LoginDetails,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Session() session: Record<string, any> | undefined,
    @Req() req: Request
  ): Promise<{ response: LoginResponse }> {
    try {
      if (!session) {
        throw new Error('Session is not initialized');
      }
  
      const { response, user } = await this.loginService.getDetailsByEmail(details);
  
      if (response.status) {
        session.user = user;
        console.log('User set in session:', session.user);
        console.log("session-id",session.id);

        // Add session ID and cookie ID to arrays
        const cookieId = req.cookies['cookie_id'];
        if (cookieId) {
          this.cookiesids.push(cookieId);
          console.log('cookie_id:', cookieId);
        }
        if (session.id) {
          this.ids.push(session.id);
        }
      }
  
      return { response };
    } catch (error) {
      console.error('Login error:', error.message);
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
  
      return {
        response: {
          status: false,
          errorCode: 500,
          internalMessage: 'Internal server error',
          data: [],
        },
      };
    }
  }

  @Post('post')
  async createUser(@Body() details: LoginDetails): Promise<LoginResponse> {
    try {
      return await this.loginService.createUser(details);
    } catch (err) {
      console.error('Create user error:', err.message);
      return {
        status: false,
        errorCode: 500,
        internalMessage: 'An error occurred while creating the user',
        data: [],
      };
    }
  }

  @Get('verify')
  async verifySession(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Session() session: Record<string, any>,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const cookieId = req.cookies['cookie_id'];
      if (cookieId) {
        console.log('Received cookie ID:', cookieId);
      }

      console.log('Session:', session);
      console.log('Session ID:', session.id);

      const isValid = await this.loginService.verifySession(session);
      console.log('Session valid:', isValid);

      return res.status(200).json({ isValid });
    } catch (error) {
      console.error('Verification error:', error.message);
      return res.status(500).json({ isValid: false });
    }
  }

  @Post('logout')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async logout(@Session() session: Record<string, any>, @Req() req: Request, @Res() res: Response) {
    try {
      const sessionId = session.id;
      const cookieId = req.cookies['cookie_id'];

      session.destroy((err) => {
        if (err) {
          console.error('Logout error:', err.message);
          return res.status(500).json({ message: 'Logout failed' });
        }
        if (cookieId) {
          const index = this.cookiesids.indexOf(cookieId);
          if (index !== -1) {
            this.cookiesids.splice(index, 1);
          }
          res.clearCookie('cookie_id'); // clear cookie if needed
          console.log('Cookie cleared');
        }
        if (sessionId) {
          const index = this.ids.indexOf(sessionId);
          if (index !== -1) {
            this.ids.splice(index, 1);
          }
        }
        return res.status(200).json({ message: 'Logged out successfully' });
      });
    } catch (error) {
      console.error('Logout error:', error.message);
      return res.status(500).json({ message: 'Logout failed' });
    }
  }

  @Get('sessionIds')
  getAllSessionIds(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sessionStore.all((err: any, sessions: { [key: string]: any }) => {
        if (err) {
          console.error('Session store error:', err.message);
          reject(err);
        } else {
          const sessionIds = Object.keys(sessions);
          console.log('Session IDs:', sessionIds);
          resolve(sessionIds);
        }
      });
    });
  }

  @Get('cookieIds')
  getAllCookieIds(): string[] {
    return this.cookiesids;
  }
}

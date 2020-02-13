import {Request, Response} from 'express';
import {sessionStore} from './session-store';


export function logout(req: Request, res: Response) {
  console.log(req.cookies);
  const sessionId = req.cookies['SESSIONID'];

  sessionStore.destroySession(sessionId);

  res.clearCookie('SESSIONID');

  res.sendStatus(200);
}

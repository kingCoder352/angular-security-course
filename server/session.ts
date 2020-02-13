import {Moment} from 'moment';
import {User} from '../src/app/model/user';
import moment = require('moment');

export class Session {

  static readonly VALID_MINUTES: number = 2;
  private validUntil: Moment;

  constructor(
    public sessionId: string,
    public user: User
  ) {
    this.validUntil = moment().add(Session.VALID_MINUTES, 'minutes');
  }

  isValid() {
    return moment().diff(this.validUntil, 'minutes') <= 0;
  }

}

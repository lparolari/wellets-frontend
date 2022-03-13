import ICurrency from './ICurrency';
import IUser from './IUser';

interface IUserSettings {
  id: string;
  user_id: string;
  user: IUser;
  currency_id: string;
  currency: ICurrency;
}

export default IUserSettings;

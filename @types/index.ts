export * from './model';
import { JwtPayload } from 'jsonwebtoken';

export interface IDecodedPayload extends JwtPayload {
  id: string;
}

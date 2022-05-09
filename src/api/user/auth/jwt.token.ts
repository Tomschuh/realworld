import * as jwt from 'jsonwebtoken';

/**
 * Class for Json web token data payload.
 */
export class JwtPayloadData {
  email: string;
  userId: number; 
}
/**
 * Class for Json web token payload.
 */
export class CustomJwtPayload implements jwt.JwtPayload {
  data: JwtPayloadData;
  exp: number;
}
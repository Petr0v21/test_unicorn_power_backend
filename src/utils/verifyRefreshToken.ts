import UserToken from '../models/UserToken';
import jwt from 'jsonwebtoken';
import { Error, Types } from 'mongoose';

type TokenDetails = {
  _id: string;
  roles: string[];
  iat: number;
  exp: number;
};

type PromiseType = {
  tokenDetails: TokenDetails;
  error: boolean;
  message: string;
};

const verifyRefreshToken = (refreshToken: string) => {
  const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

  return new Promise<PromiseType>((resolve, reject) => {
    UserToken.findOne(
      { token: refreshToken },
      (
        err: Error,
        doc: { userId: Types.ObjectId; token: string; createdAt: Date }
      ) => {
        if (!doc)
          return reject({ error: true, message: 'Invalid refresh token' });

        jwt.verify(refreshToken, privateKey!, (err, tokenDetails) => {
          if (err)
            return reject({ error: true, message: 'Invalid refresh token' });

          resolve({
            tokenDetails: tokenDetails as TokenDetails,
            error: false,
            message: 'Valid refresh token'
          });
        });
      }
    );
  });
};

export default verifyRefreshToken;

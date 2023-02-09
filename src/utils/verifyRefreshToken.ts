import UserToken from '../models/UserToken';
import jwt from 'jsonwebtoken';

const verifyRefreshToken = (refreshToken: string) => {
  const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

  return new Promise((resolve, reject) => {
    UserToken.findOne({ token: refreshToken }, (err: any, doc: any) => {
      if (!doc)
        return reject({ error: true, message: 'Invalid refresh token' });

      jwt.verify(refreshToken, privateKey!, (err, tokenDetails) => {
        if (err)
          return reject({ error: true, message: 'Invalid refresh token' });
        resolve({
          tokenDetails,
          error: false,
          message: 'Valid refresh token'
        });
      });
    });
  });
};

export default verifyRefreshToken;

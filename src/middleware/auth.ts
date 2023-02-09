import jwt from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const auth = async (req: any, res: Response, next: NextFunction) => {
  const token = req.header('x-access-token');
  if (!token)
    return res
      .status(403)
      .json({ error: true, message: 'Access Denied: No token provided' });

  try {
    const tokenDetails = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_PRIVATE_KEY!
    );
    req.user = tokenDetails;
    next();
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ error: true, message: 'Access Denied: Invalid token' });
  }
};

export default auth;

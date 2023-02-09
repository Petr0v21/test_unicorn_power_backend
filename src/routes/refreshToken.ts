import { Router } from 'express';
import UserToken from '../models/UserToken';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import verifyRefreshToken from '../utils/verifyRefreshToken';
dotenv.config();
const router = Router();

type ResponseType = {
  tokenDetails: {
    _id: string;
    roles: string;
  };
};
// get new access token
router.post('/', async (req, res) => {
  verifyRefreshToken(req.body.refreshToken)
    .then((respons: ResponseType | any) => {
      const payload = {
        _id: respons.tokenDetails._id,
        roles: respons.tokenDetails.roles
      };
      const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY!,
        { expiresIn: '10m' }
      );

      res.status(200).json({
        error: false,
        accessToken,
        message: 'Access token created successfully'
      });
    })
    .catch((err) => res.status(400).json(err));
});

// logout
router.get('/logout_all=:all', async (req, res) => {
  try {
    if (req.params.all === 'true') {
      await UserToken.deleteMany();
      return res
        .status(200)
        .json({ error: false, message: 'Logged Out Sucessfully for all' });
    }

    const userToken = await UserToken.findOne({ token: req.body.refreshToken });

    if (!userToken)
      return res
        .status(200)
        .json({ error: false, message: 'Logged Out Sucessfully' });

    await userToken.remove();
    res.status(200).json({ error: false, message: 'Logged Out Sucessfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

export default router;

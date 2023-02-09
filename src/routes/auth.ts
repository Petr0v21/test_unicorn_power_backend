import { Router } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import generateTokens from '../utils/generateTokens';
import { validateId } from '../utils/validationSchema';

const router = Router();

// signup
router.post('/signup', async (req, res) => {
  try {
    if (!req.body.id || !req.body.password) {
      return res.status(400).send({
        message: 'Email/Phone number or password missing.'
      });
    }
    const id_type = await validateId(req.body.id);
    if (!id_type)
      return res.status(400).send({
        message: 'Please provide a valid email address or phone number'
      });
    const user = await User.findOne({ id: req.body.id });
    if (user)
      return res.status(400).json({
        error: true,
        message: 'User with given email already exist'
      });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const candidate = await new User({
      ...req.body,
      id_type,
      password: hashPassword
    }).save();
    const { accessToken, refreshToken } = await generateTokens(candidate);
    res.status(201).json({
      error: false,
      message: 'Account created sucessfully',
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

// login
router.post('/signin', async (req, res) => {
  try {
    if (!req.body.id || !req.body.password) {
      return res.status(400).send({
        message: 'Email/Phone number or password missing.'
      });
    }
    const id_type = await validateId(req.body.id);
    if (!id_type)
      return res
        .status(401)
        .json({ error: true, message: 'Invalid email or phone number' });
    const user = await User.findOne({ id: req.body.id });
    if (!user)
      return res
        .status(401)
        .json({ error: true, message: 'Invalid email or password' });

    const verifiedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!verifiedPassword)
      return res
        .status(401)
        .json({ error: true, message: 'Invalid email or password' });

    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      message: 'Logged in sucessfully'
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

export default router;

import { Router } from 'express';
import auth from '../middleware/auth';
import User from '../models/User';
import UserToken from '../models/UserToken';

const router = Router();

router.get('/details', auth, async (req: any, res) => {
  const candidate = await User.findById(req.user._id);
  if (!candidate) {
    res.status(400).json({ message: 'Not found!' });
  }
  res.status(200).json({ id_type: candidate?.id_type, userId: candidate?._id });
});

export default router;

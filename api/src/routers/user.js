import express from 'express';
import User from '../models/user.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// signup
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// login
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(500).send(e);
  }
});

// logout
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/users/me', auth, async (req, res) => {
  await req.user.populate({
    path: 'casesOfInterest',
    populate: { path: 'courtUpdates' },
  });
  res.status(200).send(req.user);
});

router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find();
    const judges = await User.find({ userType: 'Judge' });
    const lawyers = await User.find({ userType: 'Lawyer' });
    res.status(200).send({ users, judges, lawyers });
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;

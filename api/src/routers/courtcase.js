import express from 'express';
import CourtCase from '../models/courtcase.js';
import CourtUpdate from '../models/courtupdate.js';
import User from '../models/user.js';
import auth from '../middleware/auth.js';
import judgeauth from '../middleware/judgeauth.js';
import url from 'url';

const router = express.Router();

router.post('/courtcases', judgeauth, async (req, res) => {
  const courtCase = new CourtCase({
    ...req.body,
  });

  try {
    await courtCase.save();
    const judge = await User.findOne({ _id: courtCase.judge });
    judge.casesOfInterest.push(courtCase._id);
    judge.save();
    const defendant = await User.findOne({ _id: courtCase.defendant });
    defendant.casesOfInterest.push(courtCase._id);
    defendant.save();
    const plaintiff = await User.findOne({ _id: courtCase.plaintiff });
    plaintiff.casesOfInterest.push(courtCase._id);
    plaintiff.save();
    const prosecutor = await User.findOne({ _id: courtCase.prosecutor });
    prosecutor.casesOfInterest.push(courtCase._id);
    prosecutor.save();
    const defender = await User.findOne({ _id: courtCase.defender });
    defender.casesOfInterest.push(courtCase._id);
    defender.save();
    res.status(201).send(courtCase);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get('/courtcases', auth, async (req, res) => {
  try {
    const courtCases = await CourtCase.find();
    res.status(200).send(courtCases);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/courtcases/updates', auth, async (req, res) => {
  const params = url.parse(req.url, true).query;
  try {
    let courtUpdates = {};
    try {
      courtUpdates = await CourtUpdate.find({ courtCase: params.courtcase });
    } catch (er) {
      courtUpdates = await CourtUpdate.find();
    }
    courtUpdates.sort(function compare(a, b) {
      var dateA = new Date(a.createdAt);
      var dateB = new Date(b.createdAt);
      return dateB - dateA;
    });
    res.status(200).send(courtUpdates);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/courtcases/count', async (req, res) => {
  try {
    const completed = await CourtCase.countDocuments({ closed: false });
    const pending = await CourtCase.countDocuments({ closed: true });
    res.status(200).send({ completed, pending });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/courtcases/:id', auth, async (req, res) => {
  const _id = req.params.id;
  if (_id.length !== 24) {
    return res.status(404).send();
  }

  try {
    const courtCase = await CourtCase.findOne({ _id }).populate('courtUpdates');
    await courtCase.populate(
      'defendant plaintiff defender prosecutor judge interestedUsers',
      '-tokens -password'
    );
    if (!courtCase) {
      return res.status(404).send();
    }

    res.status(200).send(courtCase);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/courtcases/:id', judgeauth, async (req, res) => {
  const _id = req.params.id;
  if (_id.length !== 24) {
    return res.status(404).send();
  }

  try {
    const courtCase = await CourtCase.findOne({ _id });

    if (!courtCase) {
      return res.status(404).send();
    }

    courtCase.closed = req.body.closed;
    await courtCase.save();

    res.status(200).send(courtCase);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/courtcases/:id/updates', auth, async (req, res) => {
  const _id = req.params.id;
  if (_id.length !== 24) {
    return res.status(404).send();
  }

  try {
    const courtCase = await CourtCase.findOne({ _id });

    if (!courtCase) {
      return res.status(404).send();
    }

    await courtCase.populate({
      path: 'courtUpdates',
    });
    const courtUpdates = courtCase.courtUpdates;

    res.status(200).send({ courtUpdates, courtCase });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/courtcases/:id/updates', judgeauth, async (req, res) => {
  const _id = req.params.id;
  const courtUpdate = new CourtUpdate({
    ...req.body,
    courtCase: _id,
  });

  try {
    await courtUpdate.save();
    res.status(201).send(courtUpdate);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;

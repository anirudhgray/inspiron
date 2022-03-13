import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      unique: true,
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      min: 7,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    userType: {
      type: String,
      required: true,
      validate(value) {
        if (
          ![
            'Judge',
            'Lawyer',
            'Public User',
            'Defendant',
            'Plaintiff',
          ].includes(value)
        ) {
          throw new Error('Invalid user type.');
        }
      },
    },
    casesOfInterest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourtCase',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// methods are accessible on instances
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// static methods are accessible on the whole model
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Unable to login.');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Unable to login.');
  }
  return user;
};

// hash plaintext password
userSchema.pre('save', async function (next) {
  // middleware just before saving
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('User', userSchema);

export default User;

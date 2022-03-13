import mongoose from 'mongoose';

const courtCaseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: false,
    },
    defendant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    plaintiff: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    defender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    prosecutor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    judge: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    courtroom: {
      type: String,
      required: true,
      trim: true,
    },
    closed: {
      type: Boolean,
      required: true,
      default: false,
    },
    interestedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courtCaseSchema.virtual('courtUpdates', {
  ref: 'CourtUpdate',
  localField: '_id',
  foreignField: 'courtCase', // the field in the ref with which relationship is being set up.
});

courtCaseSchema.methods.toJSON = function () {
  const courtCaseObject = this.toObject();
  return courtCaseObject;
};

const CourtCase = mongoose.model('CourtCase', courtCaseSchema);

export default CourtCase;

import mongoose from 'mongoose';

const courtUpdateSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    courtCase: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

courtUpdateSchema.methods.toJSON = function () {
  const courtUpdateObject = this.toObject();
  return courtUpdateObject;
};

const CourtUpdate = mongoose.model('CourtUpdate', courtUpdateSchema);

export default CourtUpdate;

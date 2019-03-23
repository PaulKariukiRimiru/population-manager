import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const LocationSchema = new Schema({
  name: {
    type: String,
    required: 'Provide a name for the location',
  },
  female: {
    type: Number,
  },
  male: {
    type: Number,
  },
  parentLocation: {
    type: String,
  }
});

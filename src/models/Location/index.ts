import * as mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

export const LocationSchema = new Schema({
  name: {
    type: String,
    match: [/^[a-zA-Z]/, 'provide a valid string'],
    unique: 'Location names must be unique',
    required: 'Provide a name for the location',
  },
  female: {
    type: Number,
    min: [0, 'provide a positive number'],
    required: 'Provide a total number of females for the location',
  },
  male: {
    type: Number,
    min: [0, 'provide a positive number'],
    required: 'Provide a total number of males  for the location',
  },
  parentLocation: {
    type: String,
  },
});

LocationSchema.plugin(uniqueValidator);

import * as mongoose from 'mongoose';
import { CascadeDeleteSpec } from 'src/controllers/location/interfaces';
import { cascadeDelete } from 'src/controllers/location';

const Schema = mongoose.Schema;

export const LocationSchema = new Schema({
  name: {
    type: String,
    unique: 'Location names must be unique',
    required: 'Provide a name for the location',
  },
  female: {
    type: Number,
    required: 'Provide a total number of females for the location',
  },
  male: {
    type: Number,
    required: 'Provide a total number of males  for the location',
  },
  parentLocation: {
    type: String,
  }
});

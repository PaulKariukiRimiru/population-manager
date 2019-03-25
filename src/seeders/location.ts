import mongoose from 'mongoose';

import { addLocation } from 'src/controllers/location';
import { LocationSchema } from 'src/models/Location';

export const seedData = async () => {
  const locationData = [
    {
      name: 'kiambu',
      female: 0,
      male: 0,
    },
    {
      name: 'nairobi',
      female: 0,
      male: 0,
    },
  ];

  const locationModel = mongoose.model('Location', LocationSchema);

  const results = await Promise.all(
    locationData.map(async (location) => await addLocation(location)),
  );

  if (results.every((trans) => trans.isRight())) {
    await locationModel.find()
      .then(async (locs) => {
        return await Promise.all(
          locs.map(async (loc: any) => {
            return await addLocation({
              name: 'sub-' + loc.name,
              female: 0,
              male: 0,
              parentLocation: loc._id,
            });
          }),
        );
      })
      .catch((err) => err.message);
  }
};

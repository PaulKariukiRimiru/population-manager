import mongoose from 'mongoose';

import { addLocation } from 'src/controllers/location';
import { LocationSchema } from 'src/models/Location';
import { info } from 'src/utils/logs';
import { getConfig, setUpConfig } from 'src/utils/setup';

// tslint:disable-next-line: no-floating-promises
(async () => {
  setUpConfig();
  const { MONGO_URL } = getConfig();

  mongoose.connect(MONGO_URL, { useNewUrlParser: true })
    .then(() => {
      info('database connected');
    })
    .catch((err) => info(err));

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

  for (const location of locationData) {
    await addLocation(location);
  }

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

  await mongoose.disconnect();
})();

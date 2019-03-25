import mongoose from 'mongoose';

import { LocationSchema } from 'src/models/Location';
import { info } from 'src/utils/logs';

export const tearDownLocation = async () => {
  const model = mongoose.model('Location', LocationSchema);

  await model.deleteMany({})
    .then((value) => {
      if (value.ok) {
        info('data deleted');
        return;
      }
      info('data not deleted');
    })
    .catch((err) => info(err));

  await mongoose.disconnect();
};

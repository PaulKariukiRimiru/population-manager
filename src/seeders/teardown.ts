import mongoose from 'mongoose';

import { LocationSchema } from 'src/models/Location';
import { info } from 'src/utils/logs';
import { getConfig, setUpConfig } from 'src/utils/setup';

// tslint:disable-next-line:no-unused-expression
// tslint:disable-next-line: no-floating-promises
(async () => {
  setUpConfig();
  const { MONGO_URL } = getConfig();

  info('tearing down');

  mongoose.connect(MONGO_URL, { useNewUrlParser: true })
    // tslint:disable-next-line:no-empty
    .then(() => {})
    .catch((err) => info(err));

  const model = mongoose.model('Location', LocationSchema);

  await model.deleteMany({})
    .then((value) => {
      if (value.ok) {
        info('data deleted');
        return;
      }
      info('data not deleted');
    })
    .catch((err) => info);

  await mongoose.disconnect();
})();

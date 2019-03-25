import { left, right } from 'fp-ts/lib/Either';
import * as mongoose from 'mongoose';

import { LocationSchema } from 'src/models/Location';

import {
  CascadeDeleteSpec,
  CascadePopulationUpdateSpec,
  LocationDeleteRequest,
  LocationGetRequest,
  LocationGetResponse,
  LocationPostRequest,
  LocationUpdateRequest,
  ModificationOperator,
} from './interfaces';

const getLocationModel = () => mongoose.model('Location', LocationSchema);

export const addLocation = async (locationDetails: LocationPostRequest) => {
  const Location = getLocationModel();
  const newLocation = new Location(locationDetails);

  if (locationDetails.parentLocation) {
    const result = await Location.findById(locationDetails.parentLocation)
      .then((loc: any | null) => {
        if (loc) {
          return right(loc);
        }
        return left('not found');
      })
      .catch((err) => left(err));

    if (result.isLeft()) {
      return left('provide a valid parent location id');
    }
  }

  return await Location.create(newLocation)
    .then(async (location) => {
      if (locationDetails.parentLocation) {
        const result = await cascadePopulationUpdate({
          locationId: locationDetails.parentLocation,
          male: {
            count: locationDetails.male,
            operation: ModificationOperator.add,
          },
          female: {
            count: locationDetails.female,
            operation: ModificationOperator.add,
          },
        });

        return result.isRight() ? right(location) : left(result.value);
      }

      return right(location);
    })
    .catch((err) => left(err));
};

export const deleteLocation = async ({ id }: LocationDeleteRequest) => {
  const Location = getLocationModel();

  return Location.findByIdAndDelete(id)
    .then(async (loc: any | null) => {
      if (loc) {
        await cascadeDelete({
          id,
          parentId: loc.parentLocation,
          male: loc.male,
          female: loc.female,
        });

        return right({
          message: 'delete successfull',
        });
      }

      return left({
        message: 'location specified does not exist',
      });
    })
  .catch((err) => left({
    message: err,
  }));
};

export const updateLocation = async (updates: LocationUpdateRequest) => {
  const Location = getLocationModel();
  return Location.findById(updates.id)
    .then(async (loc: any | null) => {
      if (loc) {
        const updateMales = updates.male ? updates.male : 0;
        const updateFemales = updates.female ? updates.female : 0;

        const maleOperation = loc.male < updateMales ? ModificationOperator.add : ModificationOperator.minus;
        const femaleOperation = loc.female < updateFemales ? ModificationOperator.add : ModificationOperator.minus;

        const maleCount = maleOperation === ModificationOperator.add
          ? updateMales - loc.male
          : loc.male - updateMales;

        const femaleCount = femaleOperation === ModificationOperator.add
          ? updateFemales - loc.female
          : loc.female - updateFemales;

        Object.assign(loc, updates);
        loc.save();

        if (updates.male || updates.female) {

          await cascadePopulationUpdate({
            locationId: loc.parentLocation,
            male: {
              count: maleCount,
              operation: maleOperation,
            },
            female: {
              count: femaleCount,
              operation: femaleOperation,
            },
          });
        }

        return right({
          message: 'location updated',
          data: loc,
        });
      }

      return left({
        message: 'could not find the location',
      });
    })
    .catch((err) => left({
      message: err,
    }),
  );
};

export const getLocation = async ({ name }: LocationGetRequest) => {
  const Location = getLocationModel();
  if (name) {
    return Location.findOne({ name })
      .then((loc: any | null) => {
        if (loc) {
          const location: LocationGetResponse = {
            id: loc._id,
            name: loc.name,
            totalPopulation: loc.male + loc.female,
            summary: {
              male: loc.male,
              female: loc.female,
            },
          };
          return right(location);
        }
        return left('Location not found');
      })
    .catch((err) => left(err.message));
  }

  return Location.find()
    .then((locs) => {
      return right(locs.map((loc: any) => ({
        id: loc._id,
        name: loc.name,
        totalPopulation: loc.male + loc.female,
        summary: {
          male: loc.male,
          female: loc.female,
        },
      })));
    })
    .catch((err) => left(err.message));
};

export const cascadeDelete = async ({ id, parentId, male, female}: CascadeDeleteSpec) => {
  const Location = getLocationModel();
  await Location.find({ parentLocation: id })
    .then(async (locations) => {

      return await Promise.all(
        locations.map(async (location) => {

          return await Location.findByIdAndDelete(location.id)
            .then(async (loc: any | null) => {
              if (loc) {

                return right({
                  message: 'delete successfull',
                });
              }

              return left({
                message: 'location not found',
              });
            })
          .catch((err) => left({
            message: 'delete failed' + err,
          }));
        }),
      );
    })
    .catch((err) => left({
      message: 'could not find anything' + err,
    }),
  );

  await cascadePopulationUpdate({
    locationId: parentId,
    male: {
      count: male,
      operation: ModificationOperator.minus,
    },
    female: {
      count: female,
      operation: ModificationOperator.minus,
    },
  });
};

export const cascadePopulationUpdate = async ({
  locationId,
  male,
  female,
}: CascadePopulationUpdateSpec) => {
  const locationModel = getLocationModel();
  return locationModel.findById(locationId)
    .then(async (loc: any | null) => {
      if (loc) {
        loc.male = male.operation === ModificationOperator.add
          ? loc.male + male.count
          : loc.male - male.count;

        loc.female = female.operation === ModificationOperator.add
          ? loc.female + female.count
          : loc.female - female.count;
        loc.save();

        if (loc.parentLocation) {
          await cascadePopulationUpdate({
            locationId: loc.parentLocation,
            male,
            female,
          });
        }
        return right('cascade complete');
      }

      return left('parent not found');
    })
    .catch((err) => left('error found'));
};

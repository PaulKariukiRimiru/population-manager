import { Either, left, right } from 'fp-ts/lib/Either';
import * as mongoose from 'mongoose';
import { LocationSchema } from 'src/models/Location';

import { CascadeDeleteSpec, CascadePopulationUpdateSpec, LocationRequest, ModificationOperator } from './interfaces';

const getLocationModel = () => mongoose.model('Location', LocationSchema);

export const addLocation = async (locationDetails: LocationRequest) => {
  const Location = getLocationModel();
  const newLocation = new Location(locationDetails);

  return await newLocation.save()
    .then(async (location) => {
      if (locationDetails.parentLocation) {
        await cascadePopulationUpdate({
          locationId: locationDetails.parentLocation,
          male: locationDetails.male,
          female: locationDetails.female,
          operation: ModificationOperator.add,
        });
      }
      return right(location);
    })
    .catch((err) => left(err));
};

export const deleteLocation = async (id: string) => {
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
    male,
    female,
    operation: ModificationOperator.minus,
  });
};

export const cascadePopulationUpdate = async ({
  locationId,
  male,
  female,
  operation,
}: CascadePopulationUpdateSpec) => {
  const locationModel = getLocationModel();
  locationModel.findById(locationId, async (err, loc: any | null) => {
    if (loc) {
      if (operation === ModificationOperator.add) {
        loc.male += male;
        loc.female += female;
      } else {
        loc.male -= male;
        loc.female -= female;
      }
      loc.save();

      if (loc.parentLocation) {
        await cascadePopulationUpdate({
          locationId: loc.parentLocation,
          male,
          female,
          operation,
        });
      }
    }
  });
};

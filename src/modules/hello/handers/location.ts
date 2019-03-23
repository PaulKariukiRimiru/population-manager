import { Request, Response } from 'express';

import { addLocation, deleteLocation, getLocation, updateLocation } from 'src/controllers/location';
import { ResponseBody, ResponseStatus } from 'src/modules/interfaces';

export const getLocationHandler = async (req: Request, res: Response) => {
  const result = await getLocation(req.query);

  if (result.isRight()) {
    const response: ResponseBody = {
      status: ResponseStatus.success,
      data: result.value,
    };

    res.json(response);
  } else {
    const response: ResponseBody = {
      status: ResponseStatus.failed,
      data: result.value,
    };

    res.send(response);
  }
};

export const postLocationHandler = async (req: Request, res: Response) => {
  const result = await addLocation(req.body);

  if (result.isRight()) {
    const response: ResponseBody = {
      status: ResponseStatus.success,
      data: result.value,
    };

    res.json(response);
  } else {
    const response: ResponseBody = {
      status: ResponseStatus.failed,
      data: result.value,
    };

    res.send(response);
  }
};

export const deleteLocationHandler = async (req: Request, res: Response) => {
  const result = await deleteLocation(req.body);

  if (result.isRight()) {
    const response: ResponseBody = {
      status: ResponseStatus.success,
      data: result.value,
    };

    res.json(response);
  } else {
    const response: ResponseBody = {
      status: ResponseStatus.failed,
      data: result.value,
    };

    res.send(response);
  }
};

export const updateLocationHandler = async (req: Request, res: Response) => {
  const result = await updateLocation(req.body);

  if (result.isRight()) {
    const response: ResponseBody = {
      status: ResponseStatus.success,
      data: result.value,
    };

    res.json(response);
  } else {
    const response: ResponseBody = {
      status: ResponseStatus.failed,
      data: result.value,
    };

    res.send(response);
  }
};

import type { Request, Response } from "express";
import DeliveryAddress from "../../models/deliveryAddress.model.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const getUserAddresses = async (_req: Request, res: Response) => {
  const addresses = await DeliveryAddress.findAll({
    where: { userId: res.locals.user_id },
    order: [["isDefault", "DESC"], ["createdAt", "DESC"]],
  });

  const response = addresses.map((address) => ({
    id: address.id,
    userId: address.userId,
    label: address.label,
    receiverName: address.receiverName,
    receiverPhone: address.receiverPhone,
    addressLine: address.addressLine,
    ...(address.area !== null ? { area: address.area } : {}),
    ...(address.landmark !== null ? { landmark: address.landmark } : {}),
    city: address.city,
    state: address.state,
    ...(address.postalCode !== null ? { postalCode: address.postalCode } : {}),
    latitude: address.latitude,
    longitude: address.longitude,
    isDefault: address.isDefault,
    createdAt: address.createdAt.toISOString(),
    updatedAt: address.updatedAt.toISOString(),
  }));

  return ApiResponse(res, response, "Addresses fetched successfully", 200);
};
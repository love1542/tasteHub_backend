import { UserRole } from "../constants.js";
import AppError from "./errorHandling.js";

export const getUserRoleFromHeader = (
  roleHeader: string | string[] | undefined
): UserRole => {
  if (typeof roleHeader === "string" && Object.values(UserRole).includes(roleHeader as UserRole)) {
    return roleHeader as UserRole;
  }

  throw new AppError("X-User-Role header must be 'user' or 'owner'", 400);
};
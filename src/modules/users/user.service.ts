import { Types } from "mongoose";
import { User } from "./user.model";
import { hashPassword } from "../../utils/hash";

interface ListQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

export const listUsers = async (query: ListQuery) => {
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(100, Number(query.limit || 10));
  const skip = (page - 1) * limit;

  const filter: any = {};

  if (query.search) {
    const regex = new RegExp(query.search, "i");
    filter.$or = [{ name: regex }, { email: regex }];
  }
  if (query.role) filter.role = query.role;
  if (typeof query.isActive !== "undefined") {
    filter.isActive = query.isActive === true;
  }

  const [items, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  return {
    items,
    meta: { total, page, limit, pages: Math.ceil(total / limit) || 1 },
  };
};

export const getUserById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return User.findById(id).select("-password");
};

export const updateUserById = async (id: string, payload: Partial<any>) => {
  if (!Types.ObjectId.isValid(id)) throw new Error("Invalid user id");

  const toUpdate: any = {};
  if (payload.name) toUpdate.name = payload.name;
  if (payload.email) toUpdate.email = payload.email;
  if (typeof payload.role !== "undefined") toUpdate.role = payload.role;
  if (typeof payload.isActive !== "undefined")
    toUpdate.isActive = payload.isActive;

  if (payload.password) {
    toUpdate.password = await hashPassword(payload.password);
  }

  const user = await User.findByIdAndUpdate(id, toUpdate, { new: true }).select(
    "-password"
  );
  return user;
};

export const softDeleteUserById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) throw new Error("Invalid user id");
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
};

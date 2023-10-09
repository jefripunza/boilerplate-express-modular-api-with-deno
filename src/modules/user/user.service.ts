// @deno-types="npm:@types/express@4"
import { Response } from "npm:express@4.18.2";

import { StatusCodes } from "npm:http-status-codes@2.2.0";
import * as DTO from "../../dto.ts";

import UserModel, { User } from "../user/user.model.ts";
import UserAddressModel from "./user-address.model.ts";

import * as encryption from "../../utils/encryption.ts";

class UserService {
  async init(id: string) {
    try {
      const user = await UserModel.findOne(
        {
          _id: id,
        },
        { _id: 0, password: 0, __v: 0 }
      )
        .populate("role")
        .then((doc: any) => {
          doc.role = doc?.role.name;
          return doc;
        });

      const data: any = user;
      return DTO.successResponse({
        data,
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("user.init", error);
    }
  }

  async updateUser(id: string, name: string, profile_image: string) {
    try {
      const updated: any = {};
      if (name) {
        updated["name"] = name;
      }
      if (profile_image) {
        updated["profile_image"] = profile_image;
      }

      const { matchedCount, modifiedCount } = await UserModel.updateOne(
        {
          _id: id,
        },
        updated
      );

      return DTO.successResponse({
        data: { matchedCount, modifiedCount },
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("user.updateUser", error);
    }
  }

  // ======================================================================== //
  // -> User Address

  async createUserAddress(
    user: string,
    title: string,
    full: string,
    coordinate: string[],
    postcode: string,
    rajaongkirCode: string
  ) {
    try {
      const user_address = await UserAddressModel.find({
        user,
      });
      let isDefault = true;
      if (user_address.length > 0) {
        isDefault = false;
      }
      const { id } = await UserAddressModel.create({
        user,

        title,
        full,
        coordinate,
        postcode,
        rajaongkirCode,

        isDefault,
      });

      return DTO.successResponse({
        message: "success create new address",
        statusCode: StatusCodes.CREATED,
        data: {
          id,
        },
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("user.createUserAddress", error);
    }
  }

  async listUserAddress(user: string) {
    try {
      const data = await UserAddressModel.find({
        user,
        deletedAt: { $exists: false },
      });

      return DTO.successResponse({
        data,
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("user.listUserAddress", error);
    }
  }

  async updateUserAddress(
    user: string,
    addressId: string,

    title: string,
    full: string,
    coordinate: string[],
    postcode: string,
    rajaongkirCode: string
  ) {
    try {
      const isAddressExist = await UserAddressModel.findOne({
        _id: addressId,
        user,
        deletedAt: { $exists: false },
      });
      if (!isAddressExist) {
        return DTO.errorResponse({
          message: "alamat tidak ditemukan",
        });
      }

      const updated: any = {};
      if (title) {
        updated["title"] = title;
      }
      if (full) {
        updated["full"] = full;
      }
      if (coordinate) {
        updated["coordinate"] = coordinate;
      }
      if (postcode) {
        updated["postcode"] = postcode;
      }
      if (rajaongkirCode) {
        updated["rajaongkirCode"] = rajaongkirCode;
      }

      await UserAddressModel.updateOne(
        {
          _id: addressId,
          user,
        },
        updated
      );

      return DTO.successResponse({
        message: "berhasil mengubah alamat",
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("user.updateUserAddress", error);
    }
  }

  async setDefaultUserAddress(user: string, addressId: string) {
    try {
      const isAddressExist = await UserAddressModel.findOne({
        _id: addressId,
        user,
        deletedAt: { $exists: false },
      });
      if (!isAddressExist) {
        return DTO.errorResponse({
          message: "alamat tidak ditemukan",
        });
      }

      await UserAddressModel.updateMany(
        {
          user,
        },
        {
          isDefault: false,
        }
      );
      await UserAddressModel.updateOne(
        {
          _id: addressId,
          user,
        },
        {
          isDefault: true,
        }
      );

      return DTO.successResponse({
        message: "berhasil mengubah alamat yang digunakan",
      });
    } catch (error) {
      return DTO.internalServerErrorResponse(
        "user.setDefaultUserAddress",
        error
      );
    }
  }

  async deleteUserAddress(user: string, addressId: string) {
    try {
      const isAddressExist = await UserAddressModel.findOne({
        _id: addressId,
        user,
        deletedAt: { $exists: false },
      });
      if (!isAddressExist) {
        return DTO.errorResponse({
          message: "alamat tidak ditemukan",
        });
      }

      await UserAddressModel.updateOne(
        {
          _id: addressId,
          user,
        },
        {
          deletedAt: new Date(),
        }
      );

      if (isAddressExist.isDefault) {
        await UserAddressModel.updateMany(
          {
            user,
          },
          {
            isDefault: false,
          }
        );
        const listAddress = await UserAddressModel.find({
          user,
        });
        const notDeletedAddress = listAddress.filter((v) => !v.deletedAt);
        if (notDeletedAddress.length >= 1) {
          await UserAddressModel.updateOne(
            {
              _id: notDeletedAddress[0]?.id,
              user,
            },
            {
              isDefault: true,
            }
          );
        }
      }

      return DTO.successResponse({
        message: "berhasil menghapus alamat",
        statusCode: StatusCodes.OK,
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("user.deleteUserAddress", error);
    }
  }
}

export default new UserService();

// deno-lint-ignore-file ban-ts-comment
// @deno-types="npm:@types/express@4"
import { Response } from "npm:express@4.18.2";
// @deno-types="npm:@types/uuid@9.0.0"
import { v4 as uuidv4 } from "npm:uuid@9.0.0";

import { StatusCodes } from "npm:http-status-codes@2.2.0";
import * as DTO from "../../dto.ts";

import ProductCategoryModel, {
  ProductCategory,
} from "./product-category.model.ts";
import ProductModel, { Product, ProductImage } from "./product.model.ts";
import UserModel from "../user/user.model.ts";

import * as encryption from "../../utils/encryption.ts";
import {} from "../../config.ts";

class ProductComment {
  async commentAdd() {
    try {
      return DTO.successResponse({});
    } catch (error) {
      return DTO.internalServerErrorResponse("product.commentAdd", error);
    }
  }
  async commentList() {
    try {
      return DTO.successResponse({});
    } catch (error) {
      return DTO.internalServerErrorResponse("product.commentList", error);
    }
  }
}

class ProductCategoryService extends ProductComment {
  async categoryCreate(name: string, logo: string) {
    try {
      const isCategoryExist = await ProductCategoryModel.findOne({
        name: { $regex: new RegExp("^" + name.toLowerCase(), "i") },
      });
      if (isCategoryExist) {
        return DTO.errorResponse({
          message: "kategori sudah ada sebelumnya",
        });
      }

      await ProductCategoryModel.create({
        name,
        logo,
      });

      return DTO.successResponse({
        message: "berhasil membuat kategori baru",
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("product.categoryCreate", error);
    }
  }

  async categoryList() {
    try {
      const data = await ProductCategoryModel.find({});

      return DTO.successResponse({ data });
    } catch (error) {
      return DTO.internalServerErrorResponse("product.categoryList", error);
    }
  }

  async categoryUpdate(id: string, name: string, logo: string) {
    try {
      const isCategoryExist = await ProductCategoryModel.findOne({
        _id: id,
      });
      if (!isCategoryExist) {
        return DTO.errorResponse({
          message: "kategori tidak ditemukan",
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const updated: any = {};
      if (name) {
        updated["name"] = name;
      }
      if (logo) {
        updated["logo"] = logo;
      }

      await ProductCategoryModel.updateOne(
        {
          _id: id,
        },
        updated
      );

      return DTO.successResponse({ message: "berhasil mengubah kategori" });
    } catch (error) {
      return DTO.internalServerErrorResponse("product.categoryUpdate", error);
    }
  }

  async isProductCategoryHide(id: string) {
    try {
      const isCategoryExist = await ProductCategoryModel.findOne({
        _id: id,
      });
      if (!isCategoryExist) {
        return DTO.errorResponse({
          message: "kategori tidak ditemukan",
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      await ProductCategoryModel.updateOne(
        {
          _id: id,
        },
        {
          isHide: true,
        }
      );

      return DTO.successResponse({});
    } catch (error) {
      return DTO.internalServerErrorResponse(
        "product.isProductCategoryHide",
        error
      );
    }
  }

  async isProductCategoryUnHide(id: string) {
    try {
      const isCategoryExist = await ProductCategoryModel.findOne({
        _id: id,
      });
      if (!isCategoryExist) {
        return DTO.errorResponse({
          message: "kategori tidak ditemukan",
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      await ProductCategoryModel.updateOne(
        {
          _id: id,
        },
        {
          isHide: false,
        }
      );

      return DTO.successResponse({});
    } catch (error) {
      return DTO.internalServerErrorResponse(
        "product.isProductCategoryHide",
        error
      );
    }
  }
}

class ProductService extends ProductCategoryService {
  async checkProductName(user: string, name: string) {
    try {
      const isNameExist = await ProductModel.findOne({
        merchant: user,
        name: { $regex: new RegExp("^" + name.toLowerCase(), "i") },
      });

      return DTO.successResponse({
        message: isNameExist
          ? "nama produk sudah ada sebelumnya"
          : "nama produk belum ada",
        data: {
          exist: isNameExist,
        },
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("product.checkProductName", error);
    }
  }

  async create(
    user: string,

    category: string,
    name: string,
    url: string,
    images: ProductImage[],
    description: string,

    price: number,
    discountPrice: number,
    weightGram: number,
    stock: number,

    isHide = true
  ) {
    if (price < 100) {
      return DTO.errorResponse({
        message: "harga produk minimal Rp.100",
      });
    }
    discountPrice = Math.max(0, discountPrice);
    weightGram = Math.max(0, weightGram);
    stock = Math.max(0, stock);

    try {
      const isNameExist = await ProductModel.findOne({
        merchant: user,
        name: { $regex: new RegExp("^" + name.toLowerCase(), "i") },
      });
      if (isNameExist) {
        return DTO.errorResponse({
          message: "nama produk sudah ada sebelumnya",
        });
      }

      const isCategoryExist = await ProductCategoryModel.findOne({
        _id: category,
        isHide: false,
      });
      if (!isCategoryExist) {
        return DTO.errorResponse({
          message: "kategori tidak tersedia",
        });
      }

      const merchant = await UserModel.findOne({
        _id: user,
      });
      const username = String(merchant?.username).toLowerCase();
      url = username + String(url).toLowerCase();

      await ProductModel.create({
        name,
        url,
        images,
        description,

        category,
        merchant: user,

        price,
        discountPrice,
        weightGram,
        stock,

        isHide,
      });

      return DTO.successResponse({
        message: "berhasil membuat produk baru",
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("product.create", error);
    }
  }

  async paginate(search: string, page = 1, perPage = 10) {
    try {
      const data = await ProductModel.find(
        {
          $or: [
            { name: { $regex: ".*" + search + ".*", $options: "i" } },
            { description: { $regex: ".*" + search + ".*", $options: "i" } },
          ],
          deletedAt: { $exists: false },
        },
        {},
        {
          skip: perPage * page,
          limit: perPage,
          sort: {
            name: "asc",
          },
        }
      );
      const total = await ProductModel.count();
      return DTO.successResponse({
        data: {
          data,
          page,
          perPage,
          total,
        },
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("product.paginate", error);
    }
  }

  async detail(productId: string) {
    try {
      const product: any = await ProductModel.findOne({
        _id: productId,
      });
      return DTO.successResponse({
        data: product,
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("product.detail", error);
    }
  }

  async update(
    productId: string,

    user: string,

    category: string,
    name: string,
    url: string,
    images: ProductImage[],
    description: string,

    price: number,
    discountPrice: number,
    weightGram: number,
    stock: number
  ) {
    const updated: any = {};
    if (price) {
      if (price < 100) {
        return DTO.errorResponse({
          message: "harga produk minimal Rp.100",
        });
      }
      updated["price"] = price;
    }
    if (discountPrice) {
      updated["discountPrice"] = Math.max(0, discountPrice);
    }
    if (weightGram) {
      updated["weightGram"] = Math.max(0, weightGram);
    }
    if (stock) {
      updated["stock"] = Math.max(0, stock);
    }

    try {
      if (name) {
        const isNameExist = await ProductModel.findOne({
          merchant: user,
          name: { $regex: new RegExp("^" + name.toLowerCase(), "i") },
        });
        if (isNameExist) {
          return DTO.errorResponse({
            message: "nama produk sudah ada sebelumnya",
          });
        }
        updated["name"] = name;
      }

      const merchant = await UserModel.findOne({
        _id: user,
      });
      const username = String(merchant?.username).toLowerCase();
      url = username + String(url).toLowerCase();

      const isCategoryExist = await ProductCategoryModel.findOne({
        _id: category,
        isHide: false,
      });
      if (!isCategoryExist) {
        return DTO.errorResponse({
          message: "kategori tidak tersedia",
        });
      }

      await ProductModel.updateOne({}, updated);

      return DTO.successResponse({
        message: "berhasil membuat produk baru",
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("product.update", error);
    }
  }
  async remove() {
    try {
      return DTO.successResponse({});
    } catch (error) {
      return DTO.internalServerErrorResponse("product.remove", error);
    }
  }
  async isProductHide() {
    try {
      return DTO.successResponse({});
    } catch (error) {
      return DTO.internalServerErrorResponse("product.isProductHide", error);
    }
  }
}

export default new ProductService();

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProductChangeHistory,
  ProductChangeHistoryDocument,
} from 'src/product-change-histories/schemas/product-change-history.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ProductChangeHistory.name)
    private productChangeHistoryModel: Model<ProductChangeHistoryDocument>,
  ) {}

  async create(createProductDto: CreateProductDto, userId: string) {
    const product = new this.productModel({
      ...createProductDto,
      createdBy: userId,
    });

    const descriptions = [
      `Created ${product.name}.`,
      `Initial quantity: ${product.quantity}`,
      `Unit: ${product.unit}`,
      `Price: ₱${product.pricePerUnit}`,
    ];

    const productHistory = new this.productChangeHistoryModel({
      descriptions,
      product: product._id,
      changedBy: userId,
    });
    await productHistory.save();
    return product.save();
  }

  async findAll(skip: number, limit: number, filter: any) {
    const { property, value } = filter;
    const data = await this.productModel
      .find({ [property]: new RegExp(value, 'ig') })
      .sort({ name: 'asc' })
      .skip(skip)
      .limit(limit);

    const total = await this.productModel.count(filter);

    return {
      data,
      total,
    };
  }

  findOne(id: string) {
    return this.productModel.findById(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    const product = await this.productModel.findById(id);
    const properties = ['name', 'pricePerUnit', 'unit', 'quantity'];

    const changes = properties.reduce((acc, prop) => {
      const to = isNaN(updateProductDto[prop])
        ? updateProductDto[prop]
        : Number(updateProductDto[prop]);

      if (product[prop] !== updateProductDto[prop]) {
        acc[prop] = {
          from: product[prop],
          to,
        };
      }
      return acc;
    }, {});

    if (Object.keys(changes).length > 0) {
      const descriptions = [];

      Object.keys(changes).forEach((prop) => {
        const change = changes[prop];

        if (prop === 'pricePerUnit') {
          descriptions.push(
            `Updated price from ₱${change.from} to ₱${change.to}`,
          );
        } else {
          descriptions.push(
            `Updated ${prop} from ${change.from} to ${change.to}`,
          );
        }
      });

      const productHistory = new this.productChangeHistoryModel({
        descriptions,
        changes,
        product: product._id,
        createdFrom: 'Manual Update',
        changedBy: userId,
      });

      await productHistory.save();
    }

    return this.productModel.findByIdAndUpdate(
      id,
      { ...updateProductDto, updatedBy: userId },
      {
        new: true,
      },
    );
  }

  async remove(id: string) {
    await this.productChangeHistoryModel.deleteMany({ product: id });
    return this.productModel.deleteOne({ _id: id });
  }

  async removeMany(ids: [string]) {
    const articles = this.productModel.find({ _id: { $in: ids } });
    await this.productModel.deleteMany({ _id: { $in: ids } });
    return articles;
  }
}

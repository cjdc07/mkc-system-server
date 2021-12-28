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

  async create(createProductDto: CreateProductDto) {
    const product = new this.productModel(createProductDto);
    const productHistory = new this.productChangeHistoryModel({
      description: `Created ${product.name}. ${product.quantity} ${product.unit}s at ₱${product.pricePerUnit} per ${product.unit}.`,
      product: product._id,
    });
    await productHistory.save();
    return product.save();
  }

  async findAll(skip: number, limit: number) {
    const data = await this.productModel
      .find({})
      .skip(skip)
      .limit(limit)
      .sort({ name: 'asc' });

    const total = await this.productModel.count({});

    return {
      data,
      total,
    };
  }

  findOne(id: string) {
    return this.productModel.findById(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findById(id);
    const properties = ['name', 'pricePerUnit', 'unit', 'quantity'];

    const changes = properties.reduce((acc, prop) => {
      if (product[prop] !== updateProductDto[prop]) {
        acc[prop] = {
          from: product[prop],
          to: updateProductDto[prop],
        };
      }
      return acc;
    }, {});

    if (Object.keys(changes).length > 0) {
      let description = 'Updated';

      Object.keys(changes).forEach((prop, index) => {
        const change = changes[prop];

        if (prop === 'pricePerUnit') {
          description += ` price per unit from ₱${change.from} to ₱${change.to}`;
        } else {
          description += ` ${prop} from ${change.from} to ${change.to}`;
        }

        if (index < Object.keys(changes).length - 1) {
          description += ', ';
        } else {
          description += '.';
        }
      });

      const productHistory = new this.productChangeHistoryModel({
        description,
        product: product._id,
        createdFrom: 'Manual Update',
      });

      await productHistory.save();
    }

    return this.productModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.productModel.deleteOne({ _id: id });
  }

  async removeMany(ids: [string]) {
    const articles = this.productModel.find({ _id: { $in: ids } });
    await this.productModel.deleteMany({ _id: { $in: ids } });
    return articles;
  }
}

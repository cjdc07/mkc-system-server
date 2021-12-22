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
      quantity: product.quantity,
      quantityChange: product.quantity,
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

    console.log(updateProductDto.quantity, product.quantity);

    const productHistory = new this.productChangeHistoryModel({
      quantity: updateProductDto.quantity,
      quantityChange: updateProductDto.quantity - product.quantity,
      product: product._id,
      type: 'Manual Update',
    });

    await productHistory.save();

    return this.productModel.findOneAndUpdate(
      { _id: id },
      { ...updateProductDto, updatedAt: Date.now() },
      { new: true },
    );
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

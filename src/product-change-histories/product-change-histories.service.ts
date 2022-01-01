import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ProductChangeHistory,
  ProductChangeHistoryDocument,
} from './schemas/product-change-history.schema';

@Injectable()
export class ProductChangeHistoriesService {
  constructor(
    @InjectModel(ProductChangeHistory.name)
    private productChangeHistoryModel: Model<ProductChangeHistoryDocument>,
  ) {}

  async findAll(filter: any, skip: number, limit: number) {
    const data = await this.productChangeHistoryModel
      .find(filter)
      .populate('changedBy')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' });

    const total = await this.productChangeHistoryModel.count(filter);

    return {
      data,
      total,
    };
  }
}

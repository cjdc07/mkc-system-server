import { v4 as uuidv4 } from 'uuid';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/products/schemas/product.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';
import {
  ProductChangeHistory,
  ProductChangeHistoryDocument,
} from 'src/product-change-histories/schemas/product-change-history.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ProductChangeHistory.name)
    private productChangeHistoryModel: Model<ProductChangeHistoryDocument>,
  ) {}

  async updateProductQuantity(productOrders, userId, status) {
    const products = productOrders.map(({ id, quantity }) => ({
      id,
      quantity,
    }));

    await Promise.all(
      products.map(async ({ id, quantity }) => {
        const product = await this.productModel.findById(id);

        if (!product) {
          // TODO: throw error if product does not exist
          return null;
        }

        let newQuantity = product.quantity;
        const descriptions = [];

        if (status === 'Cancelled') {
          newQuantity += quantity;

          descriptions.push(
            `Cancelled order for ${quantity} ${product.unit}/s. Updated quantity from ${product.quantity} to ${newQuantity}`,
          );
        } else {
          newQuantity -= quantity;

          descriptions.push(
            `Created order for ${quantity} ${product.unit}/s. Updated quantity from ${product.quantity} to ${newQuantity}`,
          );
        }

        const changes = {
          quantity: {
            from: product.quantity,
            to: newQuantity,
          },
        };

        const productHistory = new this.productChangeHistoryModel({
          descriptions,
          changes,
          product: id,
          createdFrom: 'Order',
          changedBy: userId,
        });

        await this.productModel.findByIdAndUpdate(id, {
          quantity: newQuantity,
        });

        await productHistory.save();

        return null;
      }),
    );
  }

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const uuid = uuidv4().split('-')[0].toUpperCase();
    const code = `${today}-${uuid}`;
    const order = new this.orderModel({
      code,
      ...createOrderDto,
      createdBy: userId,
    });

    try {
      await this.updateProductQuantity(
        order.productOrders,
        userId,
        order.status,
      );
      await order.save();
      return order;
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return this.orderModel.aggregate([
      { $match: {} },
      {
        $group: {
          _id: '$status' as any,
          orders: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $project: {
          status: '$_id',
          orders: 1,
          _id: 0,
        },
      },
    ]);
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, userId: string) {
    try {
      const { status, productOrders } = updateOrderDto;

      await this.updateProductQuantity(productOrders, userId, status);

      const updatedOrder = await this.orderModel.findByIdAndUpdate(
        id,
        { ...updateOrderDto, updatedBy: userId },
        { new: true },
      );

      return updatedOrder;
    } catch (error) {
      console.log(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

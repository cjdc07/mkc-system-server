import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/products/schemas/product.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = new this.orderModel(createOrderDto);
    const productIds = order.productOrders.map(({ productId, quantity }) => ({
      productId,
      quantity,
    }));

    await Promise.all(
      productIds.map(async ({ productId, quantity }) => {
        const product = await this.productModel.findById(productId);

        return this.productModel.findByIdAndUpdate(
          productId,
          { quantity: product.quantity - quantity },
          {
            new: true,
          },
        );
      }),
    );

    try {
      await order.save();
      return order;
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

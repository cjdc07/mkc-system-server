import { v4 as uuidv4 } from 'uuid';
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
    const today = new Date().toISOString().split('T')[0];
    const uuid = uuidv4().split('-')[0].toUpperCase();
    const code = `${today}-${uuid}`;
    const order = new this.orderModel({ code, ...createOrderDto });
    const productIds = order.productOrders.map(({ productId, quantity }) => ({
      productId,
      quantity,
    }));

    await Promise.all(
      productIds.map(async ({ productId, quantity }) => {
        const product = await this.productModel.findById(productId);

        if (!product) {
          // TODO: throw error if product does not exist
          return null;
        }

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

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

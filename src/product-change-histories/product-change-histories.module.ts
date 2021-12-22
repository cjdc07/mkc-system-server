import { Module } from '@nestjs/common';
import { ProductChangeHistoriesService } from './product-change-histories.service';
import { ProductChangeHistoriesController } from './product-change-histories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductChangeHistory,
  ProductChangeHistorySchema,
} from './schemas/product-change-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductChangeHistory.name, schema: ProductChangeHistorySchema },
    ]),
  ],
  controllers: [ProductChangeHistoriesController],
  providers: [ProductChangeHistoriesService],
  exports: [
    MongooseModule.forFeature([
      { name: ProductChangeHistory.name, schema: ProductChangeHistorySchema },
    ]),
  ],
})
export class ProductChangeHistoriesModule {}

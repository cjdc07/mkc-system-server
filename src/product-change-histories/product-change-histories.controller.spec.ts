import { Test, TestingModule } from '@nestjs/testing';
import { ProductChangeHistoriesController } from './product-change-histories.controller';
import { ProductChangeHistoriesService } from './product-change-histories.service';

describe('ProductChangeHistoriesController', () => {
  let controller: ProductChangeHistoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductChangeHistoriesController],
      providers: [ProductChangeHistoriesService],
    }).compile();

    controller = module.get<ProductChangeHistoriesController>(
      ProductChangeHistoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

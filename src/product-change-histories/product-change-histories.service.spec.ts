import { Test, TestingModule } from '@nestjs/testing';
import { ProductChangeHistoriesService } from './product-change-histories.service';

describe('ProductChangeHistoriesService', () => {
  let service: ProductChangeHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductChangeHistoriesService],
    }).compile();

    service = module.get<ProductChangeHistoriesService>(
      ProductChangeHistoriesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Controller, Get, Query } from '@nestjs/common';
import { ProductChangeHistoriesService } from './product-change-histories.service';

@Controller('product-change-histories')
export class ProductChangeHistoriesController {
  constructor(
    private readonly productChangeHistoriesService: ProductChangeHistoriesService,
  ) {}

  @Get()
  findAll(
    @Query('filter') filter: string,
    @Query('range') range: string,
    @Query('sort') sort: string,
  ) {
    // const [skip, limit] = JSON.parse(range); // [0, 10]
    // console.log(JSON.parse(sort)); // { createdAt: 'desc' }
    return this.productChangeHistoriesService.findAll(
      JSON.parse(filter),
      0,
      10,
    );
  }
}

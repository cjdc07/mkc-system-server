import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Request() req) {
    const { userId } = req.user;
    return this.productsService.create(createProductDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('filter') filter: string,
    @Query('range') range: string,
    @Query('sort') sort: string,
  ) {
    const [skip, limit] = JSON.parse(range);
    return this.productsService.findAll(skip, limit, JSON.parse(filter));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ) {
    const { userId } = req.user;
    return this.productsService.update(id, updateProductDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  removeMany(@Query('filter') filter: string) {
    const { id: ids } = JSON.parse(filter); // ['xxxx', 'yyyy']
    return this.productsService.removeMany(ids);
  }
}

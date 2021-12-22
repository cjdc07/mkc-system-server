import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ProductChangeHistoriesModule } from './product-change-histories/product-change-histories.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProductsModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
      }),
      inject: [ConfigService],
    }),
    ProductChangeHistoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

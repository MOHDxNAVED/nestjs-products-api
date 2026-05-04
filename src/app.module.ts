import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './middlewares/logger.moddleware';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true // to use in whole 
  }),
  CacheModule.registerAsync({
    isGlobal:true,
    imports:[ConfigModule],
    inject:[ConfigService],
    useFactory:async (configService:ConfigService)=>({
      store:await redisStore({
        // 👆 Redis ko store ki tarah use karo
        socket:{
          host:configService.get<string>('REDIS_HOST'),
          port:configService.get<number>('REDIS_PORT')
        },
        password: configService.get<string>('REDIS_PASSWORD') || undefined,
      // 👆 Password bhi add karo
      }),
      ttl:configService.get<number>('CACHE_TTL')
    })
    
  }),

  // 👇 Rate Limiting Setup
    ThrottlerModule.forRoot([
      {
        name: 'short',       // 👈 Naam — identify karne ke liye
        ttl: 1000,           // 👈 Time window — 1000ms = 1 second
        limit: 3,            // 👈 Is window mein sirf 3 requests
      },
      {
        name: 'long',        // 👈 Doosra rule
        ttl: 60000,          // 👈 Time window — 60000ms = 1 minute
        limit: 100,          // 👈 1 minute mein sirf 100 requests
      },
    ]),

    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({
      type:'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    }),
    ProductModule,
    CategoryModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide:APP_GUARD, // 👈 "Poori app mein guard lagao"
      useClass:ThrottlerGuard //👈 Yeh guard use karo
    }
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware) // apply logger middle ware
    .forRoutes("*")                  // on all routes
  }
}

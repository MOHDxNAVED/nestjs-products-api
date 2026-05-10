import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Get, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './filters/http.ecxception.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // first of all register the global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global Interceptor register
  app.useGlobalInterceptors(new ResponseInterceptor);

  app.enableCors({
    origin:"http://localhost:4200",
    methods:'GET,POST,DELETE,PATCH,PUT,HEAD',
    credentials:true
  })
 
  
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true, // remove extra fields from incomming object
    forbidNonWhitelisted:true, // if extra field is comming in dto through error
    transform:true   // types automatically convert kro
  }))


  app.useStaticAssets(join(__dirname,'..','uploads'),{
    prefix:'/uploads'
  })


  //swagger setup
  const config=new DocumentBuilder()
  .setTitle('CRUD APP API')
  .setDescription('Product and Category APIs')
  .setVersion('1.0')
  .addBearerAuth()   //for JWT
  .build()
  const document=SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('api-docs',app,document)  //URL=/api-docs

  //Port
  const configService=app.get(ConfigService)
  const port=configService.get<number>('PORT')||4000
  await app.listen(port);
  console.log(`application is runnning on port number ${port}`)
  console.log(`Swagger docs: http://localhost:${port}/api-docs 📚`)
}
bootstrap();

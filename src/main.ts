import { FormatResponseExceptionFilter } from './common/exception-filters/format-response.filter';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { FormatResponseInterceptor } from './common/interceptors/format-response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { InvokeRecordInterceptor } from './common/interceptors/invoke-record.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 使用默认的dto校验管道
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  // app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useGlobalFilters(new FormatResponseExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('会议室预定系统')
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt 的认证',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();

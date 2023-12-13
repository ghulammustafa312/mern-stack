import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import {
  toCapitalizeFirst,
  toTitleCase,
} from './common/constants/naming-function';

const extractErrorMessages = (
  error: ValidationError,
  parent?: ValidationError,
) => {
  let messages = [];
  if (error.constraints) {
    messages = Object.values(error.constraints).map((err) =>
      toCapitalizeFirst(
        err
          .replace(
            new RegExp(error.property, 'g'),
            toTitleCase(error.property) +
              (parent ? ` (in ${toTitleCase(parent.property)})` : ''),
          )
          .replace(/No /g, 'Number ')
          .replace(/a string/g, 'text')
          .replace(/should not be empty/g, 'is required')
          .replace(
            /.*must be a mongodb id/g,
            `Select a valid ${toTitleCase(error.property.replace(/id/i, ''))}`,
          ),
      ),
    );
  }
  if (error.children) {
    error.children.forEach((childError) => {
      messages = [...messages, ...extractErrorMessages(childError, error)];
    });
  }
  return messages;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('MERN Stack Project')
    .setDescription('MERN Stack Project API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        let errors: null | string[] = null;
        validationErrors.forEach((error) => {
          const errMessages = extractErrorMessages(error);
          if (errMessages.length) {
            errors = !errors?.length
              ? [...errMessages]
              : [...errors, ...errMessages];
          }
        });
        return new BadRequestException(errors);
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import * as Joi from '@hapi/joi';
import HttpResponse from '../libs/http-respones';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.Schema) {}

  public transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value, { abortEarly: false });
    if (error) {
      const { details } = error;
      let errorMessage: string = details[0].message;
      errorMessage = errorMessage.replace(/"/g, '');
      throw new BadRequestException(HttpResponse.error(errorMessage));
    }
    return value;
  }
}

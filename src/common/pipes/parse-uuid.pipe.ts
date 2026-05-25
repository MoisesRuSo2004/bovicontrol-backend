import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseUUIDPipe implements PipeTransform<string> {
  private readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  transform(value: string): string {
    if (!this.UUID_REGEX.test(value)) {
      throw new BadRequestException(`El valor "${value}" no es un UUID válido`);
    }
    return value;
  }
}

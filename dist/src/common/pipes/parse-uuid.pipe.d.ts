import { PipeTransform } from '@nestjs/common';
export declare class ParseUUIDPipe implements PipeTransform<string> {
    private readonly UUID_REGEX;
    transform(value: string): string;
}

import { Controller, Get } from '@nestjs/common';

@Controller('ipa')
export class IpaController {
  @Get()
  findAll(): string {
    return 'test return from nestjs';
  }
}

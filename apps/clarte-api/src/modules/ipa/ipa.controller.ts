import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  Query,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { IpaService } from './ipa.service';
import { DictionaryEntryExampleDto } from '../dictionary/dto/dictionary-entry-example.dto';
import { FindExamplesQueryDto } from './dto/find-examples-query.dto';

@ApiTags('IPA Symbols')
@Controller('ipa-symbols')
@UseInterceptors(ClassSerializerInterceptor) // Optional: Use ClassSerializerInterceptor if your DTOs use @Exclude/@Expose
export class IpaController {
  constructor(private readonly ipaService: IpaService) {}

  @Get(':symbol/examples')
  @ApiOperation({
    summary: 'Find random dictionary examples for an IPA symbol',
  })
  @ApiParam({
    name: 'symbol',
    description: 'The IPA symbol (e.g., "p", "o")',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of random examples to return',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'An array of random dictionary examples',
    type: [DictionaryEntryExampleDto],
  })
  @ApiResponse({
    status: 404,
    description: 'IPA Symbol not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getRandomExamples(
    @Param('symbol') symbol: string,
    @Query() queryDto: FindExamplesQueryDto,
  ): Promise<DictionaryEntryExampleDto[]> {
    try {
      const limit = queryDto.limit ?? 30;

      return await this.ipaService.findRandomDictionaryExamples(symbol, limit);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Could not fetch examples.');
    }
  }
}

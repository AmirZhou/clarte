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
import {
  DictionaryEntryExampleDto,
  FindExamplesQueryDto,
  FindAllIpaQueryDto,
  IpaWithExamplesDto,
  IpaWithoutExamplesDto,
} from '@clarte/dto';
import { plainToInstance } from 'class-transformer';

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

      const entries = await this.ipaService.findRandomDictionaryExamples(
        symbol,
        limit,
      );
      const dtos = plainToInstance(DictionaryEntryExampleDto, entries, {
        excludeExtraneousValues: true,
      });
      return dtos;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Could not fetch examples.');
    }
  }

  @Get('all')
  async getAllSymbols(
    @Query() queryDto: FindAllIpaQueryDto,
  ): Promise<IpaWithExamplesDto[]> {
    const withExamples = queryDto.withExamples ?? true; // what's the industry common sense of this const naming?
    const limit = queryDto.limit ?? 30;

    const symbols = await this.ipaService.findAll(withExamples, limit);
    // console.log(symbols[0]);
    const dtos = plainToInstance(IpaWithExamplesDto, symbols); // alternative: instance to instance

    // console.log(dtos[0]);
    return dtos;
  }

  @Get('symbols-list')
  async getSymbolsList(): Promise<IpaWithoutExamplesDto[]> {
    const symbols = await this.ipaService.findSymbolsWithoutExamples();
    const dtos = plainToInstance(IpaWithoutExamplesDto, symbols);

    return dtos;
  }
}

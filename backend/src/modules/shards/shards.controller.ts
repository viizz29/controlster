import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateShardDto } from './dto/create-shard.dto';
import { ShardsService } from './shards.service';

@Public()
@Controller('shards')
export class ShardsController {
  constructor(private readonly shardsService: ShardsService) {}

  @Post()
  create(@Body() dto: CreateShardDto) {
    return this.shardsService.create(dto);
  }

  @Get()
  findAll() {
    return this.shardsService.findAll();
  }
}

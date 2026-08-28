import { Controller, Get, Param } from '@nestjs/common'
import { BranchesService } from './branches.service'

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  async findAll() {
    return this.branchesService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id)
  }

  @Get(':id/menu')
  async getBranchMenu(@Param('id') id: string) {
    return this.branchesService.getBranchMenu(id)
  }
}

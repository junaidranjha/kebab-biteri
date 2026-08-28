import { Controller, Get, Param } from '@nestjs/common'
import { MenuService } from './menu.service'

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenu() {
    return this.menuService.getMenu()
  }

  @Get('categories')
  async getCategories() {
    return this.menuService.getCategories()
  }

  @Get('products/popular')
  async getPopular() {
    return this.menuService.getPopularProducts()
  }

  @Get('products/:slug')
  async getProduct(@Param('slug') slug: string) {
    return this.menuService.getProductBySlug(slug)
  }
}

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Category, Product, Promotion } from '../schemas'

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Promotion.name) private promotionModel: Model<Promotion>,
  ) {}

  async getMenu() {
    const categories = await this.categoryModel.find({ isActive: true }).sort({ sortOrder: 1 }).lean()
    const products = await this.productModel.find({ isActive: true, deletedAt: null }).sort({ name: 1 }).lean()
    const promotions = await this.promotionModel.find({ isActive: true }).sort({ sortOrder: 1 }).lean()
    return { categories, products, promotions }
  }

  async getCategories() {
    return this.categoryModel.find({ isActive: true }).sort({ sortOrder: 1 }).lean()
  }

  async getPopularProducts() {
    return this.productModel.find({ isActive: true, isPopular: true, deletedAt: null }).lean()
  }

  async getProductBySlug(slug: string) {
    return this.productModel.findOne({ slug, isActive: true }).lean()
  }
}

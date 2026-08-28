import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Order, Product, Category, Branch, Coupon, Promotion, User } from '../schemas'
import { OrdersService } from '../orders/orders.service'

function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Branch.name) private branchModel: Model<Branch>,
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
    @InjectModel(Promotion.name) private promotionModel: Model<Promotion>,
    @InjectModel(User.name) private userModel: Model<User>,
    private ordersService: OrdersService,
  ) {}

  async getOrders(page = 1, limit = 20, status?: string, branchId?: string) {
    const filter: Record<string, unknown> = {}
    if (status) filter.status = status
    if (branchId) filter.branchId = new Types.ObjectId(branchId)
    const skip = (page - 1) * limit
    const orders = await this.orderModel.find(filter).sort({ placedAt: -1 }).skip(skip).limit(limit).populate("userId", "firstName lastName email phone").lean()
    const total = await this.orderModel.countDocuments(filter)
    return { data: orders, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async updateOrderStatus(orderId: string, status: string, userId: string) {
    return this.ordersService.updateStatus(orderId, status, userId)
  }

  async getProducts() {
    return this.productModel.find({ deletedAt: null }).lean()
  }

  async createProduct(body: any) {
    return this.productModel.create({ ...body, slug: slugify(body.name) + '-' + Date.now().toString(36) })
  }

  async updateProduct(id: string, body: any) {
    const product = await this.productModel.findById(id)
    if (!product) throw new NotFoundException('Producto no encontrado')
    Object.assign(product, body)
    await product.save()
    return product
  }

  async deleteProduct(id: string) {
    return this.productModel.findByIdAndUpdate(id, { deletedAt: new Date(), isActive: false }, { new: true })
  }

  async createCategory(body: any) {
    return this.categoryModel.create({ ...body, slug: slugify(body.name) + '-' + Date.now().toString(36) })
  }

  async updateCategory(id: string, body: any) {
    return this.categoryModel.findByIdAndUpdate(id, body, { new: true })
  }

  async createCoupon(body: any) {
    const existing = await this.couponModel.findOne({ code: body.code })
    if (existing) throw new ConflictException('Este código de cupón ya existe')
    return this.couponModel.create(body)
  }

  async createPromotion(body: any) {
    return this.promotionModel.create(body)
  }

  async getAnalytics(from?: string, to?: string) {
    const dateFilter: Record<string, unknown> = {}
    if (from || to) {
      dateFilter.placedAt = {}
      if (from) (dateFilter.placedAt as any).$gte = new Date(from)
      if (to) (dateFilter.placedAt as any).$lte = new Date(to)
    }

    const totalOrders = await this.orderModel.countDocuments(dateFilter)
    const revenueResult = await this.orderModel.aggregate([
      { $match: { ...dateFilter, status: { $nin: ['CANCELLED', 'REJECTED'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ])
    const totalRevenue = revenueResult[0]?.total ?? 0
    const statusCounts = await this.orderModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])
    const recentOrders = await this.orderModel.find().sort({ placedAt: -1 }).limit(10).lean()
    
    return {
      totalOrders,
      totalRevenue,
      ordersByStatus: statusCounts.reduce((acc: Record<string, number>, s: any) => { acc[s._id] = s.count; return acc }, {}),
      recentOrders,
    }
  }

  async getCustomers(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const users = await this.userModel
      .find({ role: 'CUSTOMER', deletedAt: null })
      .select('firstName lastName email phone createdAt lastLoginAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    const total = await this.userModel.countDocuments({ role: 'CUSTOMER', deletedAt: null })
    return { data: users, total, page, limit, totalPages: Math.ceil(total / limit) }
  }
}

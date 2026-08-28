import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Branch } from '../schemas'

@Injectable()
export class BranchesService {
  constructor(@InjectModel(Branch.name) private branchModel: Model<Branch>) {}

  async findAll() {
    return this.branchModel.find({ isActive: true }).sort({ name: 1 }).lean()
  }

  async findOne(id: string) {
    const branch = await this.branchModel.findById(id).lean()
    if (!branch) throw new NotFoundException('Sucursal no encontrada')
    return branch
  }

  async getBranchMenu(id: string) {
    const branch = await this.branchModel.findById(id).lean()
    if (!branch) throw new NotFoundException('Sucursal no encontrada')
    return { branch }
  }

  async checkDeliveryZone(branchId: string, lat: number, lng: number) {
    const branch = await this.branchModel.findById(branchId).lean()
    if (!branch) throw new NotFoundException('Sucursal no encontrada')

    const distance = this.calculateDistance(branch.lat, branch.lng, lat, lng)
    const inRange = distance <= branch.deliveryRadiusKm

    return {
      inRange,
      distance: Math.round(distance * 100) / 100,
      deliveryFee: branch.deliveryFee,
      minOrderAmount: branch.minOrderAmount,
      estimatedPrepTime: branch.avgPrepTimeMin,
    }
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }
}

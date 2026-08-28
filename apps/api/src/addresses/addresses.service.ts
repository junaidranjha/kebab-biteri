import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Address } from '../schemas'

@Injectable()
export class AddressesService {
  constructor(@InjectModel(Address.name) private addressModel: Model<Address>) {}

  async findAll(userId: string) {
    return this.addressModel.find({ userId: new Types.ObjectId(userId) }).sort({ isDefault: -1 }).lean()
  }

  async create(userId: string, dto: any) {
    if (dto.isDefault) {
      await this.addressModel.updateMany(
        { userId: new Types.ObjectId(userId), isDefault: true },
        { isDefault: false },
      )
    }
    return this.addressModel.create({ ...dto, userId: new Types.ObjectId(userId) })
  }

  async update(userId: string, id: string, dto: any) {
    const address = await this.addressModel.findById(id)
    if (!address) throw new NotFoundException('Dirección no encontrada')
    if (address.userId.toString() !== userId) throw new ForbiddenException('No autorizado')

    if (dto.isDefault) {
      await this.addressModel.updateMany(
        { userId: new Types.ObjectId(userId), isDefault: true, _id: { $ne: id } },
        { isDefault: false },
      )
    }

    Object.assign(address, dto)
    await address.save()
    return address
  }

  async remove(userId: string, id: string) {
    const address = await this.addressModel.findById(id)
    if (!address) throw new NotFoundException('Dirección no encontrada')
    if (address.userId.toString() !== userId) throw new ForbiddenException('No autorizado')
    await this.addressModel.deleteOne({ _id: id })
    return { success: true }
  }
}

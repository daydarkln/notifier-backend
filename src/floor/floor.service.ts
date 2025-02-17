import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FloorService {
  constructor(private prisma: PrismaService) {}

  async getFloors() {
    return this.prisma.floor.findMany({
      include: {
        offices: true,
      },
    });
  }

  async createFloor(name: string) {
    return this.prisma.floor.create({ data: { name } });
  }

  async updateFloor(id: number, name: string) {
    return this.prisma.floor.update({
      where: { id: Number(id) },
      data: { name },
    });
  }

  async deleteFloor(id: number) {
    return this.prisma.floor.delete({
      where: { id: Number(id) },
    });
  }

  async createOffice(floorId: number, number: string) {
    return this.prisma.office.create({ data: { floorId, number } });
  }

  async updateOffice(id: number, number: string) {
    return this.prisma.office.update({
      where: { id: Number(id) },
      data: { number },
    });
  }

  async deleteOffice(id: number) {
    return this.prisma.office.delete({
      where: { id: Number(id) },
    });
  }
}

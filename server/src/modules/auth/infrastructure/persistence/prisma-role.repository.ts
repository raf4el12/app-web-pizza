import { PrismaClient } from '@prisma/client';
import { Role, RoleType } from '../../domain/entities/user.entity';
import { RoleRepository } from '../../domain/repositories/role.repository';

export class PrismaRoleRepository implements RoleRepository {
  constructor(private prisma: PrismaClient) {}

  async findByName(name: string): Promise<Role | null> {
    const roleData = await this.prisma.role.findUnique({
      where: { name: name as any }
    });

    return roleData ? this.mapToEntity(roleData) : null;
  }

  async findById(id: number): Promise<Role | null> {
    const roleData = await this.prisma.role.findUnique({
      where: { id }
    });

    return roleData ? this.mapToEntity(roleData) : null;
  }

  async findAll(): Promise<Role[]> {
    const rolesData = await this.prisma.role.findMany();
    return rolesData.map(role => this.mapToEntity(role));
  }

  private mapToEntity(roleData: any): Role {
    return new Role(
      roleData.id,
      roleData.name as RoleType,
      roleData.description,
      roleData.createdAt,
      roleData.updatedAt
    );
  }
}
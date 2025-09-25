import { PrismaClient } from '@prisma/client';
import { User, Role, RoleType, UserStatus } from '../../domain/entities/user.entity';
import { UserRepository, CreateUserData, UpdateUserData } from '../../domain/repositories/user.repository';

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });

    return userData ? this.mapToEntity(userData) : null;
  }

  async findById(id: number): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true }
    });

    return userData ? this.mapToEntity(userData) : null;
  }

  async create(userData: CreateUserData): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        roleId: userData.roleId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || null
      },
      include: { role: true }
    });

    return this.mapToEntity(createdUser);
  }

  async update(id: number, userData: Partial<UpdateUserData>): Promise<User> {
    const updateData: any = { ...userData };
    
    
    if (updateData.status) {
      updateData.status = updateData.status as any;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: { role: true }
    });

    return this.mapToEntity(updatedUser);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  private mapToEntity(userData: any): User {
    const role = userData.role ? new Role(
      userData.role.id,
      userData.role.name as RoleType,
      userData.role.description,
      userData.role.createdAt,
      userData.role.updatedAt
    ) : undefined;

    return new User(
      userData.id,
      userData.roleId,
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.password,
      userData.phone,
      userData.status as UserStatus,
      userData.createdAt,
      userData.updatedAt,
      userData.deletedAt,
      role
    );
  }
}
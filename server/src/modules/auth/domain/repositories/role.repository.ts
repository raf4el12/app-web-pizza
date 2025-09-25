import { Role } from '../entities/user.entity';

export interface RoleRepository {
  findByName(name: string): Promise<Role | null>;
  findById(id: number): Promise<Role | null>;
  findAll(): Promise<Role[]>;
}
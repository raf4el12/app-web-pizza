import { CreateUserData, UpdateUserData } from '../../application/dto/user.dto';
import { User } from '../entities/user.entity';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(userData: CreateUserData): Promise<User>;
  update(id: number, userData: Partial<UpdateUserData>): Promise<User>;
  delete(id: number): Promise<void>;
}

export { CreateUserData, UpdateUserData };


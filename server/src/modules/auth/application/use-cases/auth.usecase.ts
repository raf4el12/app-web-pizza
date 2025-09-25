import bcrypt from 'bcryptjs';
import { UserRepository } from '../../domain/repositories/user.repository';
import { RoleRepository } from '../../domain/repositories/role.repository';
import { AuthCredential } from '../../infrastructure/auth.credential';
import { 
  LoginDto, 
  RegisterDto, 
  RefreshTokenDto, 
  AuthResponseDto, 
  UserResponseDto,
  RoleResponseDto 
} from '../dto/auth.dto';
import { User, RoleType } from '../../domain/entities/user.entity';

export class AuthUseCase {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar que el usuario esté activo
    if (!user.isActive()) {
      throw new Error('Usuario inactivo o suspendido');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Generar tokens
    const accessToken = AuthCredential.generateAccessToken(user);
    const refreshToken = AuthCredential.generateRefreshToken(user);

    return {
      user: this.mapToUserResponse(user),
      accessToken,
      refreshToken
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { firstName, lastName, email, password, phone, roleId } = registerDto;

    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Si no se especifica roleId, asignar rol de CUSTOMER por defecto
    let finalRoleId = roleId;
    if (!finalRoleId) {
      const customerRole = await this.roleRepository.findByName(RoleType.CUSTOMER);
      if (!customerRole) {
        throw new Error('Rol de cliente no encontrado');
      }
      finalRoleId = customerRole.id;
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const user = await this.userRepository.create({
      roleId: finalRoleId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone: phone || null
    });

    // Generar tokens
    const accessToken = AuthCredential.generateAccessToken(user);
    const refreshToken = AuthCredential.generateRefreshToken(user);

    return {
      user: this.mapToUserResponse(user),
      accessToken,
      refreshToken
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verificar el refresh token
      const payload = AuthCredential.verifyRefreshToken(refreshToken);

      // Buscar usuario actual
      const user = await this.userRepository.findById(payload.userId);
      if (!user || !user.isActive()) {
        throw new Error('Usuario no encontrado o inactivo');
      }

      // Generar nuevos tokens
      const newAccessToken = AuthCredential.generateAccessToken(user);
      const newRefreshToken = AuthCredential.generateRefreshToken(user);

      return {
        user: this.mapToUserResponse(user),
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new Error('Token de actualización inválido');
    }
  }

  async getCurrentUser(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return this.mapToUserResponse(user);
  }

  private mapToUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || null,
      status: user.status,
      role: this.mapToRoleResponse(user.role!),
      createdAt: user.createdAt
    };
  }

  private mapToRoleResponse(role: any): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description
    };
  }
}
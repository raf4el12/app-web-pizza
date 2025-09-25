export enum RoleType {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export class Role {
  constructor(
    public readonly id: number,
    public readonly name: RoleType,
    public readonly description?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}
}

export class User {
  constructor(
    public readonly id: number,
    public readonly roleId: number,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly phone?: string,
    public readonly status: UserStatus = UserStatus.ACTIVE,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly deletedAt?: Date,
    public readonly role?: Role
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE && !this.deletedAt;
  }

  isAdmin(): boolean {
    return this.role?.name === RoleType.ADMIN;
  }

  isCustomer(): boolean {
    return this.role?.name === RoleType.CUSTOMER;
  }
}
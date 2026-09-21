import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({
  tableName: 'user_otps',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class UserOtp extends Model {
  @ForeignKey(() => User)
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  userId!: string;

  @PrimaryKey
  @Column
  sn!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({
    type: DataType.STRING(6),
    allowNull: false,
  })
  otp!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'login_2fa',
  })
  type!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  usedAt!: Date | null;
}

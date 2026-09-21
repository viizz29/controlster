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
  tableName: 'password_reset_tokens',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class PasswordResetToken extends Model {
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
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  token!: string;

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

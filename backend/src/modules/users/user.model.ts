import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({
  tableName: 'users', // Explicitly set the table name here
  timestamps: true, // Ensures it looks for createdAt/updatedAt
})
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({ defaultValue: true })
  isActive!: boolean;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'user',
  })
  role!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isEmailVerified!: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  emailVerificationToken!: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  emailVerificationTokenExpiresAt!: Date | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_2fa_enabled',
  })
  is2faEnabled!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_email_notifications_enabled',
  })
  isEmailNotificationsEnabled!: boolean;

  @Column({
    type: DataType.STRING(2),
    allowNull: false,
    defaultValue: 'en',
    field: 'language_preference',
  })
  languagePreference!: string;

  @Column({
    type: DataType.STRING(5),
    allowNull: false,
    defaultValue: 'light',
    field: 'theme_preference',
  })
  themePreference!: string;
}

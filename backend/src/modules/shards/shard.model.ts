import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'shards',
  underscored: true,
  timestamps: true,
})
export class Shard extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  host!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  port!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  userName!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  database!: string;
}

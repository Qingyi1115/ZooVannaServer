import {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "Sequelize";
import { conn } from "../db";
import { Enclosure } from "./Enclosure";
import { BarrierType } from "./Enumerated";

class EnclosureBarrier extends Model<
  InferAttributes<EnclosureBarrier>,
  InferCreationAttributes<EnclosureBarrier>
> {
  declare enclosureBarrierId: CreationOptional<number>;
  declare wallName: string;
  declare barrierType: BarrierType;
  declare remarks: string;

  declare enclosure?: Enclosure;

  declare getEnclosure: BelongsToGetAssociationMixin<Enclosure>;
  declare setEnclosure: BelongsToSetAssociationMixin<Enclosure, number>;

  public toJSON() {
    return {
      ...this.get(),
    };
  }
}

EnclosureBarrier.init(
  {
    enclosureBarrierId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    wallName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    barrierType: {
      type: DataTypes.ENUM,
      values: Object.values(BarrierType),
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "enclosureBarrier", // We need to choose the model name
  },
);

export { EnclosureBarrier };

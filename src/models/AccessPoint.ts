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
import { AccessPointType } from "./Enumerated";

class AccessPoint extends Model<
  InferAttributes<AccessPoint>,
  InferCreationAttributes<AccessPoint>
> {
  declare accessPointId: CreationOptional<number>;
  declare name: string;
  declare type: AccessPointType;

  declare enclosure?: Enclosure;

  declare getEnclosure: BelongsToGetAssociationMixin<Enclosure>;
  declare setEnclosure: BelongsToSetAssociationMixin<Enclosure, number>;

  public toJSON() {
    return {
      ...this.get(),
    };
  }
}

AccessPoint.init(
  {
    accessPointId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.values(AccessPointType),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "accessPoint", // We need to choose the model name
  },
);

export { AccessPoint };

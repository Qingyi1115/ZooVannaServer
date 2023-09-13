import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
} from "Sequelize";
import { conn } from "../db";
import { InHouse } from "./inHouse";

class FacilityLog extends Model<
  InferAttributes<FacilityLog>,
  InferCreationAttributes<FacilityLog>
> {
  declare logId: CreationOptional<number>;
  declare dateTime: Date;
  declare title: string;
  // declare type: Type;
  declare details: string;
  declare remarks: string;

  declare inHouse?: InHouse;

  declare getInHouse: BelongsToGetAssociationMixin<InHouse>;
  declare setInHouse: BelongsToSetAssociationMixin<InHouse, number>;
}

FacilityLog.init(
  {
    logId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    // type: {
    //     type:   DataTypes.ENUM,
    //     values: Object.values(Type),
    //     allowNull: false
    // },
    dateTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "facilityLog", // We need to choose the model name
  },
);

export { FacilityLog };

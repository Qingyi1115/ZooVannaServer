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
import { Facility } from "./facility";
import { MedicalSupplyType } from "./enumerated";

class MedicalSupply extends Model<
  InferAttributes<MedicalSupply>,
  InferCreationAttributes<MedicalSupply>
> {
  declare medicalSupplyId: CreationOptional<number>;
  declare medicalSupplyType: MedicalSupplyType;
  declare medicalSupplyName: string;

  declare facility?: Facility;

  declare getFacility: BelongsToGetAssociationMixin<Facility>;
  declare setFacility: BelongsToSetAssociationMixin<Facility, number>;

  public toJSON() {
    return {
      ...this.get(),
    }
  }
}

MedicalSupply.init(
  {
    medicalSupplyId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    medicalSupplyType: {
      type: DataTypes.ENUM,
      values: Object.values(MedicalSupplyType),
      allowNull: false,
    },
    medicalSupplyName: {
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
    modelName: "medicalSupply", // We need to choose the model name
  },
);

export { MedicalSupply };

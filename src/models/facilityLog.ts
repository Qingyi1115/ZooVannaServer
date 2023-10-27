import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
} from "Sequelize";
import { conn } from "../db";
import { InHouse } from "./inHouse";
import { FacilityLogType } from "./enumerated";
import { GeneralStaff } from "./generalStaff";

class FacilityLog extends Model<
  InferAttributes<FacilityLog>,
  InferCreationAttributes<FacilityLog>
> {
  declare facilityLogId: CreationOptional<number>;
  declare dateTime: Date;
  declare title: string;
  declare details: string;
  declare remarks: string;
  declare staffName: string;
  declare facilityLogType: FacilityLogType;

  declare inHouse?: InHouse;
  declare generalStaffs?: GeneralStaff[];

  declare getInHouse: BelongsToGetAssociationMixin<InHouse>;
  declare setInHouse: BelongsToSetAssociationMixin<InHouse, number>;

  declare getGeneralStaffs: BelongsToManyGetAssociationsMixin<GeneralStaff>;
  declare addGeneralStaff: BelongsToManyAddAssociationMixin<GeneralStaff, number>;
  declare setGeneralStaffs: BelongsToManySetAssociationsMixin<GeneralStaff, number>;
  declare removeGeneralStaff: BelongsToManyRemoveAssociationMixin<GeneralStaff, number>;

  public toJSON() {
    return {
      ...this.get(),
      dateTime:this.dateTime?.getTime(),
    }
  }

  public async toFullJSON(){
    return {
      ...this.toJSON(),
      inHouse: (await this.getInHouse())?.toJSON(),
      generalStaffs: (await this.getGeneralStaffs()).forEach(staff=>staff.toJSON()),
    };
  }
}

FacilityLog.init(
  {
    facilityLogId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
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
    staffName:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    facilityLogType:{
      type: DataTypes.ENUM,
      values: Object.values(FacilityLogType),
      allowNull: false,
    }
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

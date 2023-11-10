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
import { InHouse } from "./InHouse";
import { ThirdParty } from "./ThirdParty";
  
class CustomerReportLog extends Model<
  InferAttributes<CustomerReportLog>,
  InferCreationAttributes<CustomerReportLog>
> {
    declare customerReportLogId : CreationOptional<number>;
    declare dateTime : Date;
    declare title : string;
    declare remarks: string;
    declare viewed : boolean;
  
    declare inHouse?: InHouse;
    declare thirdParty?: ThirdParty;
  
    declare getInHouse: BelongsToGetAssociationMixin<InHouse>;
    declare setInHouse: BelongsToSetAssociationMixin<InHouse, number>;

    declare getThirdParty: BelongsToGetAssociationMixin<ThirdParty>;
    declare setThirdParty: BelongsToSetAssociationMixin<ThirdParty, number>;
    
  public toJSON() {
    return {
      ...this.get(),
      dateTime:this.dateTime?.getTime(),
    }
  }
}
  
  CustomerReportLog.init(
    {
      customerReportLogId: {
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
      remarks: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      viewed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      createdAt: true,
      updatedAt: "updateTimestamp",
      sequelize: conn, // We need to pass the connection instance
      modelName: "customerReportLog", // We need to choose the model name
    },
  );
  
  export { CustomerReportLog };
  
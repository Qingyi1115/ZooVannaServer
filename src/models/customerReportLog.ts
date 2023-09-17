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
import { ThirdParty } from "./thirdParty";
  
  class CustomerReportLog extends Model<
    InferAttributes<CustomerReportLog>,
    InferCreationAttributes<CustomerReportLog>
  > {
    declare CustomerReportLogId : CreationOptional<number>;
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
  }
  
  CustomerReportLog.init(
    {
        CustomerReportLogId: {
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
  
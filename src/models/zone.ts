import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyRemoveAssociationMixin,
  } from "Sequelize";
  import { conn } from "../db";
import { Facility } from "./facility";
  
class Zone extends Model<
    InferAttributes<Zone>,
    InferCreationAttributes<Zone>
> {
    declare zoneId: CreationOptional<number>;
    declare zoneName: string;
  
    declare facilities?: Facility[];
  
    declare getFacilitys: HasManyGetAssociationsMixin<Facility>;
    declare addFacility: HasManyAddAssociationMixin<Facility, number>;
    declare setFacilitys: HasManySetAssociationsMixin<Facility, number>;
    declare removeFacility: HasManyRemoveAssociationMixin<Facility, number>;
  
    
    public toJSON() {
      return {
        ...this.get()
      }
    }
  }
  
  Zone.init(
    {
        zoneId: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        zoneName: {
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
        modelName: "zone", // We need to choose the model name
    },
);
  
  export { Zone };
  
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
  
class Region extends Model<
    InferAttributes<Region>,
    InferCreationAttributes<Region>
> {
    declare regionId: CreationOptional<number>;
    declare regionName: string;
  
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
  
Region.init(
    {
        regionId: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        regionName: {
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
        modelName: "region", // We need to choose the model name
    },
);
  
  export { Region };
  
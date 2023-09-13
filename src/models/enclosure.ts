import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToManyGetAssociationsMixin,
  BelongsToSetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
} from "Sequelize";
import { conn } from "../db";
import { TerrainDistribution } from "./terrainDistribution";
import { Animal } from "./animal";
import { BarrierType } from "./barrierType";
import { Plantation } from "./plantation";

class Enclosure extends Model<
  InferAttributes<Enclosure>,
  InferCreationAttributes<Enclosure>
> {
  declare enclosureId: number;
  declare name: string;
  declare length: number;
  declare width: number;
  declare height: number;
  declare landArea: number;
  declare waterArea: number;
  declare plantationCoveragePercent: number;
  declare standoffBarrierDist: number;
  declare safetyFeatures: string;
  declare acceptableTempMin: number;
  declare acceptableTempMax: number;
  declare acceptableHumidityMin: number;
  declare acceptableHumidityMax: number;

  declare terrainDistribution?: TerrainDistribution;
  declare animals?: Animal;
  declare barrierType?: BarrierType;
  declare plantation?: Plantation;
  declare events?: Event[];

  declare getTerrainDistribution: BelongsToManyGetAssociationsMixin<TerrainDistribution>;
  declare setTerrainDistribution: BelongsToSetAssociationMixin<
    TerrainDistribution,
    number
  >;

  declare getAnimals: HasManyGetAssociationsMixin<Animal[]>;
  declare addAnimal: HasManyAddAssociationMixin<Animal, number>;
  declare setAnimals: HasManySetAssociationsMixin<Animal[], number>;

  declare getPlantation: HasOneGetAssociationMixin<Plantation>;
  declare setPlantation: HasOneSetAssociationMixin<Plantation, number>;

  declare getEvents: HasManyGetAssociationsMixin<Event[]>;
  declare addEvents: HasManyAddAssociationMixin<Event, number>;
  declare setEvents: HasManySetAssociationsMixin<Event[], number>;
}

Enclosure.init(
  {
    enclosureId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    length: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    width: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    height: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    landArea: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    waterArea: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    plantationCoveragePercent: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    standoffBarrierDist: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    safetyFeatures: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    acceptableTempMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    acceptableTempMax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    acceptableHumidityMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    acceptableHumidityMax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "enclosure", // We need to choose the model name
  },
);

export { Enclosure };

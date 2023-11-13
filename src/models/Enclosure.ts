import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManySetAssociationsMixin,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "Sequelize";
import { conn } from "../db";
import { Animal } from "./Animal";
import { BarrierType } from "./BarrierType";
import { EnclosureStatus } from "./Enumerated";
import { Facility } from "./Facility";
import { Keeper } from "./Keeper";
import { Plantation } from "./Plantation";
import { ZooEvent } from "./ZooEvent";

class Enclosure extends Model<
  InferAttributes<Enclosure>,
  InferCreationAttributes<Enclosure>
> {
  declare enclosureId: CreationOptional<number>;
  declare name: string;
  declare remark: string | null;
  declare length: number;
  declare width: number;
  declare height: number;
  declare enclosureStatus: EnclosureStatus;
  declare designDiagramJsonUrl: string;

  // Terrain Distribution
  declare longGrassPercent: number | null;
  declare shortGrassPercent: number | null;
  declare rockPercent: number | null;
  declare sandPercent: number | null;
  declare snowPercent: number | null;
  declare soilPercent: number | null;
  declare landArea?: number | null;
  declare waterArea?: number | null;
  declare plantationCoveragePercent?: number | null;
  declare acceptableTempMin?: number | null;
  declare acceptableTempMax?: number | null;
  declare acceptableHumidityMin?: number | null;
  declare acceptableHumidityMax?: number | null;

  // FK
  // declare terrainDistribution?: TerrainDistribution;
  declare animals?: Animal[];
  declare barrierType?: BarrierType;
  declare plantation?: Plantation; // to make into a list, plantations
  declare zooEvents?: ZooEvent[];
  declare facility?: Facility;
  declare Keeper?: Keeper[];

  // declare getTerrainDistribution: BelongsToManyGetAssociationsMixin<TerrainDistribution>;
  // declare setTerrainDistribution: BelongsToSetAssociationMixin<
  //   TerrainDistribution,
  //   number
  // >;

  declare getAnimals: HasManyGetAssociationsMixin<Animal>;
  declare addAnimal: HasManyAddAssociationMixin<Animal, number>;
  declare setAnimals: HasManySetAssociationsMixin<Animal, number>;
  declare removeAnimal: HasManyRemoveAssociationMixin<Animal, number>;

  declare getPlantation: HasOneGetAssociationMixin<Plantation>;
  declare setPlantation: HasOneSetAssociationMixin<Plantation, number>;

  declare getZooEvents: HasManyGetAssociationsMixin<ZooEvent>;
  declare addZooEvent: HasManyAddAssociationMixin<ZooEvent, number>;
  declare setZooEvents: HasManySetAssociationsMixin<ZooEvent, number>;
  declare removeZooEvent: HasManyRemoveAssociationMixin<ZooEvent, number>;

  declare getFacility: HasOneGetAssociationMixin<Facility>;
  declare setFacility: HasOneSetAssociationMixin<Facility, number>;

  declare getKeepers: BelongsToManyGetAssociationsMixin<Keeper>;
  declare addKeeper: BelongsToManyAddAssociationMixin<Keeper, number>;
  declare setKeepers: BelongsToManySetAssociationsMixin<Keeper, number>;
  declare removeKeeper: BelongsToManyRemoveAssociationMixin<Keeper, number>;

  public toJSON() {
    return {
      ...this.get(),
    };
  }
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
    remark: {
      type: DataTypes.STRING,
      allowNull: true,
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
    enclosureStatus: {
      type: DataTypes.ENUM,
      values: Object.values(EnclosureStatus),
      allowNull: false,
    },
    designDiagramJsonUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    longGrassPercent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    shortGrassPercent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rockPercent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sandPercent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    snowPercent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    soilPercent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    landArea: {
      type: DataTypes.VIRTUAL,
      get() {
        return null;
      },
    },
    waterArea: {
      type: DataTypes.VIRTUAL,
      get() {
        return null;
      },
    },
    plantationCoveragePercent: {
      type: DataTypes.VIRTUAL,
      get() {
        return null;
      },
    },
    // standoffBarrierDist: {
    //   type: DataTypes.DOUBLE,
    //   allowNull: false,
    // },
    // safetyFeatures: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    acceptableTempMin: {
      type: DataTypes.VIRTUAL,
      get() {
        return null;
      },
    },
    acceptableTempMax: {
      type: DataTypes.VIRTUAL,
      get() {
        return null;
      },
    },
    acceptableHumidityMin: {
      type: DataTypes.VIRTUAL,
      get() {
        return null;
      },
    },
    acceptableHumidityMax: {
      type: DataTypes.VIRTUAL,
      get() {
        return null;
      },
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

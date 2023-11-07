import {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "Sequelize";
import { conn } from "../db";
import { Animal } from "./Animal";
import { Specialization } from "./Enumerated";
import { Facility } from "./Facility";
import { MedicalSupply } from "./MedicalSupply";
import { ZooEvent } from "./ZooEvent";

class AnimalClinic extends Model<
  InferAttributes<AnimalClinic>,
  InferCreationAttributes<AnimalClinic>
> {
  declare specializationType: Specialization;

  declare facility?: Facility;
  declare medicalSupply?: MedicalSupply;
  declare animals?: Animal[];
  declare zooEvents?: ZooEvent[];

  declare getFacility: BelongsToGetAssociationMixin<Facility>;
  declare setFacility: BelongsToSetAssociationMixin<Facility, number>;

  declare getMedicalSupply: BelongsToGetAssociationMixin<MedicalSupply>;
  declare setMedicalSupply: BelongsToSetAssociationMixin<MedicalSupply, number>;

  declare getAnimals: HasManyGetAssociationsMixin<Animal>;
  declare addAnimal: HasManyAddAssociationMixin<Animal, number>;
  declare setAnimals: HasManySetAssociationsMixin<Animal, number>;
  declare removeAnimal: HasManyRemoveAssociationMixin<Animal, number>;

  declare getZooEvents: HasManyGetAssociationsMixin<ZooEvent>;
  declare addZooEvent: HasManyAddAssociationMixin<ZooEvent, number>;
  declare setZooEvents: HasManySetAssociationsMixin<ZooEvent, number>;
  declare removeZooEvent: HasManyRemoveAssociationMixin<ZooEvent, number>;

  public toJSON() {
    return {
      ...this.get()
    }
  }
}

AnimalClinic.init(
  {
    specializationType: {
      type: DataTypes.ENUM,
      values: Object.values(Specialization),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp",
    sequelize: conn, // We need to pass the connection instance
    modelName: "animalClinic", // We need to choose the model name
  },
);

export { AnimalClinic };


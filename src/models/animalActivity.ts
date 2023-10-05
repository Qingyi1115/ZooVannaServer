// import {
//   DataTypes,
//   Model,
//   InferAttributes,
//   InferCreationAttributes,
//   BelongsToSetAssociationMixin,
//   BelongsToGetAssociationMixin,
//   CreationOptional,
// } from "Sequelize";
// import { conn } from "../db";
// import { Animal } from "./animal";
// import { ActivityType } from "./enumerated";

// class AnimalActivity extends Model<
//   InferAttributes<AnimalActivity>,
//   InferCreationAttributes<AnimalActivity>
// > {
//   declare animalActivityId: CreationOptional<number>;
//   declare activityType: ActivityType;
//   declare title: string;
//   declare details: string;
//   declare date: Date;
//   declare session: Session;

//   declare animal?: Animal;

//   declare getAnimal: BelongsToGetAssociationMixin<Animal>;
//   declare setAnimal: BelongsToSetAssociationMixin<Animal, number>;
// }

// AnimalActivity.init(
//   {
//     animalWeightId: {
//       type: DataTypes.BIGINT,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     weightInKg: {
//       type: DataTypes.DOUBLE,
//       allowNull: false,
//     },
//     dateOfMeasure: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   },
//   {
//     freezeTableName: true,
//     timestamps: true,
//     createdAt: true,
//     updatedAt: "updateTimestamp",
//     sequelize: conn, // We need to pass the connection instance
//     modelName: "animalWeight", // We need to choose the model name
//   },
// );

// export { AnimalActivity };

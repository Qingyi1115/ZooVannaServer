import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
  } from "Sequelize";
import { conn } from "../db";

class Token extends Model<
  InferAttributes<Token>,
  InferCreationAttributes<Token>
> {
    declare token: string;
    declare email: string;
    declare createdAt: Date;
    declare expiresAt: Date;

}

Token.init(
    {
        token: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: true,
        createdAt: true,
        updatedAt: "updateTimestamp",
        sequelize: conn, // We need to pass the connection instance
        modelName: "token", // We need to choose the model name
      },
)

export {Token};
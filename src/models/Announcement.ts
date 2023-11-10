import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from "Sequelize";
  import { conn } from "../db";
  
class Announcement extends Model<
  InferAttributes<Announcement>,
  InferCreationAttributes<Announcement>
> {
  declare announcementId: CreationOptional<number>;
  declare title: string;
  declare content: string;
  declare isPublished: boolean; 
  declare scheduledStartPublish: Date;
  declare scheduledEndPublish: Date;

  public toJSON() {
    return {
      ...this.get(),
      scheduledStartPublish:this.scheduledStartPublish?.getTime(),
      scheduledEndPublish:this.scheduledEndPublish?.getTime(),
    }
  }
}
  
Announcement.init({
      announcementId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      scheduledStartPublish: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      scheduledEndPublish: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      createdAt: true,
      updatedAt: "updateTimestamp",
      sequelize: conn, // We need to pass the connection instance
      modelName: "announcement", // We need to choose the model name
    },
  );
  
  export { Announcement };
  
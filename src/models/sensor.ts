import {DataTypes, Model, InferAttributes, InferCreationAttributes,
    BelongsToGetAssociationMixin, BelongsToSetAssociationMixin} from "Sequelize";
import {conn} from '../db';
import {SensorType} from './enumerated';
import {Facility} from './facility';

class Sensor extends Model<InferAttributes<Sensor>, InferCreationAttributes<Sensor>> {
    declare sensorId: number;
    declare sensorReadings: number[] | string;
    declare dateOfActivation: Date;
    declare dateOfLastMaintained: Date;
    declare sensorType: SensorType;
    
    declare facility?: Facility;

    declare getFacility: BelongsToGetAssociationMixin<Facility>;
    declare setFacility: BelongsToSetAssociationMixin<Facility, number>;
}

Sensor.init({
    sensorId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    sensorReadings: {
        type: DataTypes.STRING(5000),
        set(val) {
            this.setDataValue("sensorReadings", JSON.stringify(val ?? ""));
        },
    },
    dateOfActivation: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    dateOfLastMaintained: {
        type: DataTypes.DATE,
    },
    sensorType: {
        type:   DataTypes.ENUM,
        values: Object.values(SensorType),
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
    sequelize: conn, // We need to pass the connection instance
    modelName: 'sensor' // We need to choose the model name
});

Sensor.addHook("afterFind", findResult => {
    if (!Array.isArray(findResult)) findResult = [findResult as any];
    for (const instance of findResult) {
        if (instance.sensorReadings instanceof String) {
        instance.setDataValue("sensorReadings", JSON.parse(instance.sensorReadings));
        }
    }
});

export {Sensor};
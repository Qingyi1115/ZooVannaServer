import {DataTypes, Model, InferAttributes, InferCreationAttributes,
    BelongsToGetAssociationMixin, BelongsToSetAssociationMixin} from "Sequelize";
import {conn} from '../db';
import {SensorType} from './enumerated';
import {Facility} from './facility';

class Sensor extends Model<InferAttributes<Sensor>, InferCreationAttributes<Sensor>> {
    declare sensorId: number;
    declare sensorReadings: [number];
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
        type: DataTypes.ARRAY(DataTypes.DECIMAL), 
        defaultValue: []
    },
    dateOfActivation: {
        type: DataTypes.DATE,
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
    modelName: 'generalStaff' // We need to choose the model name
});

export {Sensor};
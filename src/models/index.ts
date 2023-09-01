//  Import models
import {conn} from '../db';
import {Employee} from './employee'
import {Keeper} from './keeper'
import {KeeperType} from './enumerated';


export const seedDatabase = async () => {
    // Create relationships
    Keeper.belongsTo(Employee, {onDelete: "CASCADE", onUpdate: "CASCADE"});
    Employee.hasOne(Keeper, {onDelete: "CASCADE", onUpdate: "CASCADE"});

    Keeper.hasOne(Keeper, {as: "leader", onDelete: "CASCADE", onUpdate: "CASCADE"});
    Keeper.hasMany(Keeper, {as: "juniors", onDelete: "CASCADE", onUpdate: "CASCADE"});

    // Create tables
    await conn.sync({ force: true })

    let marry = await Employee.create({
      employeeName:"marry", 
      employeeAddress:"Singapore Kent Ridge LT19",
      employeePhoneNumber: "911",
      employeePasswordHash:"fake_hash", 
      employeeSalt:"NaCl",
      employeeDoorAccessCode:"123456",
      employeeEducation:"PHD in not eating",
    });
    console.log(marry.toJSON())
    console.log("marry's actuall secret hash: ", marry.employeePasswordHash)

    let marry2 = await Keeper.create({
      keeperType: KeeperType.SENIOR_KEEPER,
    });

    console.log(marry2.toJSON())

    marry2.employeeUd = 
}
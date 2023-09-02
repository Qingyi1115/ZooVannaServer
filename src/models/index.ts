//  Import models
import {conn} from '../db';
import {Employee} from './employee'
import {Keeper} from './keeper'
import {KeeperType} from './enumerated';


export const seedDatabase = async () => {
    // Create relationships
    const Keeper_Employee = Keeper.belongsTo(Employee, {onDelete: "CASCADE", onUpdate: "CASCADE"});
    const Employee_Keeper = Employee.hasOne(Keeper, {onDelete: "CASCADE", onUpdate: "CASCADE"});

    const Keeper_Juniors = Keeper.hasMany(Keeper, {foreignKey: "leaderId", as: "juniors", onDelete: "CASCADE", onUpdate: "CASCADE"});
    const Keeper_Leader = Keeper.belongsTo(Keeper, {foreignKey: "leaderId", as: "leader", onDelete: "CASCADE", onUpdate: "CASCADE"});
    
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

    let marryKeeper = await Keeper.create({
      keeperType: KeeperType.SENIOR_KEEPER,
    });

    console.log(marryKeeper.toJSON())

    await marryKeeper.setEmployee(marry);
    await marry.setKeeper(marryKeeper);

    
    console.log("\nmarry", marry.toJSON())
    console.log("\nmarry's keeper", (await marry.getKeeper()).toJSON())
    console.log("\nmarryKeeper", marryKeeper.toJSON())
    console.log("\nmarryKeeper's employee", (await marryKeeper.getEmployee()).toJSON())

    const minions = await Employee.bulkCreate([
      {
        employeeName:"john", 
        employeeAddress:"Singapore Kent Ridge LT17",
        employeePhoneNumber: "912",
        employeePasswordHash:"fake_hash_john", 
        employeeSalt:"NaAg",
        employeeDoorAccessCode:"234567",
        employeeEducation:"PHD in not sleeping",
        keeper:{
          keeperType: KeeperType.KEEPER
        }
      },
      {
        employeeName:"bob", 
        employeeAddress:"Singapore Kent Ridge LT16",
        employeePhoneNumber: "913",
        employeePasswordHash:"fake_hash_bob", 
        employeeSalt:"NaH",
        employeeDoorAccessCode:"345678",
        employeeEducation:"PHD in not breathing",
        keeper:{
          keeperType: KeeperType.KEEPER
        }
      },
    ], {
      include:{
        association : "keeper"
      }
    })

    
    console.log("-------------EMPLOYEES--------------------");
    (await Employee.findAll()).forEach(a => console.log(a.toJSON()));
    console.log("-------------KEEPERS--------------------");
    (await Keeper.findAll()).forEach(a => console.log(a.toJSON()));

    

    const johnKeeper = await minions[0].getKeeper()
    const bobKeeper = await minions[1].getKeeper()
    
    // johnKeeper.setLeader(marryKeeper))
    // bobKeeper.setLeader(marryKeeper))
    marryKeeper.setJuniors([johnKeeper, bobKeeper])

    const senior = (await Keeper.findOne({where:{keeperType:KeeperType.SENIOR_KEEPER}}))
    console.log("senior", senior?.get())

    const juniors =  (await senior?.getJuniors())?.map(a => a.get());
    console.log("Juniors ",juniors)


    console.log("-------------KEEPERS--------------------");
    (await Keeper.findAll({include:{ all: true, nested: true }})).forEach(a => console.log(JSON.stringify(a.toJSON(), null, 4)));
    // (await Keeper.findAll({include:[Employee, "juniors"]})).forEach(a => console.log(a.toJSON()));

    
    
}
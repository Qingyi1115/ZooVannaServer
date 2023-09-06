//  Import models
import {conn} from '../db';
import {Employee} from './employee';
import {Keeper} from './keeper';
import {PlanningStaff} from './planningStaff';
import {AccountManager} from './accountManager';
import {Facility} from './facility';
import {Sensor} from './sensor';
import {GeneralStaff} from './generalStaff';
import {KeeperType, PlannerType} from './enumerated';

function addCascadeOptions(options:object) {
  return {...options, onDelete: "CASCADE", onUpdate: "CASCADE"};
};


export const createDatabase = async (options:any) => {
  // Create relationships
  Employee.hasOne(Keeper, addCascadeOptions({foreignKey:"employeeId"}));
  Keeper.belongsTo(Employee, addCascadeOptions({foreignKey:"employeeId"}));

  Employee.hasOne(PlanningStaff, addCascadeOptions({foreignKey:"employeeId"}));
  PlanningStaff.belongsTo(Employee, addCascadeOptions({foreignKey:"employeeId"}));

  Keeper.hasMany(Keeper, addCascadeOptions({foreignKey: "leaderId", as: "juniors"}));
  Keeper.belongsTo(Keeper, addCascadeOptions({foreignKey: "leaderId", as: "leader"}));
  
  Employee.hasOne(GeneralStaff, addCascadeOptions({foreignKey:"employeeId"}));
  GeneralStaff.belongsTo(Employee, addCascadeOptions({foreignKey:"employeeId"}));

  Employee.hasOne(AccountManager, addCascadeOptions({foreignKey:"employeeId"}));
  AccountManager.belongsTo(Employee, addCascadeOptions({foreignKey:"employeeId"}));

  Facility.hasMany(Sensor, addCascadeOptions({foreignKey:"facilityId"}));
  Sensor.belongsTo(Facility, addCascadeOptions({foreignKey:"facilityId"}));

  // Create tables
  if (options["forced"]){
    await conn.sync({force: options.forced})
  }else{
    await conn.sync()
  }
  
}

export const seedDatabase = async () => {
  // Fake data goes here
  await tutorial()
}

export const tutorial = async () => {
    let marry = await Employee.create({
      employeeName:"marry", 
      employeeAddress:"Singapore Kent Ridge LT19",
      employeeEmail:"marry@gmail.com",
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
    console.log("\nmarry's keeper", (await marry.getRole()).toJSON())
    console.log("\nmarryKeeper", marryKeeper.toJSON())
    console.log("\nmarryKeeper's employee", (await marryKeeper.getEmployee()).toJSON())

    const minions = await Employee.bulkCreate([
      {
        employeeName:"john", 
        employeeAddress:"Singapore Kent Ridge LT17",
        employeeEmail:"john@gmail.com",
        employeePhoneNumber: "912",
        employeePasswordHash:"fake_hash_john", 
        employeeSalt:"NaAg",
        employeeDoorAccessCode:"234567",
        employeeEducation:"PHD in not sleeping",
         // @ts-ignore
        keeper:{
          keeperType: KeeperType.KEEPER
        }
      },
      {
        employeeName:"bob", 
        employeeAddress:"Singapore Kent Ridge LT16",
        employeeEmail:"bob@gmail.com",
        employeePhoneNumber: "913",
        employeePasswordHash:"fake_hash_bob", 
        employeeSalt:"NaH",
        employeeDoorAccessCode:"345678",
        employeeEducation:"PHD in not breathing",
         // @ts-ignore
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

    

    const johnKeeper = await minions[0].getRole();
    const bobKeeper = await minions[1].getRole();
    
    // johnKeeper.setLeader(marryKeeper))
    // bobKeeper.setLeader(marryKeeper))
    await marryKeeper.setJuniors([johnKeeper, bobKeeper]);

    const senior = (await Keeper.findOne({where:{keeperType:KeeperType.SENIOR_KEEPER}}));
    console.log("senior", senior?.get());

    const juniors =  (await senior?.getJuniors())?.map(a => a.get());
    console.log("Juniors ",juniors);


    console.log("-------------KEEPERS--------------------");
    (await Keeper.findAll({include:{ all: true, nested: true }})).forEach(a => console.log(JSON.stringify(a, null, 4)));
    // (await Keeper.findAll({include:[Employee, "juniors"]})).forEach(a => console.log(a.toJSON()));

    
    
    let planner1 = await Employee.create(
    {
      employeeName:"planner1", 
      employeeAddress:"Singapore Kent Ridge LT28",
      employeeEmail:"planner1@gmail.com",
      employeePhoneNumber: "999",
      employeePasswordHash:"fake_hash_planner1", 
      employeeSalt:"H2",
      employeeDoorAccessCode:"987654",
      employeeEducation:"PHD in not waking up",
      // @ts-ignore
      planningStaff: {
        plannerType : PlannerType.CURATOR
      }
    }, {
      include:{
        association : "planningStaff"
      }
    }
  );
  console.log(planner1.toJSON());
  console.log((await planner1.getRole()).toJSON());
}
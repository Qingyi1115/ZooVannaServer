//  Import models
import { conn } from '../db';
import { Employee } from './employee';
import { Keeper } from './keeper';
import { PlanningStaff } from './planningStaff';
import { Facility } from './facility';
import { Sensor } from './sensor';
import { GeneralStaff } from './generalStaff';
import { InHouse } from './inHouse';
import { KeeperType, PlannerType, GeneralStaffType, Specialization } from './enumerated';
import { ThirdParty } from './thirdParty';
import { AnimalClinic } from './animalClinics';
import { MedicalSupply } from './medicalSupply';

function addCascadeOptions(options:object) {
  return {...options, onDelete: "CASCADE", onUpdate: "CASCADE"};
};

export const createDatabase = async (options:any) => {
  // Create relationships
  Employee.hasOne(Keeper, addCascadeOptions({foreignKey:"employeeId"}));
  Keeper.belongsTo(Employee, addCascadeOptions({foreignKey:"employeeId"}));

  Employee.hasOne(PlanningStaff, addCascadeOptions({foreignKey:"employeeId"}));
  PlanningStaff.belongsTo(Employee, addCascadeOptions({foreignKey:"employeeId"}));

  Employee.hasOne(GeneralStaff, addCascadeOptions({foreignKey:"employeeId"}));
  GeneralStaff.belongsTo(Employee, addCascadeOptions({foreignKey:"employeeId"}));

  Facility.hasMany(Sensor, addCascadeOptions({foreignKey:"facilityId"}));
  Sensor.belongsTo(Facility, addCascadeOptions({foreignKey:"facilityId"}));

  Facility.hasOne(InHouse, addCascadeOptions({foreignKey:"facilityId"}));
  InHouse.belongsTo(Facility, addCascadeOptions({foreignKey:"facilityId"}));

  InHouse.hasMany(GeneralStaff,addCascadeOptions({foreignKey:"maintainedFacilityId", as:"maintenanceStaff"}));
  GeneralStaff.belongsTo(InHouse, addCascadeOptions({foreignKey:"maintainedFacilityId", as:"maintainedFacility"}));

  InHouse.hasMany(GeneralStaff,addCascadeOptions({foreignKey:"operatedFacilityId", as:"operationStaff"}));
  GeneralStaff.belongsTo(InHouse, addCascadeOptions({foreignKey:"operatedFacilityId", as:"operatedFacility"}));

  InHouse.hasOne(InHouse, addCascadeOptions({foreignKey:"previousTramStopId", as:"nextTramStop"}));
  InHouse.belongsTo(InHouse,addCascadeOptions({foreignKey:"previousTramStopId", as:"previousTramStop"}));

  Facility.hasOne(ThirdParty, addCascadeOptions({foreignKey:"FacilityId"}))
  ThirdParty.belongsTo(Facility, addCascadeOptions({foreignKey:"FacilityId"}))
  
  Facility.hasOne(AnimalClinic, addCascadeOptions({foreignKey:"FacilityId"}))
  AnimalClinic.belongsTo(Facility, addCascadeOptions({foreignKey:"FacilityId"}))
  
  MedicalSupply.hasMany(AnimalClinic, addCascadeOptions({foreignKey:"AnimalClinicId"}))
  AnimalClinic.belongsTo(MedicalSupply, addCascadeOptions({foreignKey:"AnimalClinicId"}))
  
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
      employeePasswordHash: Employee.getHash("marry_password", "NaCl"), 
      employeeSalt: "NaCl",
      employeeDoorAccessCode:"123456",
      employeeEducation:"PHD in not eating",
      hasAdminPrivileges: true
    });
    console.log(marry.toJSON())
    console.log("marry's actuall secret hash: ", marry.employeePasswordHash)

    let marryKeeper = await Keeper.create({
      keeperType: KeeperType.SENIOR_KEEPER,
      specialization: Specialization.AMPHIBIAN
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
        employeeEmail:"john@gmail.com",
        employeePhoneNumber: "912",
        employeePasswordHash: Employee.getHash("john_password", "NaAg"), 
        employeeSalt:"NaAg",
        employeeDoorAccessCode:"234567",
        employeeEducation:"PHD in not sleeping",
        hasAdminPrivileges: false,
         // @ts-ignore
        keeper:{
          keeperType: KeeperType.KEEPER,
          specialization: Specialization.AMPHIBIAN
        }
      },
      {
        employeeName:"bob", 
        employeeAddress:"Singapore Kent Ridge LT16",
        employeeEmail:"bob@gmail.com",
        employeePhoneNumber: "913",
        employeePasswordHash: Employee.getHash("bob_password", "NaH"), 
        employeeSalt:"NaH",
        employeeDoorAccessCode:"345678",
        employeeEducation:"PHD in not breathing",
        hasAdminPrivileges: false,
         // @ts-ignore
        keeper:{
          keeperType: KeeperType.KEEPER,
          specialization: Specialization.AMPHIBIAN
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

    

    const johnKeeper = await minions[0].getKeeper();
    const bobKeeper = await minions[1].getKeeper();
    

    const senior = (await Keeper.findOne({where:{keeperType:KeeperType.SENIOR_KEEPER}}));
    console.log("senior", senior?.get());

    console.log("-------------KEEPERS--------------------");
    (await Keeper.findAll({include:{ all: true, nested: true }})).forEach(a => console.log(JSON.stringify(a, null, 4)));
    // (await Keeper.findAll({include:[Employee, "juniors"]})).forEach(a => console.log(a.toJSON()));

    
    
    let planner1 = await Employee.create(
    {
      employeeName:"planner1", 
      employeeAddress:"Singapore Kent Ridge LT28",
      employeeEmail:"planner1@gmail.com",
      employeePhoneNumber: "999",
      employeePasswordHash: Employee.getHash("planner1_password", "H2"), 
      employeeSalt:"H2",
      employeeDoorAccessCode:"987654",
      employeeEducation:"PHD in not waking up",
      hasAdminPrivileges: false,
      // @ts-ignore
      planningStaff: {
        plannerType : PlannerType.CURATOR,
        specialization: Specialization.AMPHIBIAN
      }
    }, {
      include:{
        association : "planningStaff"
      }
    }
  );
  console.log(planner1.toJSON());
  console.log((await planner1.getPlanningStaff()).toJSON());

  
  let manager = await Employee.create(
  {
    employeeName:"manager1", 
    employeeAddress:"Singapore Kent Ridge LT14",
    employeeEmail:"manager1@gmail.com",
    employeePhoneNumber: "000",
    employeePasswordHash: Employee.getHash("manager1_password", "H3"), 
    employeeSalt:"H3",
    employeeDoorAccessCode:"222222",
    employeeEducation:"Math Major",
    hasAdminPrivileges: true,
    // @ts-ignore
    generalStaff: {
      generalStaffType : GeneralStaffType.MAINTENANCE
    }
  }, {
    include:{
      association : "generalStaff"
    }
  }
);
console.log((await manager.getGeneralStaff()).toJSON());
manager.employeeName = "manager_new_name";
await manager.save();
console.log(manager.toJSON());
}
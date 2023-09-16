//  Import models
import { conn } from "../db";
import { Employee } from "./employee";
import { Keeper } from "./keeper";
import { PlanningStaff } from "./planningStaff";
import { Facility } from "./facility";
import { Sensor } from "./sensor";
import { GeneralStaff } from "./generalStaff";
import { InHouse } from "./inHouse";
import {
  KeeperType,
  PlannerType,
  GeneralStaffType,
  Specialization,
  SensorType,
  FacilityType,
} from "./enumerated";
import { ThirdParty } from "./thirdParty";
import { AnimalClinic } from "./animalClinics";
import { MedicalSupply } from "./medicalSupply";
import { FacilityLog } from "./faciltiyLog";
import { SpeciesDietNeed } from "./speciesDietNeed";
import { Species } from "./species";
import { SpeciesEnclosureNeed } from "./speciesEnclosureNeed";
import { Animal } from "./animal";
import { TerrainDistribution } from "./terrainDistribution";
import { Enclosure } from "./enclosure";
import { BarrierType } from "./barrierType";
import { Plantation } from "./plantation";
import { AnimalLog } from "./animalLog";
import { Event } from "./event";
import { Listing } from "./listing";
import { LineItem } from "./lineItem";
import { Promotion } from "./promotion";
import { Order } from "./order";
import { Customer } from "./customer";
import { HubProcessor } from "./hubProcessor";
import { CustomerReportLog } from "./customerReportLog";
import { SensorReading } from "./sensorReading";

function addCascadeOptions(options: object) {
  return { ...options, onDelete: "CASCADE", onUpdate: "CASCADE" };
}

export const createDatabase = async (options: any) => {
  // Create relationships
  Employee.hasOne(Keeper, addCascadeOptions({ foreignKey: "employeeId" }));
  Keeper.belongsTo(Employee, addCascadeOptions({ foreignKey: "employeeId" }));

  Employee.hasOne(
    PlanningStaff,
    addCascadeOptions({ foreignKey: "employeeId" }),
  );
  PlanningStaff.belongsTo(
    Employee,
    addCascadeOptions({ foreignKey: "employeeId" }),
  );

  Employee.hasOne(
    GeneralStaff,
    addCascadeOptions({ foreignKey: "employeeId" }),
  );
  GeneralStaff.belongsTo(
    Employee,
    addCascadeOptions({ foreignKey: "employeeId" }),
  );

  Facility.hasMany(HubProcessor, addCascadeOptions({ foreignKey: "facilityId" }));
  HubProcessor.belongsTo(Facility, addCascadeOptions({ foreignKey: "facilityId" }));

  HubProcessor.hasMany(Sensor, addCascadeOptions({ foreignKey: "hubProcessorId" }));
  Sensor.belongsTo(HubProcessor, addCascadeOptions({ foreignKey: "hubProcessorId" }));

  Sensor.hasMany(SensorReading, addCascadeOptions({ foreignKey: "sensorId" }));
  SensorReading.belongsTo(Sensor, addCascadeOptions({ foreignKey: "sensorId" }));

  Facility.hasOne(InHouse, addCascadeOptions({ foreignKey: "facilityId" }));
  InHouse.belongsTo(Facility, addCascadeOptions({ foreignKey: "facilityId" }));

  InHouse.belongsToMany(GeneralStaff, {
    foreignKey: "maintainedFacilityId",
    through: "generalStaff_inHouse",
    as: "maintenanceStaffs",
  });
  GeneralStaff.belongsToMany(InHouse, {
    foreignKey: "maintainedFacilityId",
    through: "generalStaff_inHouse",
    as: "maintainedFacilities",
  });

  InHouse.hasMany(
    GeneralStaff,
    addCascadeOptions({
      foreignKey: "operatedFacilityId",
      as: "operationStaffs",
    }),
  );
  GeneralStaff.belongsTo(
    InHouse,
    addCascadeOptions({
      foreignKey: "operatedFacilityId",
      as: "operatedFacility",
    }),
  );

  InHouse.hasOne(
    InHouse,
    addCascadeOptions({ foreignKey: "previousTramStopId", as: "nextTramStop" }),
  );
  InHouse.belongsTo(
    InHouse,
    addCascadeOptions({
      foreignKey: "previousTramStopId",
      as: "previousTramStop",
    }),
  );

  InHouse.hasMany(FacilityLog, addCascadeOptions({ foreignKey: "inHouseId" }));
  FacilityLog.belongsTo(
    InHouse,
    addCascadeOptions({ foreignKey: "inHouseId" }),
  );

  Facility.hasOne(ThirdParty, addCascadeOptions({ foreignKey: "FacilityId" }));
  ThirdParty.belongsTo(
    Facility,
    addCascadeOptions({ foreignKey: "FacilityId" }),
  );

  Facility.hasOne(
    AnimalClinic,
    addCascadeOptions({ foreignKey: "FacilityId" }),
  );
  AnimalClinic.belongsTo(
    Facility,
    addCascadeOptions({ foreignKey: "FacilityId" }),
  );

  MedicalSupply.hasMany(
    AnimalClinic,
    addCascadeOptions({ foreignKey: "AnimalClinicId" }),
  );
  AnimalClinic.belongsTo(
    MedicalSupply,
    addCascadeOptions({ foreignKey: "AnimalClinicId" }),
  );

  SpeciesDietNeed.hasMany(
    Species,
    addCascadeOptions({ foreignKey: "speciesDietNeedId" }),
  );
  Species.belongsTo(
    SpeciesDietNeed,
    addCascadeOptions({ foreignKey: "speciesDietNeedId" }),
  );

  SpeciesEnclosureNeed.hasMany(
    Species,
    addCascadeOptions({ foreignKey: "speciesEnclosureNeedId" }),
  );
  Species.belongsTo(
    SpeciesEnclosureNeed,
    addCascadeOptions({ foreignKey: "speciesEnclosureNeedId" }),
  );

  Species.hasMany(Animal, addCascadeOptions({ foreignKey: "speciesId" }));
  Animal.belongsTo(Species, addCascadeOptions({ foreignKey: "speciesId" }));

  Animal.belongsToMany(Animal, {
    foreignKey: "parentId",
    through: "parent_child",
    as: "parents",
  });
  Animal.belongsToMany(Animal, {
    foreignKey: "childId",
    through: "parent_child",
    as: "children",
  });

  Animal.hasMany(AnimalLog, addCascadeOptions({ foreignKey: "animalId" }));
  AnimalLog.belongsTo(Animal, addCascadeOptions({ foreignKey: "animalId" }));

  AnimalClinic.hasMany(
    Animal,
    addCascadeOptions({ foreignKey: "animalClinicId" }),
  );
  Animal.belongsTo(
    AnimalClinic,
    addCascadeOptions({ foreignKey: "animalClinicId" }),
  );

  TerrainDistribution.hasMany(
    SpeciesEnclosureNeed,
    addCascadeOptions({
      foreignKey: "terrainDistributionId",
      as: "speciesEnclosureNeedMins",
    }),
  );
  SpeciesEnclosureNeed.belongsTo(
    TerrainDistribution,
    addCascadeOptions({
      foreignKey: "terrainDistributionId",
      as: "terrainDistributionMins",
    }),
  );

  TerrainDistribution.hasMany(
    SpeciesEnclosureNeed,
    addCascadeOptions({
      foreignKey: "terrainDistributionId",
      as: "speciesEnclosureNeedMaxs",
    }),
  );
  SpeciesEnclosureNeed.belongsTo(
    TerrainDistribution,
    addCascadeOptions({
      foreignKey: "terrainDistributionId",
      as: "terrainDistributionMaxs",
    }),
  );

  TerrainDistribution.hasMany(
    Enclosure,
    addCascadeOptions({ foreignKey: "terrainDistributionId" }),
  );
  Enclosure.belongsTo(
    TerrainDistribution,
    addCascadeOptions({ foreignKey: "terrainDistributionId" }),
  );

  Enclosure.hasMany(Animal, addCascadeOptions({ foreignKey: "enclosureId" }));
  Animal.belongsTo(Enclosure, addCascadeOptions({ foreignKey: "enclosureId" }));

  Enclosure.hasOne(
    BarrierType,
    addCascadeOptions({ foreignKey: "enclosureId" }),
  );
  BarrierType.belongsTo(
    Enclosure,
    addCascadeOptions({ foreignKey: "enclosureId" }),
  );

  Enclosure.hasOne(
    BarrierType,
    addCascadeOptions({ foreignKey: "enclosureId" }),
  );
  BarrierType.belongsTo(
    Enclosure,
    addCascadeOptions({ foreignKey: "enclosureId" }),
  );

  Enclosure.hasOne(
    Plantation,
    addCascadeOptions({ foreignKey: "enclosureId" }),
  );
  Plantation.belongsTo(
    Enclosure,
    addCascadeOptions({ foreignKey: "enclosureId" }),
  );

  PlanningStaff.hasMany(
    Event,
    addCascadeOptions({ foreignKey: "planningStaffId" }),
  );
  Event.belongsTo(
    PlanningStaff,
    addCascadeOptions({ foreignKey: "planningStaffId" }),
  );

  Keeper.belongsToMany(Event, {
    foreignKey: "keeperId",
    through: "responsibleFor",
    as: "keepers",
  });
  Event.belongsToMany(Keeper, {
    foreignKey: "eventId",
    through: "responsibleFor",
    as: "events",
  });

  Enclosure.hasMany(Event, addCascadeOptions({ foreignKey: "enclosureId" }));
  Event.belongsTo(Enclosure, addCascadeOptions({ foreignKey: "enclosureId" }));

  Animal.hasMany(Event, addCascadeOptions({ foreignKey: "animalId" }));
  Event.belongsTo(Animal, addCascadeOptions({ foreignKey: "animalId" }));

  InHouse.hasMany(Event, addCascadeOptions({ foreignKey: "inHouseId" }));
  Event.belongsTo(InHouse, addCascadeOptions({ foreignKey: "inHouseId" }));

  AnimalClinic.hasMany(
    Event,
    addCascadeOptions({ foreignKey: "animalClinicId" }),
  );
  Event.belongsTo(
    AnimalClinic,
    addCascadeOptions({ foreignKey: "animalClinicId" }),
  );
  
  Listing.hasMany(LineItem, addCascadeOptions({ foreignKey: "listingId" }));
  LineItem.belongsTo(Listing, addCascadeOptions({ foreignKey: "listingId" }));

  Promotion.hasMany(Order, addCascadeOptions({ foreignKey: "promotionId" }));
  Order.belongsTo(Promotion, addCascadeOptions({ foreignKey: "promotionId" }));

  Customer.hasMany(Order, addCascadeOptions({ foreignKey: "customerId" }));
  Order.belongsTo(Customer, addCascadeOptions({ foreignKey: "customerId" }));

  LineItem.hasMany(Order, addCascadeOptions({ foreignKey: "orderId" }));
  Order.belongsTo(LineItem, addCascadeOptions({ foreignKey: "orderId" }));

  ThirdParty.hasMany(CustomerReportLog, addCascadeOptions({ foreignKey: "thirdPartyId" }));
  CustomerReportLog.belongsTo(ThirdParty, addCascadeOptions({ foreignKey: "thirdPartyId" }));

  InHouse.hasMany(CustomerReportLog, addCascadeOptions({ foreignKey: "inHouseId" }));
  CustomerReportLog.belongsTo(InHouse, addCascadeOptions({ foreignKey: "inHouseId" }));

  // Create tables
  if (options["forced"]) {
    await conn.sync({ force: options.forced });
  } else {
    await conn.sync();
  }
};

export const seedDatabase = async () => {
  // Fake data goes here
  await tutorial();
};

export const tutorial = async () => {
  let marry = await Employee.create({
    employeeName: "marry",
    employeeAddress: "Singapore Kent Ridge LT19",
    employeeEmail: "marry@gmail.com",
    employeePhoneNumber: "911",
    employeePasswordHash: Employee.getHash("marry_password", "NaCl"),
    employeeSalt: "NaCl",
    employeeDoorAccessCode: "123456",
    employeeEducation: "PHD in not eating",
    hasAdminPrivileges: true,
  });
  console.log(marry.toJSON());
  console.log("marry's actuall secret hash: ", marry.employeePasswordHash);

  let marryKeeper = await Keeper.create({
    keeperType: KeeperType.SENIOR_KEEPER,
    specialization: Specialization.AMPHIBIAN,
  });

  console.log(marryKeeper.toJSON());

  await marryKeeper.setEmployee(marry);
  await marry.setKeeper(marryKeeper);

  console.log("\nmarry", marry.toJSON());
  console.log("\nmarry's keeper", (await marry.getKeeper()).toJSON());
  console.log("\nmarryKeeper", marryKeeper.toJSON());
  console.log(
    "\nmarryKeeper's employee",
    (await marryKeeper.getEmployee()).toJSON(),
  );

  const minions = await Employee.bulkCreate(
    [
      {
        employeeName: "john",
        employeeAddress: "Singapore Kent Ridge LT17",
        employeeEmail: "john@gmail.com",
        employeePhoneNumber: "912",
        employeePasswordHash: Employee.getHash("john_password", "NaAg"),
        employeeSalt: "NaAg",
        employeeDoorAccessCode: "234567",
        employeeEducation: "PHD in not sleeping",
        hasAdminPrivileges: false,
        // @ts-ignore
        keeper: {
          keeperType: KeeperType.KEEPER,
          specialization: Specialization.AMPHIBIAN,
        },
      },
      {
        employeeName: "bob",
        employeeAddress: "Singapore Kent Ridge LT16",
        employeeEmail: "bob@gmail.com",
        employeePhoneNumber: "913",
        employeePasswordHash: Employee.getHash("bob_password", "NaH"),
        employeeSalt: "NaH",
        employeeDoorAccessCode: "345678",
        employeeEducation: "PHD in not breathing",
        hasAdminPrivileges: false,
        // @ts-ignore
        keeper: {
          keeperType: KeeperType.KEEPER,
          specialization: Specialization.AMPHIBIAN,
        },
      },
    ],
    {
      include: {
        association: "keeper",
      },
    },
  );

  console.log("-------------EMPLOYEES--------------------");
  (await Employee.findAll()).forEach((a) => console.log(a.toJSON()));
  console.log("-------------KEEPERS--------------------");
  (await Keeper.findAll()).forEach((a) => console.log(a.toJSON()));

  const johnKeeper = await minions[0].getKeeper();
  const bobKeeper = await minions[1].getKeeper();

  const senior = await Keeper.findOne({
    where: { keeperType: KeeperType.SENIOR_KEEPER },
  });
  console.log("senior", senior?.get());

  // console.log("-------------KEEPERS--------------------");
  // (await Keeper.findAll({include:{ all: true, nested: true }})).forEach(a => console.log(JSON.stringify(a, null, 4)));
  // (await Keeper.findAll({include:[Employee, "juniors"]})).forEach(a => console.log(a.toJSON()));

  let planner1 = await Employee.create(
    {
      employeeName: "planner1",
      employeeAddress: "Singapore Kent Ridge LT28",
      employeeEmail: "planner1@gmail.com",
      employeePhoneNumber: "999",
      employeePasswordHash: Employee.getHash("planner1_password", "H2"),
      employeeSalt: "H2",
      employeeDoorAccessCode: "987654",
      employeeEducation: "PHD in not waking up",
      hasAdminPrivileges: false,
      // @ts-ignore
      planningStaff: {
        plannerType: PlannerType.CURATOR,
        specialization: Specialization.AMPHIBIAN,
      },
    },
    {
      include: {
        association: "planningStaff",
      },
    },
  );
  console.log(planner1.toJSON());
  console.log((await planner1.getPlanningStaff()).toJSON());

  let manager = await Employee.create(
    {
      employeeName: "manager1",
      employeeAddress: "Singapore Kent Ridge LT14",
      employeeEmail: "manager1@gmail.com",
      employeePhoneNumber: "000",
      employeePasswordHash: Employee.getHash("manager1_password", "H3"),
      employeeSalt: "H3",
      employeeDoorAccessCode: "222222",
      employeeEducation: "Math Major",
      hasAdminPrivileges: true,
      // @ts-ignore
      generalStaff: {
        generalStaffType: GeneralStaffType.ZOO_MAINTENANCE,
      },
    },
    {
      include: {
        association: "generalStaff",
      },
    },
  );

  let manager2 = await Employee.create(
    {
      employeeName: "manager2",
      employeeAddress: "Singapore Kent Ridge LT12",
      employeeEmail: "manager2@gmail.com",
      employeePhoneNumber: "001",
      employeePasswordHash: Employee.getHash("manager2_password", "SiO2"),
      employeeSalt: "SiO2",
      employeeDoorAccessCode: "222223",
      employeeEducation: "Another Math Major",
      hasAdminPrivileges: true,
      // @ts-ignore
      planningStaff: {
        plannerType: PlannerType.OPERATIONS_MANAGER,
        specialization: Specialization.REPTILE,
      },
    },
    {
      include: {
        association: "planningStaff",
      },
    },
  );
  console.log((await manager.getGeneralStaff()).toJSON());
  manager.employeeName = "manager_new_name";
  await manager.save();
  console.log(manager.toJSON());

  let facility1 = await Facility.create(
    {
      facilityName: "facility1",
      xCoordinate: 123456,
      yCoordinate: 654321,
      hubProcessors: [
        {
          sensorName: "A01",
          sensorReadings: [1.2, 2.3, 3.4],
          dateOfActivation: new Date(),
          dateOfLastMaintained: new Date(),
          sensorType: SensorType.HUMIDITY,
        } as any,
      ],
      inHouse: {
        lastMaintained: new Date(),
        isPaid: false,
        maxAccommodationSize: 5,
        hasAirCon: false,
        facilityType: FacilityType.PARKING,
      } as any,
    },
    {
      include: [
        {
          association: "sensors",
        },
        {
          association: "inHouse",
        },
      ],
    },
  );
  // console.log(await facility1.getSensors())

  let maintenanceStaff = await manager.getGeneralStaff();
  await maintenanceStaff.setMaintainedFacilities([
    await facility1.getInHouse(),
  ]);
  (await Facility.findAll()).forEach((a) =>
    console.log(JSON.stringify(a, null, 4)),
  );
  console.log(
    await (
      await (await Facility.findOne())?.getFacilityDetail()
    )?.getMaintenanceStaffs(),
  );
};

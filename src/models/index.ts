//  Import models
import { conn } from "../db";
import * as SpeciesService from "../services/species";
import * as AnimalService from "../services/animal";
import { Animal } from "./animal";
import { AnimalClinic } from "./animalClinics";
import { AnimalFeed } from "./animalFeed";
import { AnimalLog } from "./animalLog";
import { AnimalWeight } from "./animalWeight";
import { BarrierType } from "./barrierType";
import { Compatibility } from "./compatibility";
import { Customer } from "./customer";
import { CustomerOrder } from "./customerOrder";
import { CustomerReportLog } from "./customerReportLog";
import { Employee } from "./employee";
import { Enclosure } from "./enclosure";
import { EnrichmentItem } from "./enrichmentItem";
import {
  AcquisitionMethod,
  AnimalFeedCategory,
  AnimalGrowthStage,
  Country,
  ConservationStatus,
  Continent,
  FacilityType,
  GeneralStaffType,
  GroupSexualDynamic,
  HubStatus,
  IdentifierType,
  KeeperType,
  PlannerType,
  PresentationContainer,
  PresentationLocation,
  PresentationMethod,
  SensorType,
  EventType,
  ListingType,
  ListingStatus,
  Specialization,
  AnimalSex,
  ActivityType,
  EventTimingType,
} from "./enumerated";
import { ZooEvent } from "./zooEvent";
import { Facility } from "./facility";
import { FacilityLog } from "./facilityLog";
import { GeneralStaff } from "./generalStaff";
import { HubProcessor } from "./hubProcessor";
import { InHouse } from "./inHouse";
import { Keeper } from "./keeper";
import { Listing } from "./listing";
import { MaintenanceLog } from "./maintenanceLog";
import { MedicalSupply } from "./medicalSupply";
import { OrderItem } from "./orderItem";
import { Payment } from "./payment";
import { PhysiologicalReferenceNorms } from "./physiologicalReferenceNorms";
import { PlanningStaff } from "./planningStaff";
import { Plantation } from "./plantation";
import { Promotion } from "./promotion";
import { Sensor } from "./sensor";
import { SensorReading } from "./sensorReading";
import { Species } from "./species";
import { SpeciesDietNeed } from "./speciesDietNeed";
import { SpeciesEnclosureNeed } from "./speciesEnclosureNeed";
import { TerrainDistribution } from "./terrainDistribution";
import { ThirdParty } from "./thirdParty";
import { AnimalActivity } from "./animalActivity";
import { AnimalObservationLog } from "./animalObservationLog";
import { Zone } from "./zone";
import { AnimalActivitySession } from "./animalActivitySession";

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

  AnimalActivity.hasMany(AnimalActivitySession,
    addCascadeOptions({ foreignKey: "animalActivityId" }),
  );
  AnimalActivitySession.belongsTo(AnimalActivity,
    addCascadeOptions({ foreignKey: "animalActivityId" }),
  );

  AnimalActivitySession.hasOne(
    ZooEvent,
    addCascadeOptions({ foreignKey: "animalActivitySessionId" }),
  );
  ZooEvent.belongsTo(
    AnimalActivitySession,
    addCascadeOptions({ foreignKey: "animalActivitySessionId" }),
  );

  Facility.hasMany(
    HubProcessor,
    addCascadeOptions({ foreignKey: "facilityId" }),
  );
  HubProcessor.belongsTo(
    Facility,
    addCascadeOptions({ foreignKey: "facilityId" }),
  );

  Zone.hasMany(
    Facility,
    addCascadeOptions({ foreignKey: "zoneId" }),
  );
  Facility.belongsTo(
    Zone,
    addCascadeOptions({ foreignKey: "zoneId" }),
  );

  HubProcessor.hasMany(
    Sensor,
    addCascadeOptions({ foreignKey: "hubProcessorId" }),
  );
  Sensor.belongsTo(
    HubProcessor,
    addCascadeOptions({ foreignKey: "hubProcessorId" }),
  );

  Sensor.hasMany(MaintenanceLog, addCascadeOptions({ foreignKey: "sensorId" }));
  MaintenanceLog.belongsTo(
    Sensor,
    addCascadeOptions({ foreignKey: "sensorId" }),
  );

  Sensor.hasMany(
    SensorReading,
    addCascadeOptions({ foreignKey: "sensorId", as: "sensorReadings" }),
  );
  SensorReading.belongsTo(
    Sensor,
    addCascadeOptions({ foreignKey: "sensorId", as: "sensor" }),
  );

  Facility.hasOne(InHouse, addCascadeOptions({ foreignKey: "facilityId" }));
  InHouse.belongsTo(Facility, addCascadeOptions({ foreignKey: "facilityId" }));

  Facility.hasOne(Enclosure, addCascadeOptions({ foreignKey: "facilityId" }));
  Enclosure.belongsTo(
    Facility,
    addCascadeOptions({ foreignKey: "facilityId" }),
  );

  InHouse.belongsToMany(GeneralStaff, {
    foreignKey: "maintainedFacilityId",
    through: "generalStaff_inHouse",
    as: "maintenanceStaffs",
  });
  GeneralStaff.belongsToMany(InHouse, {
    foreignKey: "maintenanceStaffId",
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

  // ------------ Species Relation --------------
  Species.hasOne(SpeciesEnclosureNeed, {
    // foreignKey: "speciesEnclosureNeedId",
    onDelete: "CASCADE",
  });
  SpeciesEnclosureNeed.belongsTo(Species, {
    // foreignKey: "speciesId",
  });

  Species.hasMany(PhysiologicalReferenceNorms, { onDelete: "CASCADE" });
  PhysiologicalReferenceNorms.belongsTo(Species);

  Species.hasMany(SpeciesDietNeed, { onDelete: "CASCADE" });
  SpeciesDietNeed.belongsTo(Species);

  Species.hasMany(Compatibility, { onDelete: "CASCADE" });
  Compatibility.belongsTo(Species, {
    as: "species1",
    foreignKey: "speciesId1",
    targetKey: "speciesId",
    onDelete: "CASCADE",
  });

  Compatibility.belongsTo(Species, {
    as: "species2",
    foreignKey: "speciesId2",
    targetKey: "speciesId",
    onDelete: "CASCADE",
  });

  // ------------ Animal Relation --------------

  Species.hasMany(Animal, { onDelete: "CASCADE" });
  Animal.belongsTo(Species);

  Animal.belongsToMany(Animal, {
    foreignKey: "parentId",
    through: "parent_child",
    as: "parents",
    onDelete: "CASCADE",
  });

  Animal.belongsToMany(Animal, {
    foreignKey: "childId",
    through: "parent_child",
    as: "children",
    onDelete: "CASCADE",
  });

  Animal.hasMany(AnimalWeight, { onDelete: "CASCADE" });
  AnimalWeight.belongsTo(Animal);

  Animal.belongsToMany(AnimalActivity, {
    foreignKey: "animalId",
    through: "animal_animalActivity",
    as: "animalActivities",
  });
  AnimalActivity.belongsToMany(Animal, {
    foreignKey: "animalActivityId",
    through: "animal_animalActivity",
    as: "animals",
  });

  AnimalActivity.belongsToMany(EnrichmentItem, {
    foreignKey: "animalActivityId",
    through: "animalActivity_enrichmentItem",
    as: "enrichmentItems",
  });
  EnrichmentItem.belongsToMany(AnimalActivity, {
    foreignKey: "enrichmentItemId",
    through: "animalActivity_enrichmentItem",
    as: "animalActivities",
  });

  Species.belongsToMany(Customer, {
    foreignKey: "speciesId",
    through: "customerFravouriteSpecies",
    as: "customers",
  });
  Customer.belongsToMany(Species, {
    foreignKey: "customerId",
    through: "customerFravouriteSpecies",
    as: "species",
  });

  Animal.hasMany(AnimalLog, addCascadeOptions({ foreignKey: "animalId" }));
  AnimalLog.belongsTo(Animal, addCascadeOptions({ foreignKey: "animalId" }));

  Animal.belongsToMany(AnimalObservationLog, {
    foreignKey: "animalId",
    through: "animal_observationLog",
    as: "animalObservationLogs",
  });
  AnimalObservationLog.belongsToMany(Animal, {
    foreignKey: "animalObservationLogId",
    through: "animal_observationLog",
    as: "animals",
  });

  // ------------ End of Animal Relation --------------

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
    ZooEvent,
    addCascadeOptions({ foreignKey: "planningStaffId" }),
  );
  ZooEvent.belongsTo(
    PlanningStaff,
    addCascadeOptions({ foreignKey: "planningStaffId" }),
  );

  Keeper.belongsToMany(ZooEvent, {
    foreignKey: "keeperId",
    through: "keeper_zooEvent",
    as: "zooEvents",
  });
  ZooEvent.belongsToMany(Keeper, {
    foreignKey: "zooEventId",
    through: "keeper_zooEvent",
    as: "keepers",
  });

  Keeper.hasMany(AnimalObservationLog, { foreignKey: "keeperId" });
  AnimalObservationLog.belongsTo(Keeper, { foreignKey: "keeperId", });

  Enclosure.hasMany(ZooEvent, addCascadeOptions({ foreignKey: "enclosureId" }));
  ZooEvent.belongsTo(
    Enclosure,
    addCascadeOptions({ foreignKey: "enclosureId" }),
  );

  Animal.hasMany(ZooEvent, addCascadeOptions({ foreignKey: "animalId" }));
  ZooEvent.belongsTo(Animal, addCascadeOptions({ foreignKey: "animalId" }));

  InHouse.hasMany(ZooEvent, addCascadeOptions({ foreignKey: "inHouseId" }));
  ZooEvent.belongsTo(InHouse, addCascadeOptions({ foreignKey: "inHouseId" }));

  AnimalClinic.hasMany(
    ZooEvent,
    addCascadeOptions({ foreignKey: "animalClinicId" }),
  );
  ZooEvent.belongsTo(
    AnimalClinic,
    addCascadeOptions({ foreignKey: "animalClinicId" }),
  );

  Listing.hasMany(OrderItem, addCascadeOptions({ foreignKey: "listingId" }));
  OrderItem.belongsTo(Listing, addCascadeOptions({ foreignKey: "listingId" }));

  Promotion.hasMany(
    CustomerOrder,
    addCascadeOptions({ foreignKey: "promotionId" }),
  );
  CustomerOrder.belongsTo(
    Promotion,
    addCascadeOptions({ foreignKey: "promotionId" }),
  );

  Customer.hasMany(
    CustomerOrder,
    addCascadeOptions({ foreignKey: "customerId" }),
  );
  CustomerOrder.belongsTo(
    Customer,
    addCascadeOptions({ foreignKey: "customerId" }),
  );

  CustomerOrder.hasMany(
    OrderItem,
    addCascadeOptions({ foreignKey: "customerOrderId" }),
  );
  OrderItem.belongsTo(
    CustomerOrder,
    addCascadeOptions({ foreignKey: "customerOrderId" }),
  );

  CustomerOrder.hasMany(
    Payment,
    addCascadeOptions({ foreignKey: "customerOrderId" }),
  );
  Payment.belongsTo(
    CustomerOrder,
    addCascadeOptions({ foreignKey: "customerOrderId" }),
  );

  ThirdParty.hasMany(
    CustomerReportLog,
    addCascadeOptions({ foreignKey: "thirdPartyId" }),
  );
  CustomerReportLog.belongsTo(
    ThirdParty,
    addCascadeOptions({ foreignKey: "thirdPartyId" }),
  );

  InHouse.hasMany(
    CustomerReportLog,
    addCascadeOptions({ foreignKey: "inHouseId" }),
  );
  CustomerReportLog.belongsTo(
    InHouse,
    addCascadeOptions({ foreignKey: "inHouseId" }),
  );

  GeneralStaff.hasMany(
    Sensor,
    addCascadeOptions({ foreignKey: "generalStaffId" }),
  );
  Sensor.belongsTo(
    GeneralStaff,
    addCascadeOptions({ foreignKey: "generalStaffId" }),
  );

  // Create tables
  if (options["forced"]) {
    await conn.sync({ force: options.forced });
  } else {
    await conn.sync();
  }
};

export const seedDatabase = async () => {
  // Fake data goes here
  await employeeSeed();
  await animalFeedSeed();
  await enrichmentItemSeed();
  await facilityAssetsSeed();
  await speciesSeed();
  await animalSeed();
  await promotionSeed();
  await customerSeed();
};

export const promotionSeed = async () => {
  let promotion1 = await Promotion.create({
    title: "Happy Birthday Merlion Zoo",
    description:
      "Enjoy 30% off admission tickets and come join us in our 30th birthday celebration! \n\n Terms and conditions: \nValid for minimum purchase of S$100 \n Valid for purchase date from 1 October 2023 to 31 October 2023",
    publishDate: new Date("2023-09-15"),
    startDate: new Date("2023-10-01"),
    endDate: new Date("2023-10-31"),
    percentage: 30,
    minimumSpending: 100,
    promotionCode: "HAPPY30BIRTHDAY",
    maxRedeemNum: 1,
    currentRedeemNum: 0,
    imageUrl: "img/promotion/giraffe.jpg",
  });
  let promotion2 = await Promotion.create({
    title: "Hipp-Hippo Hurray",
    description:
      "Enjoy 10% off admission tickets to commemorate International Hippo Day! \n\n Terms and conditions: \nValid for minimum purchase of S$200 \n Valid for purchase date from 6 October 2023 to 11 October 2023",
    publishDate: new Date("2023-10-01"),
    startDate: new Date("2023-10-06"),
    endDate: new Date("2023-10-11"),
    percentage: 10,
    minimumSpending: 200,
    promotionCode: "HIPPODAY",
    maxRedeemNum: 100,
    currentRedeemNum: 0,
    imageUrl: "img/promotion/hippo_water.jpg",
  });
  let promotion3 = await Promotion.create({
    title: "Bye La La",
    description:
      "Seize your final chance to make memories with our beloved La La! Enjoy 20% off admission tickets. \n\n Terms and conditions: \nValid for minimum purchase of S$150 \n Valid for purchase date from 8 October 2023 to 22 October 2023",
    publishDate: new Date("2023-10-01"),
    startDate: new Date("2023-10-07"),
    endDate: new Date("2023-10-21"),
    percentage: 20,
    minimumSpending: 120,
    promotionCode: "BYELALA",
    maxRedeemNum: 1000,
    currentRedeemNum: 0,
    imageUrl: "img/promotion/lala.jpg",
  });
  let promotion4 = await Promotion.create({
    title: "Welcome back!",
    description:
      "Tired of WFH? Enjoy 20% off admission tickets to celebrate the end of circuit breaker. \n\n Terms and conditions: \nValid for minimum purchase of S$100 \n Valid for purchase date from 20 July 2021 to 20 August 2023",
    publishDate: new Date("2023-07-07"),
    startDate: new Date("2023-07-20"),
    endDate: new Date("2023-08-20"),
    percentage: 20,
    minimumSpending: 200,
    promotionCode: "BYECOVID",
    maxRedeemNum: 1000,
    currentRedeemNum: 1000,
    imageUrl: "img/promotion/elephant.jpg",
  });
};

export const customerSeed = async () => {
  let customer1 = await Customer.create({
    firstName: "Vinessa",
    lastName: "Christabella",
    email: "vinessac235@gmail.com",
    contactNo: "12345568",
    birthday: new Date("2001-01-01"),
    nationality: Country.Indonesia,
    passwordHash: Customer.getHash("Hahaha123.", "hehe"),
    salt: "hehe",
  });

  let customer2 = await Customer.create({
    firstName: "Natasha",
    lastName: "Rafaela",
    email: "natasha.rafaela1711sg@gmail.com",
    contactNo: "12345568",
    birthday: new Date("2001-01-01"),
    nationality: Country.Indonesia,
    passwordHash: Customer.getHash("Hahaha123.", "hehe"),
    salt: "hehe",
  });

  let customer3 = await Customer.create({
    firstName: "Qingyi",
    lastName: "Xiang",
    email: "xqy1115@gmail.com",
    contactNo: "12345568",
    birthday: new Date("2001-01-01"),
    nationality: Country.Indonesia,
    passwordHash: Customer.getHash("Hahaha123.", "hehe"),
    salt: "hehe",
  });
};

export const employeeSeed = async () => {
  let marry = await Employee.create(
    {
      employeeName: "marry",
      employeeAddress: "Singapore Kent Ridge LT19",
      employeeEmail: "marry@gmail.com",
      employeePhoneNumber: "911",
      employeePasswordHash: Employee.getHash("marry_password", "NaCl"),
      employeeSalt: "NaCl",
      employeeDoorAccessCode: "123456",
      employeeEducation: "PHD in not eating",
      employeeBirthDate: new Date("1992-03-04"),
      isAccountManager: true,
      superAdmin: true,
      //@ts-ignore
      planningStaff: {
        plannerType: PlannerType.OPERATIONS_MANAGER,
        specialization: Specialization.FISH,
        isDisabled: false,
      },
    },
    {
      include: {
        association: "planningStaff",
      },
    },
  );
  console.log(marry.toJSON());
  console.log("marry's actuall secret hash: ", marry.employeePasswordHash);

  let marryKeeper = await Keeper.create({
    keeperType: KeeperType.SENIOR_KEEPER,
    specialization: Specialization.AMPHIBIAN,
    isDisabled: false,
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
        employeeBirthDate: new Date("2001-09-02"),
        isAccountManager: false,
        // @ts-ignore
        keeper: {
          keeperType: KeeperType.KEEPER,
          specialization: Specialization.AMPHIBIAN,
          isDisabled: false,
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
        employeeBirthDate: new Date("2001-09-02"),
        isAccountManager: false,
        // @ts-ignore
        keeper: {
          keeperType: KeeperType.KEEPER,
          specialization: Specialization.AMPHIBIAN,
          isDisabled: false,
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
  // (await Keeper.findAll({include:{ all: true }})).forEach(a => console.log(JSON.stringify(a, null, 4)));
  // (await Keeper.findAll({include:["employee"]})).forEach(a => console.log(a.toJSON()));

  let planner1 = await Employee.create(
    {
      employeeName: "planna",
      employeeAddress: "Singapore Kent Ridge LT28",
      employeeEmail: "planna@gmail.com",
      employeePhoneNumber: "999",
      employeePasswordHash: Employee.getHash("planner1_password", "H2"),
      employeeSalt: "H2",
      employeeDoorAccessCode: "987654",
      employeeEducation: "PHD in not waking up",
      employeeBirthDate: new Date("2001-09-02"),
      isAccountManager: false,
      // @ts-ignore
      planningStaff: {
        plannerType: PlannerType.CURATOR,
        specialization: Specialization.AMPHIBIAN,
        isDisabled: false,
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

  await Employee.create(
    {
      employeeName: "lalaboi",
      employeeAddress: "Singapore Kent Ridge LT17",
      employeeEmail: "jsonBoi@gmail.com",
      employeePhoneNumber: "24218818",
      employeePasswordHash: Employee.getHash("joason_password", "NaAg33"),
      employeeSalt: "NaAg33",
      employeeDoorAccessCode: "2345632127",
      employeeEducation: "PHD in not sleeping",
      employeeBirthDate: new Date("2001-09-02"),
      isAccountManager: false,
      // @ts-ignore
      generalStaff: {
        generalStaffType: GeneralStaffType.ZOO_OPERATIONS,
        isDisabled: false,
      },
    },
    {
      include: {
        association: "generalStaff",
      },
    },
  );
  await Employee.create(
    {
      employeeName: "operation guy1",
      employeeAddress: "Singapore Kent Ridge LT173",
      employeeEmail: "ops@gmail.com",
      employeePhoneNumber: "22318818",
      employeePasswordHash: Employee.getHash("ops_password", "NaAg33"),
      employeeSalt: "NaAg33",
      employeeDoorAccessCode: "23456321237",
      employeeEducation: "PHD in not sleeping",
      employeeBirthDate: new Date("2002-09-02"),
      isAccountManager: false,
      // @ts-ignore
      generalStaff: {
        generalStaffType: GeneralStaffType.ZOO_OPERATIONS,
        isDisabled: false,
      },
    },
    {
      include: {
        association: "generalStaff",
      },
    },
  );

  await Employee.create(
    {
      employeeName: "operation guy2",
      employeeAddress: "Singapore Kent Ridge LT1731",
      employeeEmail: "ops_guy2password@gmail.com",
      employeePhoneNumber: "22218818",
      employeePasswordHash: Employee.getHash("ops2_password", "NaAg33"),
      employeeSalt: "NaAg33",
      employeeDoorAccessCode: "23456321227",
      employeeEducation: "PHD in not sleeping",
      employeeBirthDate: new Date("2002-09-02"),
      isAccountManager: false,
      // @ts-ignore
      generalStaff: {
        generalStaffType: GeneralStaffType.ZOO_OPERATIONS,
        isDisabled: false,
      },
    },
    {
      include: {
        association: "generalStaff",
      },
    },
  );

  let manager = await Employee.create(
    {
      employeeName: "manager1",
      employeeAddress: "Singapore Kent Ridge LT14",
      employeeEmail: "manager1@gmail.com",
      employeePhoneNumber: "000",
      employeePasswordHash: Employee.getHash("manager1_password", "H3"),
      employeeSalt: "H3",
      employeeDoorAccessCode: "222222",
      employeeBirthDate: new Date("2001-09-02"),
      employeeEducation: "Math Major",
      isAccountManager: true,
      // @ts-ignore
      generalStaff: {
        generalStaffType: GeneralStaffType.ZOO_MAINTENANCE,
        isDisabled: false,
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
      employeeBirthDate: new Date("2001-09-02"),
      isAccountManager: true,
      // @ts-ignore
      planningStaff: {
        plannerType: PlannerType.OPERATIONS_MANAGER,
        specialization: Specialization.REPTILE,
        isDisabled: false,
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

  let manager3 = await Employee.create(
    {
      employeeName: "maint1",
      employeeAddress: "Singapore Kent Ridge LT14",
      employeeEmail: "maint1@gmail.com",
      employeePhoneNumber: "0020",
      employeePasswordHash: Employee.getHash("main_password", "H35"),
      employeeSalt: "H35",
      employeeDoorAccessCode: "2222222",
      employeeBirthDate: new Date("2001-09-02"),
      employeeEducation: "Math Major",
      isAccountManager: false,
      // @ts-ignore
      generalStaff: {
        generalStaffType: GeneralStaffType.ZOO_MAINTENANCE,
        isDisabled: false,
      },
    },
    {
      include: {
        association: "generalStaff",
      },
    },
  );
  let listing1 = await Listing.create({
    name: "Adult",
    description: "Listing for local adult",
    price: 20,
    listingType: ListingType.LOCAL_ADULT_ONETIME,
    listingStatus: ListingStatus.ACTIVE,
  });

  let listing2 = await Listing.create({
    name: "Student",
    description: "Listing for local student (including university student)",
    price: 15,
    listingType: ListingType.LOCAL_STUDENT_ONETIME,
    listingStatus: ListingStatus.ACTIVE,
  });

  let listing3 = await Listing.create({
    name: "Child",
    description: "Listing for local child (aged <= 12 years old)",
    price: 15,
    listingType: ListingType.LOCAL_CHILD_ONETIME,
    listingStatus: ListingStatus.ACTIVE,
  });

  let listing4 = await Listing.create({
    name: "Senior",
    description: "Listing for local senior (aged >= 65 years old)",
    price: 10,
    listingType: ListingType.LOCAL_SENIOR_ONETIME,
    listingStatus: ListingStatus.ACTIVE,
  });

  let listing5 = await Listing.create({
    name: "Adult",
    description: "Listing for foreigner adult",
    price: 30,
    listingType: ListingType.FOREIGNER_ADULT_ONETIME,
    listingStatus: ListingStatus.ACTIVE,
  });

  let listing6 = await Listing.create({
    name: "Child",
    description: "Listing for foreigner child",
    price: 30,
    listingType: ListingType.FOREIGNER_CHILD_ONETIME,
    listingStatus: ListingStatus.ACTIVE,
  });
};

export const speciesSeed = async () => {
  let pandaTemplate = {
    speciesCode: await Species.getNextSpeciesCode(),
    commonName: "Giant Panda",
    scientificName: "Ailuropoda Melanoleuca",
    aliasName: "Panda Bear, Panda",
    conservationStatus: ConservationStatus.VULNERABLE,
    domain: "Eukarya",
    kingdom: "Animalia",
    phylum: "Chordata",
    speciesClass: "Mammalia",
    order: "Carnivora",
    family: "Ursidae",
    genus: "Ailuropoda",
    educationalDescription:
      "The Giant Panda, often simply referred to as the Panda, is a large, charismatic bear known for its distinct black and white coloration. It is native to China and is one of the most iconic and endangered species in the world. Pandas primarily feed on bamboo, which makes up the majority of their diet. They are known for their solitary and sedentary nature. Conservation efforts have been made to protect and preserve these pandas due to their vulnerable status.",
    educationalFunFact:
      'Pandas have a "thumb" for better bamboo grip, helping them eat and climb!',
    nativeContinent: Continent.ASIA,
    nativeBiomes: "Grassland,Temperate",
    groupSexualDynamic: GroupSexualDynamic.POLYANDROUS,
    habitatOrExhibit: "Southwest China",
    generalDietPreference: "Folivore",
    imageUrl: "img/species/panda.jpg",
    lifeExpectancyYears: 30,
    ageToJuvenile: 2,
    ageToAdolescent: 5,
    ageToAdult: 7,
    ageToElder: 20,
    // foodRemark: "Food remark...",
  } as any;
  let panda = await Species.create(pandaTemplate);
  console.log(panda.toJSON());

  let pandaEnclosure = await SpeciesService.createEnclosureNeeds(
    "SPE001",
    10,
    10,
    120,
    20,
    20,
    30,
    50,
    15,
    10,
    60,
    10,
    40,
    10,
    50,
    5,
    10,
    0,
    0,
    0,
    0,
    0,
    0,
  );
  console.log(pandaEnclosure.toJSON());

  let pandaPhy1 = await SpeciesService.createPhysiologicalReferenceNorms(
    "SPE001",
    15,
    20,
    15,
    20,
    0.1,
    0.2,
    0.1,
    0.2,
    0,
    1,
    AnimalGrowthStage.INFANT,
  );
  console.log(pandaPhy1.toJSON());

  let pandaPhy2 = await SpeciesService.createPhysiologicalReferenceNorms(
    "SPE001",
    50,
    75,
    50,
    75,
    20,
    45,
    20,
    45,
    2,
    3,
    AnimalGrowthStage.JUVENILE,
  );
  let pandaPhy3 = await SpeciesService.createPhysiologicalReferenceNorms(
    "SPE001",
    120,
    150,
    110,
    140,
    50,
    90,
    45,
    80,
    4,
    6,
    AnimalGrowthStage.ADOLESCENT,
  );
  let pandaPhy4 = await SpeciesService.createPhysiologicalReferenceNorms(
    "SPE001",
    160,
    190,
    110,
    180,
    85,
    125,
    70,
    100,
    7,
    20,
    AnimalGrowthStage.ADULT,
  );

  // let pandaPhy5 = await SpeciesService.createPhysiologicalReferenceNorms(
  //   "SPE001",
  //   160,
  //   190,
  //   110,
  //   180,
  //   80,
  //   115,
  //   70,
  //   100,
  //   21,
  //   50,
  //   AnimalGrowthStage.ELDER,
  // );

  let pandaPhy5 = await SpeciesService.createPhysiologicalReferenceNorms(
    "SPE001",
    160,
    190,
    110,
    180,
    80,
    115,
    70,
    100,
    21,
    28,
    AnimalGrowthStage.ELDER,
  );

  let pandaPhy6 = await SpeciesService.createPhysiologicalReferenceNorms(
    "SPE001",
    165,
    195,
    115,
    185,
    80,
    115,
    75,
    105,
    29,
    35,
    AnimalGrowthStage.ELDER,
  );

  let pandaDietNeed1 = await SpeciesService.createDietNeed(
    "SPE001",
    AnimalFeedCategory.FISH,
    100,
    1000,
    PresentationContainer.SILICONE_DISH,
    PresentationMethod.CHOPPED,
    PresentationLocation.IN_CONTAINER,
    AnimalGrowthStage.ADULT,
  );
  console.log(pandaDietNeed1.toJSON());

  let pandaDietNeed2 = await SpeciesService.createDietNeed(
    "SPE001",
    AnimalFeedCategory.HAY,
    1000,
    7000,
    PresentationContainer.HANGING_FEEDERS,
    PresentationMethod.WHOLE,
    PresentationLocation.IN_CONTAINER,
    AnimalGrowthStage.JUVENILE,
  );
  console.log(pandaDietNeed2.toJSON());
  let capybaraTemplate = {
    speciesCode: await Species.getNextSpeciesCode(),
    commonName: "Capybara",
    scientificName: "Hydrochoerus Hydrochaeris",
    aliasName: "Water pig, Hydrochaeris hydrochaeris",
    conservationStatus: ConservationStatus.LEAST_CONCERN,
    domain: "Eukarya",
    kingdom: "Animalia",
    phylum: "Chordata",
    speciesClass: "Mammalia",
    order: "Rodentia",
    family: "Caviidae",
    genus: "Hydrochoerus",
    educationalDescription:
      "The Capybara is the largest living rodent in the world, known for its semi-aquatic lifestyle and friendly demeanor. These herbivorous animals are highly social and often live in groups, making them excellent swimmers and grazers. They are native to South America and are well-adapted to various aquatic habitats.",
    educationalFunFact:
      "Capybaras are excellent swimmers and can stay submerged underwater for up to five minutes. They use this skill to evade predators and forage for aquatic plants.",
    nativeContinent: Continent.SOUTH_OR_CENTRAL_AMERICA,
    nativeBiomes: "Grasslands, Savannas, Wetlands, Rainforests",
    groupSexualDynamic: GroupSexualDynamic.POLYANDROUS,
    habitatOrExhibit: "Water bodies",
    generalDietPreference: "Herbivore",
    imageUrl: "img/species/capybara.jpg",
    lifeExpectancyYears: 10,
    ageToJuvenile: 0.5,
    ageToAdolescent: 1,
    ageToAdult: 2,
    ageToElder: 5,
    // foodRemark: "Food remark...",
  } as any;
  let capybara = await Species.create(capybaraTemplate);
  console.log(capybara.toJSON());

  let redPandaTemplate = {
    speciesCode: await Species.getNextSpeciesCode(),
    commonName: "Red Panda",
    scientificName: "Ailurus fulgens",
    aliasName: "Lesser Panda, Fire Fox",
    conservationStatus: ConservationStatus.ENDANGERED,
    domain: "Eukarya",
    kingdom: "Animalia",
    phylum: "Chordata",
    speciesClass: "Mammalia",
    order: "Carnivora",
    family: "Ailuridae",
    genus: "Ailurus",
    educationalDescription:
      "The Red Panda is a small, arboreal mammal known for its striking red fur and bushy tail. Despite its name, it is not closely related to the giant panda and belongs to its own family, Ailuridae. Red pandas are native to the eastern Himalayas and southwestern China. They are primarily herbivorous, feeding on bamboo, fruits, and insects. These solitary animals are known for their shy and elusive nature.",
    educationalFunFact: "Fun Fact 001",
    nativeContinent: Continent.ASIA,
    nativeBiomes: "Temperate Forests, Bamboo Forests",
    groupSexualDynamic: GroupSexualDynamic.POLYANDROUS,
    habitatOrExhibit: "Forested areas",
    generalDietPreference: "Herbivore",
    imageUrl: "img/species/redPanda.jpg",
    lifeExpectancyYears: 10,
    ageToJuvenile: 1,
    ageToAdolescent: 2,
    ageToAdult: 3,
    ageToElder: 8,
    // foodRemark: "Food remark...",
  } as any;
  let redPanda = await Species.create(redPandaTemplate);
  console.log(redPanda.toJSON());

  let africanElephantTemplate = {
    speciesCode: await Species.getNextSpeciesCode(),
    commonName: "African Elephant",
    scientificName: "Loxodonta africana",
    aliasName: "African bush elephant",
    conservationStatus: ConservationStatus.ENDANGERED,
    domain: "Eukarya",
    kingdom: "Animalia",
    phylum: "Chordata",
    speciesClass: "Mammalia",
    order: "Proboscidea",
    family: "	Elephantidae",
    genus: "Loxodonta",
    educationalDescription:
      "The African bush elephant (Loxodonta africana), also known as the African savanna elephant, is one of two extant African elephant species and one of three extant elephant species. It is the largest living terrestrial animal, with bulls reaching a shoulder height of up to 3.96 m (13 ft 0 in) and a body mass of up to 10.4 t (11.5 short tons).",
    educationalFunFact:
      "Africa bush elephants use their trunks for tactile communication.",
    nativeContinent: Continent.ASIA,
    nativeBiomes: "Temperate Forests, Bamboo Forests",
    groupSexualDynamic: GroupSexualDynamic.POLYANDROUS,
    habitatOrExhibit: "Forested areas",
    generalDietPreference: "Herbivore",
    imageUrl: "img/species/elephant.jpg",
    lifeExpectancyYears: 65,
    ageToJuvenile: 2,
    ageToAdolescent: 5,
    ageToAdult: 20,
    ageToElder: 60,
    // foodRemark: "Food remark...",
  } as any;
  let elephant = await Species.create(africanElephantTemplate);
  console.log(elephant.toJSON());

  let clownFishTemplate = {
    speciesCode: await Species.getNextSpeciesCode(),
    commonName: "Clown Fish",
    scientificName: "Amphiprioninae",
    aliasName: "Anemonefish",
    conservationStatus: ConservationStatus.LEAST_CONCERN,
    domain: "Eukarya",
    kingdom: "Animalia",
    phylum: "Chordata",
    speciesClass: "Actinopterygii",
    order: "Perciformes",
    family: "Pomacentridae",
    genus: "Amphiprion",
    educationalDescription:
      "The Clown Fish, also known as Anemonefish, is a type of small fish belonging to the subfamily Amphiprioninae within the family Pomacentridae. They are well-known for their colorful appearance and their symbiotic relationship with sea anemones.",
    educationalFunFact:
      "Clown Fish have a mutually beneficial relationship with sea anemones, where they provide protection to the anemone in exchange for shelter and food scraps.",
    nativeContinent: Continent.ASIA,
    nativeBiomes: "Coral Reefs, Tropical Seas",
    groupSexualDynamic: GroupSexualDynamic.MONOGAMOUS,
    habitatOrExhibit: "Coral reefs, Warm tropical waters",
    generalDietPreference: "Omnivore",
    imageUrl: "img/species/clownfish.jpg",
    lifeExpectancyYears: 6,
    ageToJuvenile: 1,
    ageToAdolescent: 3,
    ageToAdult: 1,
    ageToElder: 6,
    // foodRemark: "Food remark...",
  } as any;
  let clownFish = await Species.create(clownFishTemplate);
  console.log(clownFish.toJSON());

  let compatibility1 = await SpeciesService.createCompatibility(
    "SPE001",
    "SPE002",
  );
  console.log(compatibility1.toJSON());

  let compatibility2 = await SpeciesService.createCompatibility(
    "SPE001",
    "SPE003",
  );
  console.log(compatibility2.toJSON());

  let compatibility3 = await SpeciesService.createCompatibility(
    "SPE002",
    "SPE003",
  );
  console.log(compatibility3.toJSON());
};

export const animalSeed = async () => {
  let panda1Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "Pang Pang",
    AnimalSex.FEMALE,
    new Date("2000-03-04"),
    "Singapore",
    IdentifierType.MAGNETIC_TAG,
    "identifierValue 001",
    AcquisitionMethod.FROM_THE_WILD,
    new Date("2021-03-04"),
    "N.A.",
    "Big face, black spot at the back",
    "active, friendly",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/ANM00001.jpg",
  );

  let panda2Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "Yuan Yuan",
    AnimalSex.FEMALE,
    new Date("2003-03-04"),
    "Singapore",
    IdentifierType.MAGNETIC_TAG,
    "identifierValue 001",
    AcquisitionMethod.FROM_THE_WILD,
    new Date("2021-03-04"),
    "N.A.",
    "Big face, black spot at the back",
    "active, friendly",
    null,
    null,
    null,
    "SICK",
    "img/animal/ANM00002.jpg",
  );

  let panda3Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "Du Du",
    AnimalSex.FEMALE,
    new Date("2010-03-04"),
    "Singapore",
    IdentifierType.RFID_TAG,
    "identifierValue 001",
    AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
    new Date("2021-03-04"),
    "N.A.",
    "Big face, black spot at the back",
    "active, friendly",
    null,
    null,
    null,
    "NORMAL,OFFSITE",
    "img/animal/ANM00003.jpg",
  );

  let panda4Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "Fu Fu",
    AnimalSex.MALE,
    new Date("2008-03-04"),
    "Singapore",
    IdentifierType.RFID_TAG,
    "identifierValue 001",
    AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
    new Date("2021-09-04"),
    "N.A.",
    "Big face, black spot at the back",
    "active, friendly",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/ANM00004.jpg",
  );

  let panda5Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "Tuan Tuan",
    AnimalSex.MALE,
    new Date("2007-08-04"),
    "Singapore",
    IdentifierType.RFID_TAG,
    "identifierValue 001",
    AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
    new Date("2021-03-04"),
    "N.A.",
    "Big face, black spot at the back",
    "active, friendly",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/ANM00005.jpg",
  );

  let panda6Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "Huan Huan",
    AnimalSex.MALE,
    new Date("2005-03-04"),
    "Singapore",
    IdentifierType.RFID_TAG,
    "identifierValue 001",
    AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
    new Date("2021-03-04"),
    "N.A.",
    "Big face, black spot at the back",
    "active, friendly",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/ANM00006.jpg",
  );

  let panda7Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "Yin Yin",
    AnimalSex.FEMALE,
    new Date("2017-03-04"),
    "Singapore",
    IdentifierType.RFID_TAG,
    "identifierValue 001",
    AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
    new Date("2021-03-04"),
    "N.A.",
    "Big face, black spot at the back",
    "active, friendly",
    null,
    null,
    null,
    "NORMAL,PREGNANT",
    "img/animal/ANM00007.jpg",
  );
  let panda8Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "Ni Ni",
    AnimalSex.FEMALE,
    new Date("2020-03-04"),
    "Singapore",
    IdentifierType.RFID_TAG,
    "identifierValue 001",
    AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
    new Date("2021-03-04"),
    "N.A.",
    "Big face, black spot at the back",
    "active, friendly",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/ANM00008.jpg",
  );
  let panda9Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "Bei Bei",
    AnimalSex.MALE,
    new Date("2016-03-04"),
    "Singapore",
    IdentifierType.RFID_TAG,
    "identifierValue 001",
    AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
    new Date("2021-03-04"),
    "N.A.",
    "Big face, black spot at the back",
    "active, friendly",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/ANM00009.jpg",
  );

  let panda10Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "La La",
    AnimalSex.MALE,
    new Date("2022-03-04"),
    "Singapore",
    IdentifierType.RFID_TAG,
    "identifierValue 001",
    AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
    new Date("2021-03-04"),
    "N.A.",
    "Big face, black spot at the back",
    "active, friendly",
    null,
    null,
    null,
    "SICK,INJURED",
    "img/animal/ANM00010.jpg",
  );

  let clownFish1Template = await AnimalService.createNewAnimal(
    "SPE005",
    true,
    "Clown Fish Group 1",
    null,
    null,
    "Singapore",
    null,
    null,
    AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
    new Date("2021-03-04"),
    null,
    "Big group, around 100-150 fish",
    "Likes to swin swirl",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/ANM00011.jpg",
  );

  let clownFish2Template = await AnimalService.createNewAnimal(
    "SPE005",
    true,
    "Clown Fish Group 2",
    null,
    null,
    "Korea",
    null,
    null,
    AcquisitionMethod.TRANSFERRED_FROM_ANOTHER_ZOO,
    new Date("2023-03-04"),
    null,
    "Medium group, around 50-70 fish",
    "Likes to swin swirl",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/ANM00012.jpg",
  );

  // -- add lineage
  await AnimalService.addAnimalLineage("ANM00002", "ANM00001");
  await AnimalService.addAnimalLineage("ANM00002", "ANM00004");
  await AnimalService.addAnimalLineage("ANM00010", "ANM00001");
  await AnimalService.addAnimalLineage("ANM00010", "ANM00004");
  await AnimalService.addAnimalLineage("ANM00003", "ANM00002");
  await AnimalService.addAnimalLineage("ANM00003", "ANM00005");
  await AnimalService.addAnimalLineage("ANM00006", "ANM00003");
  await AnimalService.addAnimalLineage("ANM00006", "ANM00009");
  await AnimalService.addAnimalLineage("ANM00008", "ANM00006");
  await AnimalService.addAnimalLineage("ANM00008", "ANM00007");

  // -- add weight
  // overweight
  await AnimalService.addAnimalWeight("ANM00001", 10, new Date("2001-10-6"));
  await AnimalService.addAnimalWeight("ANM00001", 42, new Date("2003-10-6"));
  await AnimalService.addAnimalWeight("ANM00001", 68, new Date("2007-10-6"));
  await AnimalService.addAnimalWeight("ANM00001", 80, new Date("2010-10-6"));
  await AnimalService.addAnimalWeight("ANM00001", 85, new Date("2013-6-8"));
  await AnimalService.addAnimalWeight("ANM00001", 83, new Date("2015-9-2"));
  await AnimalService.addAnimalWeight("ANM00001", 80, new Date("2019-4-6"));
  await AnimalService.addAnimalWeight("ANM00001", 90, new Date("2021-2-10"));
  await AnimalService.addAnimalWeight("ANM00001", 95, new Date("2022-2-10"));
  await AnimalService.addAnimalWeight("ANM00001", 110, new Date("2023-2-10"));

  // underweight
  await AnimalService.addAnimalWeight("ANM00002", 60, new Date("2023-10-6"));

  // overweight
  await AnimalService.addAnimalWeight("ANM00003", 150, new Date("2023-10-6"));

  //normal
  await AnimalService.addAnimalWeight("ANM00004", 90, new Date("2023-10-6"));

  // -- create animal activity
  let animalActivity1 = await AnimalService.createAnimalActivity(
    ActivityType.ENRICHMENT,
    "Bamboo Bonanza",
    "Treat our pandas to a bamboo feast! We'll scatter bamboo leaves and shoots throughout their habitat to encourage natural foraging behavior.",
    new Date("2023-10-13"),
    EventTimingType.AFTERNOON,
    45,
  );

  let animalActivity2 = await AnimalService.createAnimalActivity(
    ActivityType.TRAINING,
    "Target Training",
    "Use a target stick to teach pandas to touch a designated spot. This aids in directing their movement and helps with medical check-ups.",
    new Date("2023-10-15"),
    EventTimingType.MORNING,
    60,
  );

  let animalActivity3 = await AnimalService.createAnimalActivity(
    ActivityType.ENRICHMENT,
    "Enrichment Activity 01",
    "Text...",
    new Date("2023-10-16"),
    EventTimingType.MORNING,
    60,
  );
  let animalActivity4 = await AnimalService.createAnimalActivity(
    ActivityType.ENRICHMENT,
    "Enrichment Activity 02",
    "Text...",
    new Date("2023-10-16"),
    EventTimingType.MORNING,
    60,
  );
  let animalActivity5 = await AnimalService.createAnimalActivity(
    ActivityType.TRAINING,
    "Training Activity 01",
    "Text...",
    new Date("2023-10-18"),
    EventTimingType.AFTERNOON,
    60,
  );
  let animalActivity6 = await AnimalService.createAnimalActivity(
    ActivityType.TRAINING,
    "Training Activity 02",
    "Text...",
    new Date("2023-10-18"),
    EventTimingType.EVENING,
    60,
  );

  await AnimalService.assignAnimalsToActivity("1", ["ANM00001", "ANM00003"]);
  await AnimalService.assignItemToActivity("1", ["1", "2"]);
};

export const animalFeedSeed = async () => {
  // let carrotTemplate = {
  //   animalFeedName: "Carrot",
  //   animalFeedImageUrl: "img/animalFeed/carrot.jpg",
  //   animalFeedCategory: AnimalFeedCategory.VEGETABLES
  // } as any;
  // let carrot = await AnimalFeed.create(carrotTemplate);
  // console.log(carrot.toJSON());

  let appleTemplate = {
    animalFeedName: "Apple",
    animalFeedImageUrl: "img/animalFeed/apple.jpg",
    animalFeedCategory: AnimalFeedCategory.FRUITS,
  } as any;
  let apple = await AnimalFeed.create(appleTemplate);
  console.log(apple.toJSON());

  let beefTemplate = {
    animalFeedName: "Beef",
    animalFeedImageUrl: "img/animalFeed/beef.jpg",
    animalFeedCategory: AnimalFeedCategory.RED_MEAT,
  } as any;
  let beef = await AnimalFeed.create(beefTemplate);
  console.log(beef.toJSON());

  let Pineapple = await AnimalFeed.create({
    animalFeedName: "Pineapple",
    animalFeedImageUrl: "img/animalFeed/Pineapple.jpg",
    animalFeedCategory: AnimalFeedCategory.FRUITS,
  });
  console.log(Pineapple.toJSON());

  let Carrot = await AnimalFeed.create({
    animalFeedName: "Carrot",
    animalFeedImageUrl: "img/animalFeed/Carrot.jpg",
    animalFeedCategory: AnimalFeedCategory.VEGETABLES,
  });
  console.log(Carrot.toJSON());
};

export const enrichmentItemSeed = async () => {
  let scratchingPostTemplate = {
    enrichmentItemName: "Scratching Post",
    enrichmentItemImageUrl: "img/enrichmentItem/scratchingPost.jpg",
  } as any;
  let scratchingPost = await EnrichmentItem.create(scratchingPostTemplate);
  console.log(scratchingPost.toJSON());

  let yogaBallTemplate = {
    enrichmentItemName: "Yoga Ball",
    enrichmentItemImageUrl: "img/enrichmentItem/yogaBall.jpg",
  } as any;
  let yogaBall = await EnrichmentItem.create(yogaBallTemplate);
  console.log(yogaBall.toJSON());

  let Puzzle = await EnrichmentItem.create({
    enrichmentItemName: "Puzzle",
    enrichmentItemImageUrl: "img/enrichmentItem/Puzzle.jpg",
  });
  console.log(Puzzle.toJSON());

  let Feeder = await EnrichmentItem.create({
    enrichmentItemName: "Feeder",
    enrichmentItemImageUrl: "img/enrichmentItem/feeder.jpg",
  });
  console.log(Feeder.toJSON());
};

export const facilityAssetsSeed = async () => {
  let toiletTemplate = {
    facilityName: "Toilet",
    isSheltered: true,
    showOnMap: true,
    inHouse: {
      lastMaintained: new Date(),
      isPaid: false,
      maxAccommodationSize: 5,
      hasAirCon: false,
      facilityType: FacilityType.PARKING,
    } as any,
  } as any;
  let toilet = await Facility.create(toiletTemplate, { include: ["inHouse"] });
  let toiletInhouse: InHouse = await toilet.getFacilityDetail();

  let _day = new Date();
  for (const days of [1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2]) {
    _day = new Date(_day.getTime() - days * 1000 * 60 * 60 * 24);

    toiletInhouse.addFacilityLog(
      await FacilityLog.create({
        dateTime: _day,
        isMaintenance: true,
        title: "Maintenance of " + _day.toDateString(),
        details: "Bla Bla Bla...",
        remarks: "Uncommon but common",
        staffName: "maint1",
      }),
    );
  }

  console.log(toilet.toJSON());

  let facility1 = await Facility.create(
    {
      facilityName: "facility1",
      xCoordinate: 123,
      yCoordinate: 654,
      isSheltered: true,
      showOnMap: true,
      hubProcessors: [
        {
          processorName: "A01",
          ipAddressName: "172.1.2.19",
          hubStatus: HubStatus.CONNECTED,
          radioGroup: 222,
        } as any,
      ],
      inHouse: {
        lastMaintained: new Date(),
        isPaid: false,
        maxAccommodationSize: 5,
        hasAirCon: false,
        facilityType: FacilityType.PARKING,
      } as any,
    } as any,
    {
      include: [
        {
          association: "hubProcessors",
        },
        {
          association: "inHouse",
        },
      ],
    },
  );
  console.log(facility1);
  const ih1 = await await facility1.getInHouse();
  ih1.setFacilityLogs([
    await FacilityLog.create({
      dateTime: new Date(),
      isMaintenance: false,
      title: "log1",
      details: "Bla Bla...",
      remarks: "my log haha",
      staffName: "maint1",
    }),
    await FacilityLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isMaintenance: false,
      title: "log2",
      details: "Bla Bla...",
      remarks: "my log haha",
      staffName: "maint1",
    }),
    await FacilityLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      isMaintenance: false,
      title: "log3",
      details: "Bla Bla...",
      remarks: "my log haha",
      staffName: "maint1",
    }),
    await FacilityLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      isMaintenance: false,
      title: "log4",
      details: "Bla Bla...",
      remarks: "my log haha",
      staffName: "maint1",
    }),
    await FacilityLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      isMaintenance: false,
      title: "log5",
      details: "Bla Bla...",
      remarks: "my log haha",
      staffName: "maint1",
    }),
  ]);
  // facility1.destroy();

  let maintenanceStaff = await (
    await Employee.findOne({ where: { employeeName: "managerDelete" } })
  )?.getGeneralStaff();
  await maintenanceStaff?.setMaintainedFacilities([
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

  let tram1 = await Facility.create(
    {
      facilityName: "tram1",
      isSheltered: true,

      //@ts-ignore
      inHouse: {
        isPaid: true,
        maxAccommodationSize: 15,
        hasAirCon: true,
        facilityType: FacilityType.TRAMSTOP,
      },
    },
    {
      include: [
        {
          association: "inHouse",
        },
      ],
    },
  );
  let gs = await (
    await Employee.findOne({ where: { employeeName: "managerDelete" } })
  )?.getGeneralStaff();
  let is1 = await tram1.getInHouse();

  await gs?.addMaintainedFacilities(is1);

  let tram2 = await Facility.create(
    {
      facilityName: "tram2",
      isSheltered: true,
      //@ts-ignore
      inHouse: {
        isPaid: true,
        maxAccommodationSize: 15,
        hasAirCon: true,
        facilityType: FacilityType.TRAMSTOP,
      },
    },
    {
      include: [
        {
          association: "inHouse",
        },
      ],
    },
  );
  let hub1 = await HubProcessor.create(
    {
      processorName: "tramCam1",
      ipAddressName: "172.25.99.172",
      hubStatus: HubStatus.CONNECTED,
      lastDataUpdate: new Date(),
      radioGroup: 223,
      sensors: [
        {
          sensorName: "HUMIDITY1",
          sensorType: SensorType.HUMIDITY,
        },
        {
          sensorName: "DA_SUN",
          sensorType: SensorType.LIGHT,
        },
        {
          sensorName: "TEMPERATURE1",
          sensorType: SensorType.TEMPERATURE,
        },
        {
          sensorName: "TEMPERATURE2",
          sensorType: SensorType.TEMPERATURE,
        },
        {
          sensorName: "Camera",
          sensorType: SensorType.CAMERA,
        },
      ],
    } as any,
    {
      include: [
        {
          association: "sensors",
        },
      ],
    },
  );
  await hub1.setFacility(tram2);

  let sensors: Sensor[] = await hub1.getSensors();

  let sensor = sensors[0];

  _day = new Date(Date.now() - 1000 * 60 * 60 * 24 * 10);
  for (const days of [1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2]) {
    _day = new Date(_day.getTime() - days * 1000 * 60 * 60 * 24);
    sensor.addMaintenanceLog(
      await MaintenanceLog.create({
        dateTime: _day,
        title: "Maintenance " + _day.toDateString(),
        details: "Bla bla bla...",
        remarks: "not uncommon",
        staffName: "maint1",
      }),
    );
  }
  sensor.dateOfLastMaintained = _day;

  for (let i = 1; i < 1000; i++) {
    sensor.addSensorReading(
      await SensorReading.create({
        readingDate: new Date(Date.now() - 1000 * 60 * 30 * i),
        value: Math.random() * 5 + 30 + i / 20,
      }),
    );
  }
  sensor.save();

  sensor = sensors[1];
  _day = new Date(Date.now() - 1000 * 60 * 60 * 24 * 5);
  for (const days of [
    0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  ]) {
    _day = new Date(
      _day.getTime() -
      days * 1000 * 60 * 60 * 24 +
      Math.random() * 1000 * 60 * 60 * 24 * 4 -
      1000 * 60 * 60 * 24 * 2,
    );
    sensor.addMaintenanceLog(
      await MaintenanceLog.create({
        dateTime: _day,
        title: "Maintenance " + _day.toDateString(),
        details: "Bla bla bla...",
        remarks: "not uncommon",
        staffName: "maint1",
      }),
    );
  }
  sensor.dateOfLastMaintained = _day;

  for (let i = 1; i < 100; i++) {
    sensor.addSensorReading(
      await SensorReading.create({
        readingDate: new Date(Date.now() - 1000 * 60 * i),
        value: Math.random() * 2 + 10 + i / 20,
      }),
    );
  }
  sensor.save();

  sensor = sensors[2];
  _day = new Date(Date.now());
  for (const days of [3, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    _day = new Date(_day.getTime() - days * 1000 * 60 * 60 * 24);
    sensor.addMaintenanceLog(
      await MaintenanceLog.create({
        dateTime: _day,
        title: "Maintenance " + _day.toDateString(),
        details: "Bla bla bla...",
        remarks: "not uncommon",
        staffName: "maint1",
      }),
    );
  }
  sensor.dateOfLastMaintained = _day;

  for (let i = 1; i < 100; i++) {
    sensor.addSensorReading(
      await SensorReading.create({
        readingDate: new Date(Date.now() - 1000 * 60 * i),
        value: Math.random() * 1 + 30 - i / 100,
      }),
    );
  }
  sensor.save();

  sensor = sensors[3];
  _day = new Date(Date.now());
  for (const days of [0, 1, 3, 4, 2, 4]) {
    _day = new Date(_day.getTime() - days * 1000 * 60 * 60 * 24);
    sensor.addMaintenanceLog(
      await MaintenanceLog.create({
        dateTime: _day,
        title: "Maintenance " + _day.toDateString(),
        details: "Bla bla bla...",
        remarks: "not uncommon",
        staffName: "maint1",
      }),
    );
  }
  sensor.dateOfLastMaintained = _day;

  for (let i = 1; i < 100; i++) {
    sensor.addSensorReading(
      await SensorReading.create({
        readingDate: new Date(Date.now() - 1000 * 60 * i),
        value: Math.random() * 5 - i / 50,
      }),
    );
  }
  sensor.save();

  sensor = sensors[4];
  _day = new Date(Date.now());
  // [1, 5, 2, 4, 8, 5, 7, 11, 8, 10, 14, 11, 13, 17]
  for (const days of [0, 17, 13, 11, 14, 10, 8, 11, 7, 5, 8, 4, 2, 5, 1]) {
    _day = new Date(_day.getTime() - days * 1000 * 60 * 60 * 24);
    sensor.addMaintenanceLog(
      await MaintenanceLog.create({
        dateTime: _day,
        title: "Maintenance " + _day.toDateString(),
        details: "Bla bla bla...",
        remarks: "not uncommon",
        staffName: "maint1",
      }),
    );
  }
  sensor.dateOfLastMaintained = _day;

  for (let i = 1; i < 100; i++) {
    sensor.addSensorReading(
      await SensorReading.create({
        readingDate: new Date(Date.now() - 1000 * 60 * i),
        value: Math.random() * 15 + 3 + i,
      }),
    );
  }
  sensor.save();

  // let hub2 = await HubProcessor.create(
  //   {
  //     processorName: "tramCam2",
  //     ipAddressName: "172.25.99.173",
  //     HubStatus: HubStatus.CONNECTED,
  //     radioGroup: 221,
  //     sensors: [
  //       {
  //         sensorName: "Camera3",
  //         dateOfActivation: new Date(),
  //         dateOfLastMaintained: new Date(),
  //         sensorType: SensorType.CAMERA,
  //       },
  //       {
  //         sensorName: "Camera4",
  //         dateOfActivation: new Date(),
  //         dateOfLastMaintained: new Date(),
  //         sensorType: SensorType.CAMERA,
  //       },
  //     ],
  //   } as any,
  //   {
  //     include: [
  //       {
  //         association: "sensors",
  //       },
  //     ],
  //   },
  // );

  tram2
    .getInHouse()
    .then((tramstop) =>
      tram1
        .getInHouse()
        .then((tramstop2) => tramstop.setNextTramStop(tramstop2)),
    );

  // let cameraTemplate = {
  //   sensorName: "Camera5",
  //   dateOfActivation: new Date(),
  //   dateOfLastMaintained: new Date(),
  //   sensorType: SensorType.CAMERA,
  // } as any;
  // let camera = await Sensor.create(cameraTemplate);
};

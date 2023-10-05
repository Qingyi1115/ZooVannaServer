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
  Specialization,
  AnimalSex,
  ActivityType,
  EventTimingType,
} from "./enumerated";
import { Event } from "./event";
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

  // added by qy for animal activity 5 Oct
  Employee.hasMany(AnimalActivity);
  AnimalActivity.belongsTo(Employee);

  Facility.hasMany(
    HubProcessor,
    addCascadeOptions({ foreignKey: "facilityId" }),
  );
  HubProcessor.belongsTo(
    Facility,
    addCascadeOptions({ foreignKey: "facilityId" }),
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

  Sensor.hasMany(SensorReading, addCascadeOptions({ foreignKey: "sensorId" }));
  SensorReading.belongsTo(
    Sensor,
    addCascadeOptions({ foreignKey: "sensorId" }),
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
    as: "species",
  });
  Customer.belongsToMany(Species, {
    foreignKey: "customerId",
    through: "customerFravouriteSpecies",
    as: "customers",
  });

  Animal.hasMany(AnimalLog, addCascadeOptions({ foreignKey: "animalId" }));
  AnimalLog.belongsTo(Animal, addCascadeOptions({ foreignKey: "animalId" }));

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
    addCascadeOptions({ foreignKey: "orderItemId" }),
  );
  OrderItem.belongsTo(
    CustomerOrder,
    addCascadeOptions({ foreignKey: "orderItemId" }),
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
      employeeName: "planner1",
      employeeAddress: "Singapore Kent Ridge LT28",
      employeeEmail: "planner1@gmail.com",
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
    lifeExpectancyYears: 65,
    ageToJuvenile: 2,
    ageToAdolescent: 5,
    ageToAdult: 7,
    ageToElder: 50,
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
    100,
    100,
    100,
    100,
    0,
    5,
    AnimalGrowthStage.INFANT,
  );
  console.log(pandaPhy1.toJSON());

  let pandaPhy2 = await SpeciesService.createPhysiologicalReferenceNorms(
    "SPE001",
    200,
    200,
    200,
    200,
    2,
    5,
    AnimalGrowthStage.ADULT,
  );
  console.log(pandaPhy2.toJSON());

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
  let capybara1Template = {
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
    ageToJuvenile: 2,
    ageToAdolescent: 5,
    ageToAdult: 7,
    ageToElder: 50,
    // foodRemark: "Food remark...",
  } as any;
  let capybara1 = await Species.create(capybara1Template);
  console.log(capybara1.toJSON());

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
    lifeExpectancyYears: 14,
    ageToJuvenile: 2,
    ageToAdolescent: 5,
    ageToAdult: 7,
    ageToElder: 50,
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
    lifeExpectancyYears: 14,
    ageToJuvenile: 2,
    ageToAdolescent: 5,
    ageToAdult: 7,
    ageToElder: 50,
    // foodRemark: "Food remark...",
  } as any;
  let elephant = await Species.create(africanElephantTemplate);
  console.log(elephant.toJSON());

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
    new Date("1990-03-04"),
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
    "img/animal/pangPang.jpg",
  );

  let panda2Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "Yuan Yuan",
    AnimalSex.FEMALE,
    new Date("1997-03-04"),
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
    "img/animal/yuanYuan.jpg",
  );

  let panda3Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "Du Du",
    AnimalSex.FEMALE,
    new Date("2021-03-04"),
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
    "img/animal/duDu.jpg",
  );

  let panda4Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "Fu Fu",
    AnimalSex.MALE,
    new Date("2021-03-04"),
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
    "img/animal/fuFu.jpg",
  );

  let panda5Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "Tuan Tuan",
    AnimalSex.MALE,
    new Date("2021-03-04"),
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
    "img/animal/tuanTuan.jpg",
  );

  let panda6Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "Huan Huan",
    AnimalSex.MALE,
    new Date("2021-03-04"),
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
    "img/animal/huanHuan.jpg",
  );

  let panda7Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "Yin Yin",
    AnimalSex.FEMALE,
    new Date("2021-03-04"),
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
    "img/animal/yinYin.jpg",
  );
  let panda8Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "Ni Ni",
    AnimalSex.FEMALE,
    new Date("2021-03-04"),
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
    "img/animal/niNi.jpg",
  );
  let panda9Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "Bei Bei",
    AnimalSex.MALE,
    new Date("2021-03-04"),
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
    "img/animal/beiBei.jpg",
  );

  let panda10Template = await AnimalService.createNewAnimal(
    "SPE001",
    false,
    "La La",
    AnimalSex.MALE,
    new Date("2021-03-04"),
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
    "img/animal/laLa.jpg",
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

  // -- create animal activity
  let animalActivity1 = await AnimalService.createAnimalActivity(
    ActivityType.ENRICHMENT,
    "Bamboo Bonanza",
    "Treat our pandas to a bamboo feast! We'll scatter bamboo leaves and shoots throughout their habitat to encourage natural foraging behavior.",
    new Date("2021-03-04"),
    EventTimingType.AFTERNOON,
    45,
  );

  let animalActivity2 = await AnimalService.createAnimalActivity(
    ActivityType.TRAINING,
    "Target Training",
    "Use a target stick to teach pandas to touch a designated spot. This aids in directing their movement and helps with medical check-ups.",
    new Date("2021-03-04"),
    EventTimingType.MORNING,
    60,
  );
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
    xCoordinate: 2,
    yCoordinate: 2,
    isSheltered: true,
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
        title: "string",
        details: "string",
        remarks: "string",
      }),
    );
  }

  console.log(toilet.toJSON());

  let facility1 = await Facility.create(
    {
      facilityName: "facility1",
      xCoordinate: 123456,
      yCoordinate: 654321,
      isSheltered: true,
      hubProcessors: [
        {
          processorName: "A01",
          ipAddressName: "172.1.2.19",
          hubStatus: HubStatus.CONNECTED,
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
      details: "string",
      remarks: "string",
    }),
    await FacilityLog.create({
      dateTime: new Date(),
      isMaintenance: false,
      title: "log2",
      details: "string",
      remarks: "string",
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
      xCoordinate: 123,
      yCoordinate: 321,
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
      xCoordinate: 123,
      yCoordinate: 321,
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
      sensors: [
        {
          sensorName: "HUMIDITY1",
          sensorType: SensorType.HUMIDITY,
        },
        {
          sensorName: "LIGHT1",
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
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now()),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  _day = new Date();
  for (const days of [1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2]) {
    _day = new Date(_day.getTime() - days * 1000 * 60 * 60 * 24);
    sensor.addMaintenanceLog(
      await MaintenanceLog.create({
        dateTime: _day,
        title: "string",
        details: "string",
        remarks: "string",
      }),
    );
  }

  for (let i = 1; i < 100; i++) {
    sensor.addSensorReading(
      await SensorReading.create({
        readingDate: new Date(Date.now() - 1000 * 60 * i),
        value: Math.random() * 5 + 30 + i / 20,
      }),
    );
  }

  sensor = sensors[1];
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 36),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 55),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 66),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 78),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );

  for (let i = 1; i < 100; i++) {
    sensor.addSensorReading(
      await SensorReading.create({
        readingDate: new Date(Date.now() - 1000 * 60 * i),
        value: Math.random() * 2 + 10 + i / 20,
      }),
    );
  }

  sensor = sensors[2];
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  // sensor.addMaintenanceLog(await MaintenanceLog.create({ dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18), title: "string", details: "string", remarks: "string" }))
  // sensor.addMaintenanceLog(await MaintenanceLog.create({ dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 19), title: "string", details: "string", remarks: "string" }))
  // sensor.addMaintenanceLog(await MaintenanceLog.create({ dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21), title: "string", details: "string", remarks: "string" }))
  // sensor.addMaintenanceLog(await MaintenanceLog.create({ dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22), title: "string", details: "string", remarks: "string" }))

  for (let i = 1; i < 100; i++) {
    sensor.addSensorReading(
      await SensorReading.create({
        readingDate: new Date(Date.now() - 1000 * 60 * i),
        value: Math.random() * 1 + 30 - i / 100,
      }),
    );
  }

  sensor = sensors[3];
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now()),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );

  for (let i = 1; i < 100; i++) {
    sensor.addSensorReading(
      await SensorReading.create({
        readingDate: new Date(Date.now() - 1000 * 60 * i),
        value: Math.random() * 5 - i / 50,
      }),
    );
  }

  sensor = sensors[4];
  [1, 5, 2, 4, 8, 5, 7, 11, 8, 10, 14, 11, 13, 17];
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now()),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 17),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 41),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 55),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 65),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 73),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 84),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 91),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 96),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 104),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 108),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 110),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 115),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );
  sensor.addMaintenanceLog(
    await MaintenanceLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 116),
      title: "string",
      details: "string",
      remarks: "string",
    }),
  );

  for (let i = 1; i < 100; i++) {
    sensor.addSensorReading(
      await SensorReading.create({
        readingDate: new Date(Date.now() - 1000 * 60 * i),
        value: Math.random() * 15 + 3 + i,
      }),
    );
  }

  let hub2 = await HubProcessor.create(
    {
      processorName: "tramCam2",
      ipAddressName: "172.25.99.173",
      HubStatus: HubStatus.CONNECTED,
      sensors: [
        {
          sensorName: "Camera3",
          dateOfActivation: new Date("01-01-2023"),
          dateOfLastMaintained: new Date("09-09-2023"),
          sensorType: SensorType.CAMERA,
        },
        {
          sensorName: "Camera4",
          dateOfActivation: new Date("01-01-2023"),
          dateOfLastMaintained: new Date("09-09-2023"),
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

  tram2
    .getInHouse()
    .then((tramstop) =>
      tram1
        .getInHouse()
        .then((tramstop2) => tramstop.setNextTramStop(tramstop2)),
    );

  let cameraTemplate = {
    sensorName: "Camera5",
    dateOfActivation: new Date("01-01-2023"),
    dateOfLastMaintained: new Date("09-09-2023"),
    sensorType: SensorType.CAMERA,
  } as any;
  let camera = await Sensor.create(cameraTemplate);
};

//  Import models
import { conn } from "../db";
import { Employee } from "./employee";
import { Keeper } from "./keeper";
import { PlanningStaff } from "./planningStaff";
import { Facility } from "./facility";
import { Compatibility } from "./compatibility";
import { Sensor } from "./sensor";
import { GeneralStaff } from "./generalStaff";
import { InHouse } from "./inHouse";
import {
  KeeperType,
  PlannerType,
  GeneralStaffType,
  Specialization,
  FacilityType,
  HubStatus,
  ConservationStatus,
  Continent,
  GroupSexualDynamic,
  SensorType,
  AnimalGrowthStage,
  PresentationContainer,
  PresentationLocation,
  PresentationMethod,
  AnimalFeedCategory,
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
import { CustomerOrder } from "./customerOrder";
import { Customer } from "./customer";
import { HubProcessor } from "./hubProcessor";
import { CustomerReportLog } from "./customerReportLog";
import { SensorReading } from "./sensorReading";
import { PhysiologicalReferenceNorms } from "./physiologicalReferenceNorms";
import { EnrichmentItem } from "./enrichmentItem";
import { AnimalFeed } from "./animalFeed";
import { MaintenanceLog } from "./maintenanceLog";
import * as SpeciesService from "../services/species";
import { predictNextDate } from "../helpers/predictors";

function addCascadeOptions(options: object) {
  return { ...options, onDelete: "CASCADE", onUpdate: "CASCADE" };
}

export const createDatabase = async (options: any) => {
  // Create relationships
  Employee.hasOne(Keeper, addCascadeOptions({ foreignKey: "employeeId" }));
  Keeper.belongsTo(Employee , addCascadeOptions({ foreignKey: "employeeId" }));

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
  MaintenanceLog.belongsTo(Sensor, addCascadeOptions({ foreignKey: "sensorId" }));

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

  LineItem.hasMany(CustomerOrder, addCascadeOptions({ foreignKey: "orderId" }));
  CustomerOrder.belongsTo(
    LineItem,
    addCascadeOptions({ foreignKey: "orderId" }),
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
  await tutorial();
  // await animalFeedSeed();
  // await enrichmentItemSeed();
  await facilityAssetsSeed();
  await speciesSeed();
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
    employeeBirthDate: new Date("1992-03-04"),
    isAccountManager: true,
    //@ts-ignore
    planningStaff:{
      plannerType: PlannerType.OPERATIONS_MANAGER,
      specialization: Specialization.FISH,
      isDisabled : false
    }
  },{
    include: {
      association: "planningStaff",
    },
  });
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
  // facility1.destroy();

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

export const speciesSeed = async () => {
  let panda1Template = {
    speciesCode: await Species.getNextSpeciesCode(),
    commonName: "Giant Panda",
    scientificName: "Ailuropoda Melanoleuca",
    aliasName: "Panda Bear, Panda",
    conservationStatus: ConservationStatus.VULNERABLE,
    domain: "Eukaryota",
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
    nativeBiomes: "Temperate Forests",
    groupSexualDynamic: GroupSexualDynamic.POLYANDROUS,
    habitatOrExhibit: "Southwest China",
    generalDietPreference: "Bamboo?? LOL what to put",
    imageUrl: "img/species/panda.jpeg",
    lifeExpectancyYears: 14,
    // foodRemark: "Food remark...",
  } as any;
  let panda1 = await Species.create(panda1Template);
  console.log(panda1.toJSON());
  let panda1enclosure = await SpeciesService.createEnclosureNeeds(
    "SPE001",
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
  );
  console.log(panda1enclosure.toJSON());

  let panda1phy1 = await SpeciesService.createPhysiologicalReferenceNorms(
    "SPE001",
    100,
    100,
    100,
    100,
    100,
    AnimalGrowthStage.INFANT,
  );
  console.log(panda1phy1.toJSON());

  let panda1phy2 = await SpeciesService.createPhysiologicalReferenceNorms(
    "SPE001",
    200,
    200,
    200,
    200,
    200,
    AnimalGrowthStage.ADULT,
  );
  console.log(panda1phy2.toJSON());

  let panda1DietNeed1 = await SpeciesService.createDietNeed(
    "SPE001",
    AnimalFeedCategory.FISH,
    100,
    1000,
    PresentationContainer.SILICONE_DISH,
    PresentationMethod.CHOPPED,
    PresentationLocation.IN_CONTAINER,
    AnimalGrowthStage.ADULT,
  );
  console.log(panda1DietNeed1.toJSON());

  let panda1DietNeed2 = await SpeciesService.createDietNeed(
    "SPE001",
    AnimalFeedCategory.HAY,
    1000,
    7000,
    PresentationContainer.HANGING_FEEDERS,
    PresentationMethod.WHOLE,
    PresentationLocation.IN_CONTAINER,
    AnimalGrowthStage.JUVENILE,
  );
  console.log(panda1DietNeed2.toJSON());

  let capybara1Template = {
    speciesCode: await Species.getNextSpeciesCode(),
    commonName: "Capybara",
    scientificName: "Hydrochoerus Hydrochaeris",
    aliasName: "Water pig, Hydrochaeris hydrochaeris",
    conservationStatus: ConservationStatus.LEAST_CONCERN,
    domain: "Eukaryota",
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
    generalDietPreference: "Herbivores",
    imageUrl: "img/species/capybara.jpg",
    lifeExpectancyYears: 10,
    // foodRemark: "Food remark...",
  } as any;
  let capybara1 = await Species.create(capybara1Template);
  console.log(capybara1.toJSON());

  let redPanda1Template = {
    speciesCode: await Species.getNextSpeciesCode(),
    commonName: "Red Panda",
    scientificName: "Ailurus fulgens",
    aliasName: "Lesser Panda, Fire Fox",
    conservationStatus: ConservationStatus.ENDANGERED,
    domain: "Eukaryota",
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
    generalDietPreference: "Herbivores",
    imageUrl: "img/species/redPanda.jpeg",
    lifeExpectancyYears: 14,
    // foodRemark: "Food remark...",
  } as any;
  let redPanda1 = await Species.create(redPanda1Template);
  console.log(redPanda1.toJSON());

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

export const animalFeedSeed = async () => {
  let carrotTemplate = {
    animalFeedName: "Carrots",
    animalFeedImageUrl: "Fake_URL_here",
    animalFeedCategory: AnimalFeedCategory.VEGETABLES
  } as any;
  let carrot = await AnimalFeed.create(carrotTemplate);
  console.log(carrot.toJSON());
}

export const enrichmentItemSeed = async () => {
  let puzzleTemplate = {
    enrichmentItemName: "Puzzle",
    enrichmentItemImageUrl: "Fake_URL_here",
  } as any;
  let puzzle = await EnrichmentItem.create(puzzleTemplate);
  console.log(puzzle.toJSON());
}

export const facilitySeed = async () => {
  let toiletTemplate = {
    facilityName: "Toilet",
    xCoordinate: 2,
    yCoordinate: 2,
    facilityDetail: "Test facility"
  } as any;
  let toilet = await Facility.create(toiletTemplate);
  console.log(toilet.toJSON());
}

export const facilityAssetsSeed = async () => {
  let tram1 = await Facility.create({
    facilityName: "tram1",
    xCoordinate: 123,
    yCoordinate: 321,
    isSheltered: true,
    
    //@ts-ignore
    inHouse:{
      isPaid: true,
      maxAccommodationSize: 15,
      hasAirCon: true,
      facilityType: FacilityType.TRAMSTOP
    }
  },{
    include: [
      {
        association: "inHouse",
      },
    ],
  });
  let tram2 = await Facility.create({
    facilityName: "tram2",
    xCoordinate: 123,
    yCoordinate: 321,
    isSheltered: true,
    
    //@ts-ignore
    inHouse:{
      isPaid: true,
      maxAccommodationSize: 15,
      hasAirCon: true,
      facilityType: FacilityType.TRAMSTOP
    }
  },{
    include: [
      {
        association: "inHouse",
      },
    ],
  });
  let hub1 = await HubProcessor.create({
    processorName : "tramCam1",
    ipAddressName: "172.25.99.172",
    sensors:[
      {
        sensorName: "Camera1",
        sensorType: SensorType.CAMERA
      },{
        sensorName: "Camera2",
        sensorType: SensorType.CAMERA
      }
    ]
  } as any,{
    include: [
      {
        association: "sensors",
      },
    ],
  });
  let hub2 = await HubProcessor.create({
    processorName : "tramCam2",
    ipAddressName: "172.25.99.173",
    HubStatus: HubStatus.CONNECTED,
    sensors:[{
      sensorName: "Camera3",
      dateOfActivation: new Date("01-01-2023"),
      dateOfLastMaintained: new Date("09-09-2023"),
      sensorType: SensorType.CAMERA
      },{
        sensorName: "Camera4",
        dateOfActivation: new Date("01-01-2023"),
        dateOfLastMaintained: new Date("09-09-2023"),
        sensorType: SensorType.CAMERA
      }
    ]
  } as any,{
    include: [
      {
        association: "sensors",
      },
    ],
  });

  (tram2.getInHouse()).then(tramstop => tram1.getInHouse().then(tramstop2=> tramstop.setNextTramStop(tramstop2))); 




  let cameraTemplate = {
    sensorName: "Camera5",
    dateOfActivation: new Date("01-01-2023"),
    dateOfLastMaintained: new Date("09-09-2023"),
    sensorType: SensorType.CAMERA
  } as any;
  let camera = await Sensor.create(cameraTemplate);
  console.log(camera.toJSON());
}

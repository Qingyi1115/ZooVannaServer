//  Import models
import { v4 as uuidv4 } from "uuid";
import { conn } from "../db";
import { DAY_IN_MILLISECONDS } from "../helpers/staticValues";
import * as AnimalService from "../services/animalService";
import * as AssetFacility from "../services/assetFacilityService";
import { createCustomerOrderForSeeding } from "../services/customerService";
import * as EnclosureService from "../services/enclosureService";
import * as SpeciesService from "../services/speciesService";
import * as ZooEventService from "../services/zooEventService";
import { AccessPoint } from "./AccessPoint";
import { Animal } from "./Animal";
import { AnimalActivity } from "./AnimalActivity";
import { AnimalActivityLog } from "./AnimalActivityLog";
import { AnimalClinic } from "./AnimalClinics";
import { AnimalFeed } from "./AnimalFeed";
import { AnimalFeedingLog } from "./AnimalFeedingLog";
import { AnimalObservationLog } from "./AnimalObservationLog";
import { AnimalWeight } from "./AnimalWeight";
import { Announcement } from "./Announcement";
import { Compatibility } from "./Compatibility";
import { Customer } from "./Customer";
import { CustomerOrder } from "./CustomerOrder";
import { CustomerReportLog } from "./CustomerReportLog";
import { Employee } from "./Employee";
import { Enclosure } from "./Enclosure";
import { EnclosureBarrier } from "./EnclosureBarrier";
import { EnrichmentItem } from "./EnrichmentItem";
import {
  AcquisitionMethod,
  ActivityType,
  AnimalFeedCategory,
  AnimalGrowthStage,
  AnimalSex,
  ConservationStatus,
  Continent,
  Country,
  DayOfWeek,
  EventTimingType,
  EventType,
  FacilityLogType,
  FacilityType,
  GeneralStaffType,
  GroupSexualDynamic,
  HubStatus,
  IdentifierType,
  KeeperType,
  ListingStatus,
  ListingType,
  OrderStatus,
  PaymentStatus,
  PlannerType,
  PresentationContainer,
  PresentationLocation,
  PresentationMethod,
  RecurringPattern,
  SensorType,
  Specialization,
} from "./Enumerated";
import { Facility } from "./Facility";
import { FacilityLog } from "./FacilityLog";
import { FeedingItem } from "./FeedingItem";
import { FeedingPlan } from "./FeedingPlan";
import { FeedingPlanSessionDetail } from "./FeedingPlanSessionDetail";
import { GeneralStaff } from "./GeneralStaff";
import { HubProcessor } from "./HubProcessor";
import { InHouse } from "./InHouse";
import { Itinerary } from "./Itinerary";
import { ItineraryItem } from "./ItineraryItem";
import { Keeper } from "./Keeper";
import { Listing } from "./Listing";
import { MaintenanceLog } from "./MaintenanceLog";
import { MedicalSupply } from "./MedicalSupply";
import { OrderItem } from "./OrderItem";
import { Payment } from "./Payment";
import { PhysiologicalReferenceNorms } from "./PhysiologicalReferenceNorms";
import { PlanningStaff } from "./PlanningStaff";
import { Plantation } from "./Plantation";
import { Promotion } from "./Promotion";
import { PublicEvent } from "./PublicEvent";
import { PublicEventSession } from "./PublicEventSession";
import { Sensor } from "./Sensor";
import { SensorReading } from "./SensorReading";
import { Species } from "./Species";
import { SpeciesDietNeed } from "./SpeciesDietNeed";
import { SpeciesEnclosureNeed } from "./SpeciesEnclosureNeed";
import { ThirdParty } from "./ThirdParty";
import { Zone } from "./Zone";
import { ZooEvent } from "./ZooEvent";

function addCascadeOptions(options: object) {
  return { ...options, onDelete: "CASCADE", onUpdate: "CASCADE" };
}

interface CustomerOrderTemplate {
  bookingReference: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  entryDate: Date;
  customerFirstName: string;
  customerLastName: string;
  customerContactNo: string;
  customerEmail: string;
  paymentStatus: PaymentStatus;
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

  Employee.hasMany(ZooEvent, addCascadeOptions({ foreignKey: "employeeId" }));
  ZooEvent.belongsTo(Employee, addCascadeOptions({ foreignKey: "employeeId" }));

  AnimalActivity.hasMany(
    ZooEvent,
    addCascadeOptions({ foreignKey: "animalActivityId" }),
  );
  ZooEvent.belongsTo(
    AnimalActivity,
    addCascadeOptions({ foreignKey: "animalActivityId" }),
  );

  Facility.hasMany(
    HubProcessor,
    addCascadeOptions({ foreignKey: "facilityId" }),
  );
  HubProcessor.belongsTo(
    Facility,
    addCascadeOptions({ foreignKey: "facilityId" }),
  );

  Zone.hasMany(Facility, addCascadeOptions({ foreignKey: "zoneId" }));
  Facility.belongsTo(Zone, addCascadeOptions({ foreignKey: "zoneId" }));

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

  // Facility.hasOne(Enclosure, addCascadeOptions({ foreignKey: "facilityId" }));
  // Enclosure.belongsTo(
  //   Facility,
  //   addCascadeOptions({ foreignKey: "facilityId" }),
  // );
  Facility.hasOne(Enclosure, {
    foreignKey: "facilityId",
    onDelete: "CASCADE",
  });

  Enclosure.belongsTo(Facility, {
    foreignKey: "facilityId",
    onDelete: "CASCADE",
  });

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

  FacilityLog.belongsToMany(GeneralStaff, {
    foreignKey: "facilityLogId",
    through: "repairTicket_staff",
    as: "generalStaffs",
  });

  GeneralStaff.belongsToMany(FacilityLog, {
    foreignKey: "generalStaffId",
    through: "repairTicket_staff",
    as: "facilityLogs",
  });

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
    through: "customerFavouriteSpecies",
    as: "customers",
  });
  Customer.belongsToMany(Species, {
    foreignKey: "customerId",
    through: "customerFavouriteSpecies",
    as: "species",
  });

  Employee.hasMany(ZooEvent, addCascadeOptions({ foreignKey: "employeeId" }));
  ZooEvent.belongsTo(Employee, addCascadeOptions({ foreignKey: "employeeId" }));

  Customer.hasMany(Itinerary, addCascadeOptions({ foreignKey: "customerId" }));
  Itinerary.belongsTo(
    Customer,
    addCascadeOptions({ foreignKey: "customerId" }),
  );

  Itinerary.belongsToMany(Species, {
    foreignKey: "itineraryId",
    through: "itinerary_species",
    as: "specieses",
  });

  Species.belongsToMany(Itinerary, {
    foreignKey: "speciesId",
    through: "itinerary_species",
    as: "itineraries",
  });

  Enclosure.belongsToMany(EnrichmentItem, {
    foreignKey: "enclosureId",
    through: "enclosure_enrichmentItem",
    as: "enrichmentItems",
  });
  EnrichmentItem.belongsToMany(Enclosure, {
    foreignKey: "enrichmentItemId",
    through: "enclosure_enrichmentItem",
    as: "enclosures",
  });

  Facility.hasMany(
    ItineraryItem,
    addCascadeOptions({ foreignKey: "facilityId" }),
  );
  ItineraryItem.belongsTo(
    Facility,
    addCascadeOptions({ foreignKey: "facilityId" }),
  );

  Itinerary.hasMany(
    ItineraryItem,
    addCascadeOptions({ foreignKey: "itineraryId" }),
  );

  ItineraryItem.belongsTo(
    Itinerary,
    addCascadeOptions({ foreignKey: "itineraryId" }),
  );

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

  Animal.belongsToMany(AnimalActivityLog, {
    foreignKey: "animalId",
    through: "animal_activityLog",
    as: "animalActivityLogs",
  });
  AnimalActivityLog.belongsToMany(Animal, {
    foreignKey: "animalActivityLogId",
    through: "animal_activityLog",
    as: "animals",
  });

  AnimalActivity.hasMany(AnimalActivityLog, addCascadeOptions({}));
  AnimalActivityLog.belongsTo(AnimalActivity);

  AnimalActivity.hasMany(AnimalObservationLog, addCascadeOptions({}));
  AnimalObservationLog.belongsTo(AnimalActivity);

  Animal.belongsToMany(AnimalFeedingLog, {
    foreignKey: "animalId",
    through: "animal_feedingLog",
    as: "animalFeedingLogs",
  });
  AnimalFeedingLog.belongsToMany(Animal, {
    foreignKey: "animalFeedingLogId",
    through: "animal_feedingLog",
    as: "animals",
  });

  // feeding plan
  Species.hasMany(FeedingPlan, { onDelete: "CASCADE" });
  FeedingPlan.belongsTo(Species);

  FeedingPlan.hasMany(AnimalFeedingLog, { onDelete: "CASCADE" });
  AnimalFeedingLog.belongsTo(FeedingPlan);

  FeedingPlan.hasMany(FeedingPlanSessionDetail, { onDelete: "CASCADE" });
  FeedingPlanSessionDetail.belongsTo(FeedingPlan);

  FeedingPlanSessionDetail.hasMany(FeedingItem, { onDelete: "CASCADE" });
  FeedingItem.belongsTo(FeedingPlanSessionDetail);

  FeedingPlanSessionDetail.hasMany(ZooEvent, { onDelete: "CASCADE" });
  ZooEvent.belongsTo(FeedingPlanSessionDetail);

  Animal.hasMany(FeedingItem, { onDelete: "CASCADE" });
  FeedingItem.belongsTo(Animal);

  // Animal.hasMany(FeedingPlan, { onDelete: "CASCADE" });
  // FeedingPlan.belongsTo(Animal);
  Animal.belongsToMany(FeedingPlan, {
    foreignKey: "animalId",
    through: "animal_feedingPlan",
    as: "feedingPlans",
  });
  FeedingPlan.belongsToMany(Animal, {
    foreignKey: "feedingPlanId",
    through: "animal_feedingPlan",
    as: "animals",
  });

  // ------------ End of Animal Relation --------------

  // ------------ Enclosure --------------

  // TerrainDistribution.hasMany(
  //   Enclosure,
  //   addCascadeOptions({ foreignKey: "terrainDistributionId" }),
  // );
  // Enclosure.belongsTo(
  //   TerrainDistribution,
  //   addCascadeOptions({ foreignKey: "terrainDistributionId" }),
  // );

  Enclosure.hasMany(Animal, addCascadeOptions({ foreignKey: "enclosureId" }));
  Animal.belongsTo(Enclosure, addCascadeOptions({ foreignKey: "enclosureId" }));

  // Enclosure.hasOne(
  //   BarrierType,
  //   addCascadeOptions({ foreignKey: "enclosureId" }),
  // );
  // BarrierType.belongsTo(
  //   Enclosure,
  //   addCascadeOptions({ foreignKey: "enclosureId" }),
  // );

  Enclosure.hasOne(
    EnclosureBarrier,
    addCascadeOptions({ foreignKey: "enclosureId" }),
  );
  EnclosureBarrier.belongsTo(
    Enclosure,
    addCascadeOptions({ foreignKey: "enclosureId" }),
  );

  Enclosure.belongsToMany(Plantation, {
    foreignKey: "enclosureId",
    through: "enclosure_plantation",
    as: "plantations",
  });

  Enclosure.belongsToMany(EnrichmentItem, {
    foreignKey: "enclosureId",
    through: "enclosure_enrichmentItem",
    as: "enclosureEnrichmentItems",
  });

  // Plantation.belongsToMany(Enclosure, {
  //   foreignKey: "plantationId",
  //   through: "enclosure_plantation",
  //   as: "enclosures",
  // });

  Enclosure.belongsToMany(AccessPoint, {
    foreignKey: "enclosureId",
    through: "enclosure_accessPoint",
    as: "accessPoints",
  });
  AccessPoint.belongsToMany(Enclosure, {
    foreignKey: "accessPointId",
    through: "enclosure_accessPoint",
    as: "enclosures",
  });

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
  AnimalObservationLog.belongsTo(Keeper, { foreignKey: "keeperId" });

  Keeper.hasMany(AnimalActivityLog, { foreignKey: "keeperId" });
  AnimalActivityLog.belongsTo(Keeper, { foreignKey: "keeperId" });

  Keeper.hasMany(AnimalFeedingLog, { foreignKey: "keeperId" });
  AnimalFeedingLog.belongsTo(Keeper, { foreignKey: "keeperId" });

  Keeper.belongsToMany(Enclosure, {
    foreignKey: "keeperId",
    through: "keeper_enclosure",
    as: "enclosures",
  });
  Enclosure.belongsToMany(Keeper, {
    foreignKey: "enclosureId",
    through: "keeper_enclosure",
    as: "keepers",
  });

  Enclosure.hasMany(ZooEvent, addCascadeOptions({ foreignKey: "enclosureId" }));
  ZooEvent.belongsTo(
    Enclosure,
    addCascadeOptions({ foreignKey: "enclosureId" }),
  );

  Animal.belongsToMany(ZooEvent, {
    foreignKey: "animalId",
    through: "animal_zooEvent",
    as: "zooEvents",
  });
  ZooEvent.belongsToMany(Animal, {
    foreignKey: "zooEventId",
    through: "animal_zooEvent",
    as: "animals",
  });

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

  PublicEvent.belongsToMany(Animal, {
    foreignKey: "publicEventId",
    through: "animal_publicEvent",
    as: "animals",
  });
  Animal.belongsToMany(PublicEvent, {
    foreignKey: "animalId",
    through: "animal_publicEvent",
    as: "publicEvents",
  });

  PublicEvent.belongsToMany(Keeper, {
    foreignKey: "publicEventId",
    through: "keeper_publicEvent",
    as: "keepers",
  });
  Keeper.belongsToMany(PublicEvent, {
    foreignKey: "keeperId",
    through: "keeper_publicEvent",
    as: "publicEvents",
  });

  InHouse.hasMany(PublicEvent, addCascadeOptions({ foreignKey: "inHouseId" }));
  PublicEvent.belongsTo(
    InHouse,
    addCascadeOptions({ foreignKey: "inHouseId" }),
  );

  PublicEvent.belongsToMany(Customer, {
    foreignKey: "publicEventId",
    through: "customer_publicEvent",
    as: "customers",
  });
  Customer.belongsToMany(PublicEvent, {
    foreignKey: "customerId",
    through: "customer_publicEvent",
    as: "publicEvents",
  });

  PublicEvent.hasMany(PublicEventSession, { foreignKey: "publicEventId" });
  PublicEventSession.belongsTo(PublicEvent, { foreignKey: "publicEventId" });

  PublicEventSession.hasMany(ZooEvent, { foreignKey: "publicEventSessionId" });
  ZooEvent.belongsTo(PublicEventSession, {
    foreignKey: "publicEventSessionId",
  });

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
  try {
    await employeeSeed();
    await animalFeedSeed();
    await enrichmentItemSeed();
    await facilityAssetsSeed();
    await speciesSeed();
    await animalSeed();
    await enclosureSeed();
    await promotionSeed();
    await customerSeed();
    await publicEventSeed();
    await announcementSeed();
    await favouriteSeed();
    await enclosureKeeperSeed();
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

export const favouriteSeed = async () => {
  let speciesData = await Species.findAll();

  let customer = await Customer.findAll();

  customer[0].addSpecies(speciesData[0]);
  customer[0].addSpecies(speciesData[1]);

  customer[1].addSpecies(speciesData[0]);
  customer[1].addSpecies(speciesData[3]);

  customer[2].addSpecies(speciesData[0]);
  customer[2].addSpecies(speciesData[1]);
  customer[2].addSpecies(speciesData[3]);

  customer[3].addSpecies(speciesData[0]);
  customer[3].addSpecies(speciesData[1]);
  customer[3].addSpecies(speciesData[3]);

  customer[4].addSpecies(speciesData[0]);
  customer[4].addSpecies(speciesData[2]);
  customer[4].addSpecies(speciesData[5]);

  customer[5].addSpecies(speciesData[0]);
  customer[5].addSpecies(speciesData[1]);

  customer[6].addSpecies(speciesData[0]);
  customer[6].addSpecies(speciesData[5]);

  customer[7].addSpecies(speciesData[0]);
  customer[7].addSpecies(speciesData[6]);
  customer[7].addSpecies(speciesData[7]);
};

export const promotionSeed = async () => {
  let promotion1 = await Promotion.create({
    title: "Happy Birthday Merlion Zoo",
    description:
      "Enjoy 30% off admission tickets and come join us in our 30th birthday celebration! \n\n Terms and conditions: \nValid for minimum purchase of S$100 \n Valid for purchase date from 1 October 2023 to 31 October 2023",
    publishDate: new Date("2023-09-15"),
    startDate: new Date("2023-10-01"),
    endDate: new Date("2024-10-31"),
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
    endDate: new Date("2024-10-11"),
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
    endDate: new Date("2024-10-21"),
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
    startDate: new Date("2020-07-20"),
    endDate: new Date("2024-08-20"),
    percentage: 20,
    minimumSpending: 200,
    promotionCode: "BYECOVID",
    maxRedeemNum: 1000,
    currentRedeemNum: 1000,
    imageUrl: "img/promotion/elephant.jpg",
  });
};

export const announcementSeed = async () => {
  let announcement1 = await Announcement.create({
    title: "Habitat Renovation Underway",
    content:
      "Our habitat renovation will be in progress from November 1, 2023, to January 31, 2024. During this time, certain areas may be temporarily closed as we enhance our animals' living spaces.",
    isPublished: true,
    scheduledStartPublish: new Date("2023-10-10"),
    scheduledEndPublish: new Date("2024-01-31"),
  });

  let announcement2 = await Announcement.create({
    title: "Temporary Closure of 'African Savannah' Exhibit",
    content:
      "The 'African Savannah' exhibit will be temporarily closed for maintenance and improvements from December 15, 2023, to January 15, 2024.",
    isPublished: true,
    scheduledStartPublish: new Date("2023-12-01"),
    scheduledEndPublish: new Date("2024-01-15"),
  });

  let announcement3 = await Announcement.create({
    title: "Walkway Repairs in Progress",
    content:
      "We are currently repairing and upgrading certain walkways throughout the zoo. These improvements are scheduled from November 1, 2023, to November 5, 2023. We apologize for any inconvenience during this period.",
    isPublished: true,
    scheduledStartPublish: new Date("2023-10-01"),
    scheduledEndPublish: new Date("2023-11-05"),
  });

  let announcement4 = await Announcement.create({
    title: "Test Announcement",
    content: "This is a test announcement. Do not publish.",
    isPublished: false,
    scheduledStartPublish: new Date("2023-10-10"),
    scheduledEndPublish: new Date("2023-11-31"),
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

  let customer4 = await Customer.create({
    firstName: "customer4",
    lastName: "gogo",
    email: "customer4@gmail.com",
    contactNo: "12345568",
    birthday: new Date("2001-01-01"),
    nationality: Country.Indonesia,
    passwordHash: Customer.getHash("Hahaha123.", "hehe"),
    salt: "hehe",
  });

  let customer5 = await Customer.create({
    firstName: "customer5",
    lastName: "gogo",
    email: "customer5@gmail.com",
    contactNo: "12345568",
    birthday: new Date("2001-01-01"),
    nationality: Country.Indonesia,
    passwordHash: Customer.getHash("Hahaha123.", "hehe"),
    salt: "hehe",
  });

  let customer6 = await Customer.create({
    firstName: "customer6",
    lastName: "gogo",
    email: "customer6@gmail.com",
    contactNo: "12345568",
    birthday: new Date("2001-01-01"),
    nationality: Country.Indonesia,
    passwordHash: Customer.getHash("Hahaha123.", "hehe"),
    salt: "hehe",
  });

  let customer7 = await Customer.create({
    firstName: "customer7",
    lastName: "gogo",
    email: "customer7@gmail.com",
    contactNo: "12345568",
    birthday: new Date("2001-01-01"),
    nationality: Country.Indonesia,
    passwordHash: Customer.getHash("Hahaha123.", "hehe"),
    salt: "hehe",
  });

  let customer8 = await Customer.create({
    firstName: "customer8",
    lastName: "gogo",
    email: "customer8@gmail.com",
    contactNo: "12345568",
    birthday: new Date("2001-01-01"),
    nationality: Country.Indonesia,
    passwordHash: Customer.getHash("Hahaha123.", "hehe"),
    salt: "hehe",
  });

  let customer9 = await Customer.create({
    firstName: "customer9",
    lastName: "gogo",
    email: "customer9@gmail.com",
    contactNo: "12345568",
    birthday: new Date("2001-01-01"),
    nationality: Country.Indonesia,
    passwordHash: Customer.getHash("Hahaha123.", "hehe"),
    salt: "hehe",
  });

  let customer10 = await Customer.create({
    firstName: "customer10",
    lastName: "gogo",
    email: "customer10@gmail.com",
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

  let marryKeeper = await Keeper.create({
    keeperType: KeeperType.SENIOR_KEEPER,
    specialization: Specialization.AMPHIBIAN,
    isDisabled: false,
  });

  await marryKeeper.setEmployee(marry);
  await marry.setKeeper(marryKeeper);

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
      {
        employeeName: "keeper4",
        employeeAddress: "Singapore Kent Ridge LT16",
        employeeEmail: "keeper4@gmail.com",
        employeePhoneNumber: "9134",
        employeePasswordHash: Employee.getHash("keeper4_password", "NaH"),
        employeeSalt: "NaH",
        employeeDoorAccessCode: "345578",
        employeeEducation: "PHD in not existing",
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
        employeeName: "keeper5",
        employeeAddress: "Singapore Kent Ridge LT16",
        employeeEmail: "keeper5@gmail.com",
        employeePhoneNumber: "9131",
        employeePasswordHash: Employee.getHash("keeper5_password", "NaH"),
        employeeSalt: "NaH",
        employeeDoorAccessCode: "445678",
        employeeEducation: "PHD in not existing",
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
        employeeName: "keeper6",
        employeeAddress: "Singapore Kent Ridge LT16",
        employeeEmail: "keeper6@gmail.com",
        employeePhoneNumber: "9133",
        employeePasswordHash: Employee.getHash("keeper6_password", "NaH"),
        employeeSalt: "NaH",
        employeeDoorAccessCode: "349678",
        employeeEducation: "PHD in not existing",
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
        employeeName: "keeper7",
        employeeAddress: "Singapore Kent Ridge LT16",
        employeeEmail: "keeper7@gmail.com",
        employeePhoneNumber: "9123",
        employeePasswordHash: Employee.getHash("keeper7_password", "NaH"),
        employeeSalt: "NaH",
        employeeDoorAccessCode: "349698",
        employeeEducation: "PHD in not existing",
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

  // console.log("-------------EMPLOYEES--------------------");
  // (await Employee.findAll()).forEach((a) => console.log(a.toJSON()));
  // console.log("-------------KEEPERS--------------------");
  // (await Keeper.findAll()).forEach((a) => console.log(a.toJSON()));

  const johnKeeper = await minions[0].getKeeper();
  const bobKeeper = await minions[1].getKeeper();

  const senior = await Keeper.findOne({
    where: { keeperType: KeeperType.SENIOR_KEEPER },
  });
  // console.log("senior", senior?.get());

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
  // console.log(planner1.toJSON());
  // console.log((await planner1.getPlanningStaff()).toJSON());

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
  // console.log((await manager.getGeneralStaff()).toJSON());
  manager.employeeName = "manager_new_name";
  await manager.save();
  // console.log(manager.toJSON());

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
    listingType: ListingType.LOCAL,
    listingStatus: ListingStatus.ACTIVE,
  });

  let listing2 = await Listing.create({
    name: "Student",
    description: "Listing for local student (including university student)",
    price: 15,
    listingType: ListingType.LOCAL,
    listingStatus: ListingStatus.ACTIVE,
  });

  let listing3 = await Listing.create({
    name: "Child",
    description: "Listing for local child (aged <= 12 years old)",
    price: 15,
    listingType: ListingType.LOCAL,
    listingStatus: ListingStatus.ACTIVE,
  });

  let listing4 = await Listing.create({
    name: "Senior",
    description: "Listing for local senior (aged >= 65 years old)",
    price: 10,
    listingType: ListingType.LOCAL,
    listingStatus: ListingStatus.ACTIVE,
  });

  let listing5 = await Listing.create({
    name: "Adult",
    description: "Listing for foreigner adult",
    price: 30,
    listingType: ListingType.FOREIGNER,
    listingStatus: ListingStatus.ACTIVE,
  });

  let listing6 = await Listing.create({
    name: "Child",
    description: "Listing for foreigner child",
    price: 30,
    listingType: ListingType.FOREIGNER,
    listingStatus: ListingStatus.ACTIVE,
  });

  let bookingRef = uuidv4().substring(0, 8).toUpperCase();
  let date = new Date(new Date().setMonth(new Date().getMonth()));
  date.setHours(0, 0, 0);

  let order1 = await CustomerOrder.create({
    bookingReference: bookingRef,
    totalAmount: 295,
    orderStatus: OrderStatus.ACTIVE,
    entryDate: date,
    customerFirstName: "Admin",
    customerLastName: "Seeding",
    customerContactNo: "12345678",
    customerEmail: "zoovannaserver@gmail.com",
    paymentStatus: PaymentStatus.COMPLETED,
    pdfUrl: "",
  });

  let listings1: Listing[] = [
    listing1,
    listing1,
    listing2,
    listing3,
    listing3,
    listing4,
    listing5,
    listing5,
    listing5,
    listing5,
    listing6,
    listing6,
  ];

  await createCustomerOrderForSeeding(listings1, order1);

  let bookingRef2 = uuidv4().substring(0, 8).toUpperCase();
  let date2 = new Date(new Date().setMonth(new Date().getMonth() - 1));
  date2.setHours(0, 0, 0);

  let order2 = await CustomerOrder.create({
    bookingReference: bookingRef2,
    totalAmount: 345,
    orderStatus: OrderStatus.ACTIVE,
    entryDate: date2,
    customerFirstName: "Admin",
    customerLastName: "Seeding",
    customerContactNo: "12345678",
    customerEmail: "zoovannaserver@gmail.com",
    paymentStatus: PaymentStatus.COMPLETED,
    pdfUrl: "",
  });

  let listings2: Listing[] = [
    listing1,
    listing2,
    listing2,
    listing3,
    listing3,
    listing3,
    listing4,
    listing5,
    listing5,
    listing5,
    listing5,
    listing6,
    listing6,
    listing6,
    listing6,
  ];

  await createCustomerOrderForSeeding(listings2, order2);

  let bookingRef3 = uuidv4().substring(0, 8).toUpperCase();
  let date3 = new Date(new Date().setMonth(new Date().getMonth() - 3));
  date3.setHours(0, 0, 0);

  let order3 = await CustomerOrder.create({
    bookingReference: bookingRef3,
    totalAmount: 165,
    orderStatus: OrderStatus.ACTIVE,
    entryDate: date3,
    customerFirstName: "Admin",
    customerLastName: "Seeding",
    customerContactNo: "12345678",
    customerEmail: "zoovannaserver@gmail.com",
    paymentStatus: PaymentStatus.COMPLETED,
    pdfUrl: "",
  });

  let listings3: Listing[] = [
    listing1,
    listing2,
    listing3,
    listing3,
    listing4,
    listing5,
    listing6,
    listing6,
  ];

  await createCustomerOrderForSeeding(listings3, order3);

  let bookingRef4 = uuidv4().substring(0, 8).toUpperCase();
  let date4 = new Date(new Date().setMonth(new Date().getMonth() - 2));
  date4.setHours(0, 0, 0);

  let order4 = await CustomerOrder.create({
    bookingReference: bookingRef4,
    totalAmount: 195,
    orderStatus: OrderStatus.ACTIVE,
    entryDate: date4,
    customerFirstName: "Admin",
    customerLastName: "Seeding",
    customerContactNo: "12345678",
    customerEmail: "zoovannaserver@gmail.com",
    paymentStatus: PaymentStatus.COMPLETED,
    pdfUrl: "",
  });

  let listings4: Listing[] = [
    listing1,
    listing2,
    listing2,
    listing2,
    listing3,
    listing4,
    listing5,
    listing6,
  ];

  await createCustomerOrderForSeeding(listings4, order4);

  let bookingRef5 = uuidv4().substring(0, 8).toUpperCase();
  let date5 = new Date(new Date().setMonth(new Date().getMonth() + 1));
  date5.setHours(0, 0, 0);

  let order5 = await CustomerOrder.create({
    bookingReference: bookingRef5,
    totalAmount: 175,
    orderStatus: OrderStatus.ACTIVE,
    entryDate: date5,
    customerFirstName: "Admin",
    customerLastName: "Seeding",
    customerContactNo: "12345678",
    customerEmail: "zoovannaserver@gmail.com",
    paymentStatus: PaymentStatus.COMPLETED,
    pdfUrl: "",
  });

  let listings5: Listing[] = [
    listing1,
    listing2,
    listing2,
    listing3,
    listing4,
    listing4,
    listing5,
    listing6,
    listing6,
  ];

  await createCustomerOrderForSeeding(listings5, order5);
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
  // console.log(panda.toJSON());

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
  // console.log(pandaEnclosure.toJSON());

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
  // console.log(pandaPhy1.toJSON());

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
    35,
    AnimalGrowthStage.ELDER,
  );

  // let pandaPhy6 = await SpeciesService.createPhysiologicalReferenceNorms(
  //   "SPE001",
  //   165,
  //   195,
  //   115,
  //   185,
  //   80,
  //   115,
  //   75,
  //   105,
  //   29,
  //   35,
  //   AnimalGrowthStage.ELDER,
  // );

  let pandaDietNeed1 = await SpeciesService.createDietNeed(
    "SPE001",
    AnimalFeedCategory.BROWSE,
    10000, // per meal male (g)
    9000, // per meal female (g)
    140000, // per weak male (g)
    120000, // per week female (g)
    PresentationContainer.SILICONE_DISH,
    PresentationMethod.CHOPPED,
    PresentationLocation.IN_CONTAINER,
    AnimalGrowthStage.ADULT,
  );
  // console.log(pandaDietNeed1.toJSON());

  let pandaDietNeed2 = await SpeciesService.createDietNeed(
    "SPE001",
    AnimalFeedCategory.BROWSE,
    9000, // per meal male (g)
    8000, // per meal female (g)
    130000, // per weak male (g)
    110000, // per week female (g)
    PresentationContainer.SILICONE_DISH,
    PresentationMethod.DICED,
    PresentationLocation.IN_CONTAINER,
    AnimalGrowthStage.ELDER,
  );
  // console.log(pandaDietNeed2.toJSON());

  let pandaDietNeed3 = await SpeciesService.createDietNeed(
    "SPE001",
    AnimalFeedCategory.VEGETABLES,
    6000, // per meal male (g)
    4000, // per meal female (g)
    12000, // per weak male (g)
    8000, // per week female (g)
    PresentationContainer.HANGING_FEEDERS,
    PresentationMethod.MASHED,
    PresentationLocation.IN_CONTAINER,
    AnimalGrowthStage.ADULT,
  );
  // console.log(pandaDietNeed3.toJSON());

  let pandaDietNeed4 = await SpeciesService.createDietNeed(
    "SPE001",
    AnimalFeedCategory.VEGETABLES,
    6000, // per meal male (g)
    4000, // per meal female (g)
    12000, // per weak male (g)
    8000, // per week female (g)
    PresentationContainer.HANGING_FEEDERS,
    PresentationMethod.MASHED,
    PresentationLocation.IN_CONTAINER,
    AnimalGrowthStage.ELDER,
  );
  // console.log(pandaDietNeed4.toJSON());

  let pandaDietNeed5 = await SpeciesService.createDietNeed(
    "SPE001",
    AnimalFeedCategory.FRUITS,
    300, // per meal male (g)
    300, // per meal female (g)
    2000, // per weak male (g)
    1500, // per week female (g)
    PresentationContainer.HANGING_FEEDERS,
    PresentationMethod.MASHED,
    PresentationLocation.IN_CONTAINER,
    AnimalGrowthStage.ADULT,
  );
  console.log(pandaDietNeed5.toJSON());

  let pandaDietNeed6 = await SpeciesService.createDietNeed(
    "SPE001",
    AnimalFeedCategory.FRUITS,
    300, // per meal male (g)
    300, // per meal female (g)
    2000, // per weak male (g)
    1500, // per week female (g)
    PresentationContainer.HANGING_FEEDERS,
    PresentationMethod.MASHED,
    PresentationLocation.IN_CONTAINER,
    AnimalGrowthStage.ELDER,
  );
  console.log(pandaDietNeed6.toJSON());

  let pandaDietNeed7 = await SpeciesService.createDietNeed(
    "SPE001",
    AnimalFeedCategory.BROWSE,
    2000, // per meal male (g)
    1800, // per meal female (g)
    25000, // per weak male (g)
    23000, // per week female (g)
    PresentationContainer.SILICONE_DISH,
    PresentationMethod.CHOPPED,
    PresentationLocation.IN_CONTAINER,
    AnimalGrowthStage.JUVENILE,
  );
  console.log(pandaDietNeed7.toJSON());

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

  let lionTemplate = {
    speciesCode: await Species.getNextSpeciesCode(),
    commonName: "Lion",
    scientificName: "Panthera leo",
    aliasName: "King of the Jungle",
    conservationStatus: ConservationStatus.VULNERABLE,
    domain: "Eukarya",
    kingdom: "Animalia",
    phylum: "Chordata",
    speciesClass: "Mammalia",
    order: "Carnivora",
    family: "Felidae",
    genus: "Panthera",
    educationalDescription:
      "The Lion, also known as the King of the Jungle, is a large carnivorous mammal belonging to the family Felidae. Lions are iconic for their majestic mane and social behavior in prides.",
    educationalFunFact:
      "Lions are the only truly social cats, forming prides that consist of related females and their offspring, led by a dominant male.",
    nativeContinent: Continent.AFRICA,
    nativeBiomes: "Savannas, Grasslands",
    groupSexualDynamic: GroupSexualDynamic.POLYGYNOUS,
    habitatOrExhibit: "Savannas, Grasslands",
    generalDietPreference: "Carnivore",
    imageUrl: "img/species/lion.jpg",
    lifeExpectancyYears: 15,
    ageToJuvenile: 2,
    ageToAdolescent: 3,
    ageToAdult: 4,
    ageToElder: 12,
    // foodRemark: "Food remark...",
  } as any;
  let lion = await Species.create(lionTemplate);
  console.log(lion.toJSON());

  let penguinTemplate = {
    speciesCode: await Species.getNextSpeciesCode(),
    commonName: "Penguin",
    scientificName: "Spheniscidae",
    aliasName: "Flippered Birds",
    conservationStatus: ConservationStatus.NEAR_THREATENED,
    domain: "Eukarya",
    kingdom: "Animalia",
    phylum: "Chordata",
    speciesClass: "Aves",
    order: "Sphenisciformes",
    family: "Spheniscidae",
    genus: "Spheniscus",
    educationalDescription:
      "The Penguin, also known as Flippered Birds, is a group of flightless birds belonging to the family Spheniscidae. Penguins are well-adapted to aquatic life and are excellent swimmers.",
    educationalFunFact:
      "Penguins are skilled swimmers, using their flippers for propulsion and their feet for steering while hunting for fish in the ocean.",
    nativeContinent: Continent.NORTH_AMERICA,
    nativeBiomes: "Coastal Areas, Ice Floes",
    groupSexualDynamic: GroupSexualDynamic.MONOGAMOUS,
    habitatOrExhibit: "Coastal Areas, Ice Floes",
    generalDietPreference: "Carnivore (Fish)",
    imageUrl: "img/species/penguin.jpeg",
    lifeExpectancyYears: 20,
    ageToJuvenile: 1,
    ageToAdolescent: 2,
    ageToAdult: 3,
    ageToElder: 15,
    // foodRemark: "Food remark...",
  } as any;
  let penguin = await Species.create(penguinTemplate);
  console.log(penguin.toJSON());

  let orangutanTemplate = {
    speciesCode: await Species.getNextSpeciesCode(),
    commonName: "Orangutan",
    scientificName: "Pongo",
    aliasName: "Red Ape",
    conservationStatus: ConservationStatus.CRITICALLY_ENDANGERED,
    domain: "Eukarya",
    kingdom: "Animalia",
    phylum: "Chordata",
    speciesClass: "Mammalia",
    order: "Primates",
    family: "Hominidae",
    genus: "Pongo",
    educationalDescription:
      "The Orangutan, also known as the Red Ape, is a large arboreal mammal belonging to the family Hominidae. Orangutans are known for their distinctive reddish-brown fur and remarkable intelligence.",
    educationalFunFact:
      "Orangutans are highly intelligent and share about 97% of their DNA with humans, making them one of our closest living relatives.",
    nativeContinent: Continent.ASIA,
    nativeBiomes: "Tropical Rainforests",
    groupSexualDynamic: GroupSexualDynamic.MONOGAMOUS,
    habitatOrExhibit: "Tropical Rainforests",
    generalDietPreference: "Frugivore",
    imageUrl: "img/species/orangutan.jpg",
    lifeExpectancyYears: 40,
    ageToJuvenile: 3,
    ageToAdolescent: 6,
    ageToAdult: 10,
    ageToElder: 30,
    // foodRemark: "Food remark...",
  } as any;
  let orangutan = await Species.create(orangutanTemplate);
  console.log(orangutan.toJSON());

  let giraffeTemplate = {
    speciesCode: await Species.getNextSpeciesCode(),
    commonName: "Giraffe",
    scientificName: "Giraffa camelopardalis",
    aliasName: "Tallest Mammal",
    conservationStatus: ConservationStatus.VULNERABLE,
    domain: "Eukarya",
    kingdom: "Animalia",
    phylum: "Chordata",
    speciesClass: "Mammalia",
    order: "Artiodactyla",
    family: "Giraffidae",
    genus: "Giraffa",
    educationalDescription:
      "The Giraffe, also known as the Tallest Mammal, is an iconic, long-necked herbivorous mammal belonging to the family Giraffidae. Giraffes are known for their distinctive spotted coat patterns.",
    educationalFunFact:
      "Giraffes have extremely long necks, allowing them to reach leaves high in the trees. Despite their height, they have only seven neck vertebrae, the same as most mammals.",
    nativeContinent: Continent.AFRICA,
    nativeBiomes: "Savannas, Grasslands",
    groupSexualDynamic: GroupSexualDynamic.POLYGYNOUS,
    habitatOrExhibit: "Savannas, Grasslands",
    generalDietPreference: "Herbivore",
    imageUrl: "img/species/giraffe.jpg",
    lifeExpectancyYears: 25,
    ageToJuvenile: 2,
    ageToAdolescent: 4,
    ageToAdult: 6,
    ageToElder: 20,
    // foodRemark: "Food remark...",
  } as any;
  let giraffe = await Species.create(giraffeTemplate);
  console.log(giraffe.toJSON());

  let giraffeEnclosureNeeds = await SpeciesService.createEnclosureNeeds(
    "SPE009",
    10,
    300,
    10,
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

  let compatibility4 = await SpeciesService.createCompatibility(
    "SPE002",
    "SPE009",
  );
  console.log(compatibility4.toJSON());
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
    "RELEASED",
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
    "RELEASED",
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
    "RELEASED",
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
    "RELEASED",
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
    "RELEASED",
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
    "RELEASED",
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
    "RELEASED",
    "img/animal/ANM00012.jpg",
  );

  let elephant1Template = await AnimalService.createNewAnimal(
    "SPE004",
    false,
    "Harvey",
    AnimalSex.MALE,
    new Date("2000-03-04"),
    "Singapore",
    IdentifierType.RFID_TAG,
    "25467392",
    AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
    new Date("2000-03-04"),
    "N.A.",
    "Small ears, bruise on knee",
    "Active, friendly",
    null,
    null,
    null,
    "SICK,INJURED",
    "img/animal/elephantHarvey.jpg",
  );

  let elephant2Template = await AnimalService.createNewAnimal(
    "SPE004",
    false,
    "Dumbo",
    AnimalSex.FEMALE,
    new Date("2013-06-04"),
    "Singapore",
    IdentifierType.RFID_TAG,
    "34567824",
    AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
    new Date("2013-06-04"),
    "N.A.",
    "Big ears, bruise on back",
    "Docile",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/elephantDumbo.jpg",
  );

  let redPanda1Template = await AnimalService.createNewAnimal(
    "SPE003",
    false,
    "Ruby",
    AnimalSex.FEMALE,
    new Date("2013-06-04"),
    "Singapore",
    IdentifierType.RFID_TAG,
    "343263467",
    AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
    new Date("2015-06-04"),
    "N.A.",
    "Big ears, bruise on back",
    "Docile",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/redPandaRuby.jpg",
  );

  let capybara1Template = await AnimalService.createNewAnimal(
    "SPE002",
    false,
    "Peanut",
    AnimalSex.FEMALE,
    new Date("2020-06-04"),
    "Singapore",
    IdentifierType.RFID_TAG,
    "265443",
    AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
    new Date("2015-06-04"),
    "N.A.",
    "Cute",
    "Docile",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/capybaraPeanut.jpg",
  );

  let lion1Template = await AnimalService.createNewAnimal(
    "SPE006",
    false,
    "Simba",
    AnimalSex.MALE,
    new Date("2018-05-12"),
    "African Savanna",
    IdentifierType.RFID_TAG,
    "874512",
    AcquisitionMethod.FROM_THE_WILD,
    new Date("2018-05-01"),
    "N.A.",
    "Distinctive golden mane with darker tufts.",
    "Majestic, confident",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/lionSimba.webp",
  );

  let lion2Template = await AnimalService.createNewAnimal(
    "SPE006",
    false,
    "Nala",
    AnimalSex.FEMALE,
    new Date("2019-02-28"),
    "African Savanna",
    IdentifierType.RFID_TAG,
    "965478",
    AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
    new Date("2019-02-15"),
    "N.A.",
    "Unique pattern of spots on the hind legs.",
    "Graceful, Social",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/lionNala.jpg",
  );

  let penguin1Template = await AnimalService.createNewAnimal(
    "SPE007",
    false,
    "Chilly",
    AnimalSex.MALE,
    new Date("2017-11-20"),
    "Antarctic Habitat",
    IdentifierType.RFID_TAG,
    "745896",
    AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
    new Date("2017-11-10"),
    "N.A.",
    "Prominent heart-shaped pattern on the chest.",
    "Adorable, Curious",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/penguinChilly.jpeg",
  );

  let penguin2Template = await AnimalService.createNewAnimal(
    "SPE007",
    false,
    "Icy",
    AnimalSex.FEMALE,
    new Date("2018-04-15"),
    "Antarctic Habitat",
    IdentifierType.RFID_TAG,
    "632541",
    AcquisitionMethod.FROM_THE_WILD,
    new Date("2018-04-01"),
    "N.A.",
    "Distinctive black and white plumage with a yellow-orange patch on the neck.",
    "Graceful, Playful",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/penguinIcy.jpg",
  );

  let orangutan1Template = await AnimalService.createNewAnimal(
    "SPE008",
    false,
    "Cheeky",
    AnimalSex.MALE,
    new Date("2016-08-10"),
    "Borneo Rainforest",
    IdentifierType.RFID_TAG,
    "524789",
    AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
    new Date("2016-08-01"),
    "N.A.",
    "Prominent cheek pads and long, strong arms.",
    "Playful, Intelligent",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/orangutanCheeky.jpg",
  );

  let orangutan2Template = await AnimalService.createNewAnimal(
    "SPE008",
    false,
    "Cherrie",
    AnimalSex.FEMALE,
    new Date("2017-02-25"),
    "Borneo Rainforest",
    IdentifierType.RFID_TAG,
    "789654",
    AcquisitionMethod.FROM_THE_WILD,
    new Date("2017-02-15"),
    "N.A.",
    "Notable facial features, including expressive eyes.",
    "Gentle, Caring",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/orangutanCherrie.jpg",
  );

  let giraffe1Template = await AnimalService.createNewAnimal(
    "SPE009",
    false,
    "Longneck",
    AnimalSex.MALE,
    new Date("2015-12-05"),
    "African Savanna",
    IdentifierType.RFID_TAG,
    "369874",
    AcquisitionMethod.FROM_THE_WILD,
    new Date("2015-12-01"),
    "N.A.",
    "Towering height with a distinct spotted coat pattern.",
    "Graceful, Majestic",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/giraffeLongneck.jpg",
  );

  let giraffe2Template = await AnimalService.createNewAnimal(
    "SPE009",
    false,
    "Spots",
    AnimalSex.FEMALE,
    new Date("2016-07-20"),
    "African Savanna",
    IdentifierType.RFID_TAG,
    "258963",
    AcquisitionMethod.INHOUSE_CAPTIVE_BRED,
    new Date("2016-07-01"),
    "N.A.",
    "Identifiable by a heart-shaped spot on the left side.",
    "Elegant, Sociable",
    null,
    null,
    null,
    "NORMAL",
    "img/animal/giraffeSpots.jpg",
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
    new Date("2023-10-27"), // startDate
    new Date("2023-10-27"), // endDate, same as startDate if NON_RECURRING
    RecurringPattern.NON_RECURRING, // Recurring Pattern
    null, // day of week, only not null when recurringPattern is WEEKLY
    null, // day of month, only not null when recurringPattern is MONTHLY
    EventTimingType.AFTERNOON, // event timing type
    45, // duration in minutes
    1, // required number of keepers
  );

  let animalActivity2 = await AnimalService.createAnimalActivity(
    ActivityType.TRAINING,
    "Target Training",
    "Use a target stick to teach pandas to touch a designated spot. This aids in directing their movement and helps with medical check-ups.",
    new Date("2023-10-28"),
    new Date("2023-10-28"),
    RecurringPattern.NON_RECURRING,
    null,
    null,
    EventTimingType.MORNING,
    60,
    1,
  );

  let animalActivity3 = await AnimalService.createAnimalActivity(
    ActivityType.ENRICHMENT,
    "Food Foraging",
    "Hide food in puzzle feeders and under objects around the enclosure. Involved animals will have to manipulate devices, use their claws or other features to extract food, thus engages their foraging skills",
    new Date("2023-10-16"),
    new Date("2023-10-16"),
    RecurringPattern.NON_RECURRING,
    null,
    null,
    EventTimingType.MORNING,
    60,
    1,
  );
  let animalActivity4 = await AnimalService.createAnimalActivity(
    ActivityType.ENRICHMENT,
    "Enrichment Activity 02",
    "Text...",
    new Date("2023-10-16"),
    new Date("2024-05-18"),
    RecurringPattern.MONTHLY,
    null,
    7,
    EventTimingType.MORNING,
    60,
    1,
  );
  let animalActivity5 = await AnimalService.createAnimalActivity(
    ActivityType.TRAINING,
    "Jumping For Food",
    "Involved animals are trained to jump to reach for treats from trainers' hands.",
    new Date("2023-10-18"),
    new Date("2023-11-18"),
    RecurringPattern.WEEKLY,
    DayOfWeek.FRIDAY,
    null,
    EventTimingType.AFTERNOON,
    60,
    1,
  );
  // let animalActivity6 = await AnimalService.createAnimalActivity(
  //   ActivityType.TRAINING,
  //   "Training Activity 02",
  //   "Text...",
  //   new Date("2023-10-18"),
  //   new Date("2023-11-18"),
  //   RecurringPattern.DAILY,
  //   null,
  //   null,
  //   EventTimingType.EVENING,
  //   60,
  //   1
  // );

  let animalActivity6 = await AnimalService.createAnimalActivity(
    ActivityType.OBSERVATION,
    "Behaviour Observation",
    "Keepers will observe the involved animals to monitor their health, learn more about their habits and dynamics, and ",
    new Date("2023-10-18"),
    new Date("2023-11-18"),
    RecurringPattern.DAILY,
    null,
    null,
    EventTimingType.AFTERNOON,
    60,
    1,
  );
  let animalActivity7 = await AnimalService.createAnimalActivity(
    ActivityType.OBSERVATION,
    "Pang Pang fat panda observation",
    "Watch how pang pang eat 10kg of feed per minute",
    new Date("2023-10-18"),
    new Date("2023-11-18"),
    RecurringPattern.DAILY,
    null,
    null,
    EventTimingType.EVENING,
    60,
    1,
  );

  // animalActivityId, animalCodes
  await AnimalService.assignAnimalsToActivity(1, ["ANM00001", "ANM00003"]); // Bamboo Bonanza, Enrichment
  await AnimalService.assignItemToActivity(1, [1, 2]);
  await AnimalService.assignAnimalsToActivity(2, ["ANM00013", "ANM00014"]); // Target Training, Training
  await AnimalService.assignAnimalsToActivity(6, ["ANM00013", "ANM00014"]); // Observation

  // -- Animal Feeding Plan
  await AnimalService.createFeedingPlan(
    "SPE001",
    ["ANM00001", "ANM00002", "ANM00003", "ANM00004"],
    "General Summer Feeding Plan...",
    new Date("2023-10-18"),
    new Date("2023-10-18"),
    [
      {
        dayOfTheWeek: DayOfWeek.MONDAY,
        eventTimingType: EventTimingType.MORNING,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 9,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 7,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 9,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 80,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 2,
      },
      {
        dayOfTheWeek: DayOfWeek.TUESDAY,
        eventTimingType: EventTimingType.MORNING,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 9,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 7,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 9,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 80,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 2,
      },
      {
        dayOfTheWeek: DayOfWeek.WEDNESDAY,
        eventTimingType: EventTimingType.MORNING,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 9,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 7,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 9,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 80,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 2,
      },
      {
        dayOfTheWeek: DayOfWeek.THURSDAY,
        eventTimingType: EventTimingType.MORNING,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 9,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 7,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 9,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 80,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 2,
      },
      {
        dayOfTheWeek: DayOfWeek.FRIDAY,
        eventTimingType: EventTimingType.MORNING,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 9,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 7,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 9,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 80,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 2,
      },
      {
        dayOfTheWeek: DayOfWeek.SATURDAY,
        eventTimingType: EventTimingType.MORNING,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 9,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 7,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 9,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 80,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 2,
      },
      {
        dayOfTheWeek: DayOfWeek.SUNDAY,
        eventTimingType: EventTimingType.MORNING,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 9,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 7,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 9,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 80,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 2,
      },
      {
        dayOfTheWeek: DayOfWeek.MONDAY,
        eventTimingType: EventTimingType.EVENING,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 10,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 120,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 1,
      },
      {
        dayOfTheWeek: DayOfWeek.TUESDAY,
        eventTimingType: EventTimingType.EVENING,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 10,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 120,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 1,
      },
      {
        dayOfTheWeek: DayOfWeek.WEDNESDAY,
        eventTimingType: EventTimingType.EVENING,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 10,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 120,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 1,
      },
      {
        dayOfTheWeek: DayOfWeek.THURSDAY,
        eventTimingType: EventTimingType.EVENING,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 10,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 120,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 1,
      },
      {
        dayOfTheWeek: DayOfWeek.FRIDAY,
        eventTimingType: EventTimingType.EVENING,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 10,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 120,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 1,
      },
      {
        dayOfTheWeek: DayOfWeek.SATURDAY,
        eventTimingType: EventTimingType.EVENING,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 10,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 120,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 1,
      },
      {
        dayOfTheWeek: DayOfWeek.SUNDAY,
        eventTimingType: EventTimingType.EVENING,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 10,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 120,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 1,
      },
      {
        dayOfTheWeek: DayOfWeek.MONDAY,
        eventTimingType: EventTimingType.AFTERNOON,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 10,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00004",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 4.53333,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 3.46667,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 5.06667,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 5.742859999999999,
            unit: "KG",
            animalCode: "ANM00004",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.34,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.26,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.38,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.28714,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 120,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 1,
      },
      {
        dayOfTheWeek: DayOfWeek.TUESDAY,
        eventTimingType: EventTimingType.AFTERNOON,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 10,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00004",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 4.53333,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 3.46667,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 5.06667,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 5.742859999999999,
            unit: "KG",
            animalCode: "ANM00004",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.34,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.26,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.38,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.28714,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 120,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 1,
      },
      {
        dayOfTheWeek: DayOfWeek.WEDNESDAY,
        eventTimingType: EventTimingType.AFTERNOON,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 10,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00004",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 4.53333,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 3.46667,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 5.06667,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 5.742859999999999,
            unit: "KG",
            animalCode: "ANM00004",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.34,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.26,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.38,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.28714,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 120,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 1,
      },
      {
        dayOfTheWeek: DayOfWeek.THURSDAY,
        eventTimingType: EventTimingType.AFTERNOON,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 10,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00004",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 4.53333,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 3.46667,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 5.06667,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 5.742859999999999,
            unit: "KG",
            animalCode: "ANM00004",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.34,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.26,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.38,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.28714,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 120,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 1,
      },
      {
        dayOfTheWeek: DayOfWeek.FRIDAY,
        eventTimingType: EventTimingType.AFTERNOON,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 10,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00004",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 4.53333,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 3.46667,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 5.06667,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 5.742859999999999,
            unit: "KG",
            animalCode: "ANM00004",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.34,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.26,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.38,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.28714,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 120,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 1,
      },
      {
        dayOfTheWeek: DayOfWeek.SATURDAY,
        eventTimingType: EventTimingType.AFTERNOON,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 10,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00004",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 4.53333,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 3.46667,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 5.06667,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 5.742859999999999,
            unit: "KG",
            animalCode: "ANM00004",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.34,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.26,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.38,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.28714,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 120,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 1,
      },
      {
        dayOfTheWeek: DayOfWeek.SUNDAY,
        eventTimingType: EventTimingType.AFTERNOON,
        feedingItems: [
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "BROWSE",
            amount: 10,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "BROWSE",
            amount: 11,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "BROWSE",
            amount: 8,
            unit: "KG",
            animalCode: "ANM00004",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 4.53333,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 3.46667,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 5.06667,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "VEGETABLES",
            amount: 5.742859999999999,
            unit: "KG",
            animalCode: "ANM00004",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.34,
            unit: "KG",
            animalCode: "ANM00001",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.26,
            unit: "KG",
            animalCode: "ANM00002",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.38,
            unit: "KG",
            animalCode: "ANM00003",
          },
          {
            foodCategory: "FRUITS",
            amount: 0.28714,
            unit: "KG",
            animalCode: "ANM00004",
          },
        ],
        durationInMinutes: 120,
        isPublic: false,
        publicEventStartTime: null,
        requiredNumberOfKeeper: 1,
      },
    ],
  );

  await AnimalService.createFeedingPlan(
    "SPE001",
    ["ANM00003", "ANM00004", "ANM00005", "ANM00006"],
    "Some description...",
    new Date("2023-10-13"),
    new Date("2024-01-22"),
    [],
  );

  await AnimalService.createFeedingPlan(
    "SPE002",
    ["ANM00011"],
    "Some description...",
    new Date("2023-10-13"),
    new Date("2024-01-22"),
    [],
  );

  // await AnimalService.createFeedingPlanSessionDetail(
  //   1,
  //   DayOfWeek.MONDAY,
  //   EventTimingType.MORNING,
  //   120,
  //   false,
  //   null,
  //   [],
  //   1,
  // );
  // await AnimalService.createFeedingPlanSessionDetail(
  //   1,
  //   DayOfWeek.MONDAY,
  //   EventTimingType.AFTERNOON,
  //   120,
  //   false,
  //   null,
  //   [],
  //   1,
  // );
  // await AnimalService.createFeedingPlanSessionDetail(
  //   1,
  //   DayOfWeek.FRIDAY,
  //   EventTimingType.EVENING,
  //   120,
  //   false,
  //   null,
  //   [],
  //   1,
  // );
  // await AnimalService.createFeedingPlanSessionDetail(
  //   2,
  //   DayOfWeek.MONDAY,
  //   EventTimingType.AFTERNOON,
  //   120,
  //   false,
  //   null,
  //   [],
  //   1,
  // );
  // await AnimalService.createFeedingPlanSessionDetail(
  //   2,
  //   DayOfWeek.MONDAY,
  //   EventTimingType.AFTERNOON,
  //   120,
  //   true,
  //   "13:15",
  //   [],
  //   1,
  // );

  // await AnimalService.createFeedingItem(1, "ANM00001", "FRUITS", 5, "KG");
  // await AnimalService.createFeedingItem(1, "ANM00001", "HAY", 20, "KG");
  // await AnimalService.createFeedingItem(1, "ANM00002", "FRUITS", 10, "KG");
  // await AnimalService.createFeedingItem(2, "ANM00001", "HAY", 2000, "KG");
  // await AnimalService.createFeedingItem(2, "ANM00003", "FRUITS", 5, "KG");
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

export const enclosureSeed = async () => {
  let enclosure1Template = {
    // facilityId: 1,
    name: "Panda Paradise",
    remark: "NA",
    length: 40,
    width: 50,
    height: 10,
    enclosureStatus: "CONSTRUCTING",
    standOffBarrierDist: 5,
    facilityName: "Panda Paradise",
    isSheltered: false,
    imageUrl: "img/facility/EnclosureGiantPanda.jpg",
  } as any;
  let enclosure1Object = await EnclosureService.createNewEnclosure(
    enclosure1Template.name,
    enclosure1Template.remark,
    enclosure1Template.length,
    enclosure1Template.width,
    enclosure1Template.height,
    enclosure1Template.enclosureStatus,
    enclosure1Template.standOffBarrierDist,
    enclosure1Template.facilityName,
    enclosure1Template.isSheltered,
    enclosure1Template.imageUrl,
  );
  let panda_hub = await AssetFacility.addHubProcessorByFacilityId(
    enclosure1Object.newFacility.facilityId,
    "Da Bambo Hub",
  );
  panda_hub.lastDataUpdate = new Date();
  panda_hub.hubStatus = HubStatus.CONNECTED;
  await panda_hub.save();

  let pandaSensor = await AssetFacility.addSensorByHubProcessorId(
    panda_hub.hubProcessorId,
    SensorType.TEMPERATURE,
    "The pandaStat",
  );

  for (let i = 1; i < 50; i++) {
    pandaSensor.addSensorReading(
      await SensorReading.create({
        readingDate: new Date(Date.now() - 1000 * 60 * i),
        value: Math.random() * 15 + 3 + i,
      }),
    );
  }

  pandaSensor = await AssetFacility.addSensorByHubProcessorId(
    panda_hub.hubProcessorId,
    SensorType.LIGHT,
    "The panda detector",
  );

  for (let i = 1; i < 50; i++) {
    pandaSensor.addSensorReading(
      await SensorReading.create({
        readingDate: new Date(Date.now() - 1000 * 60 * i),
        value: Math.random() * 15 + 3 + i,
      }),
    );
  }
  pandaSensor.save();

  await Enclosure.update(
    {
      designDiagramJsonUrl: "enclosureDiagramJson/Panda Paradise.json",
      landArea: 931.41,
      waterArea: 35.63,
      plantationCoveragePercent: 23.2,
    },
    {
      where: { enclosureId: enclosure1Object.newEnclosure.enclosureId },
    },
  );
  // set x y coordinate
  await Facility.update(
    { xCoordinate: 103.7797, yCoordinate: 1.2929 },
    {
      where: { facilityId: enclosure1Object.newFacility.facilityId },
    },
  );
  await EnclosureService.updateEnclosureTerrainDistribution(
    enclosure1Object.newEnclosure.enclosureId,
    15,
    20,
    12,
    50,
    0,
    0,
  );
  await EnclosureService.updateEnclosureClimateDesign(
    enclosure1Object.newEnclosure.enclosureId,
    15,
    25,
    35,
    45,
  );

  let enclosure2Template = {
    name: "Capybara Cove",
    remark: "NA",
    length: 300,
    width: 500,
    height: 25,
    enclosureStatus: "ACTIVE",
    standOffBarrierDist: 3,
    facilityName: "Capybara Cove",
    isSheltered: false,
    imageUrl: "img/facility/EnclosureCapybara.jpg",
  } as any;
  let enclosure2Object = await EnclosureService.createNewEnclosure(
    enclosure2Template.name,
    enclosure2Template.remark,
    enclosure2Template.length,
    enclosure2Template.width,
    enclosure2Template.height,
    enclosure2Template.enclosureStatus,
    enclosure2Template.standOffBarrierDist,
    enclosure2Template.facilityName,
    enclosure2Template.isSheltered,
    enclosure2Template.imageUrl,
  );
  await Enclosure.update(
    { designDiagramJsonUrl: "enclosureDiagramJson/Capybara Cove.json" },
    {
      where: { enclosureId: enclosure2Object.newEnclosure.enclosureId },
    },
  );
  // set x y coordinate
  await Facility.update(
    { xCoordinate: 103.7761, yCoordinate: 1.297 },
    {
      where: { facilityId: enclosure2Object.newFacility.facilityId },
    },
  );
  await EnclosureService.updateEnclosureTerrainDistribution(
    enclosure2Object.newEnclosure.enclosureId,
    30,
    50,
    5,
    5,
    5,
    5,
  );
  await EnclosureService.updateEnclosureClimateDesign(
    enclosure2Object.newEnclosure.enclosureId,
    15,
    25,
    35,
    45,
  );

  let enclosure3Template = {
    name: "Rustic Red Retreat",
    remark: "NA",
    length: 300,
    width: 500,
    height: 25,
    enclosureStatus: "ACTIVE",
    standOffBarrierDist: 3,
    facilityName: "Rustic Red Retreat",
    isSheltered: false,
    imageUrl: "img/facility/EnclosureRusticRedRetreat.jpg",
  } as any;
  let enclosure3Object = await EnclosureService.createNewEnclosure(
    enclosure3Template.name,
    enclosure3Template.remark,
    enclosure3Template.length,
    enclosure3Template.width,
    enclosure3Template.height,
    enclosure3Template.enclosureStatus,
    enclosure3Template.standOffBarrierDist,
    enclosure3Template.facilityName,
    enclosure3Template.isSheltered,
    enclosure3Template.imageUrl,
  );
  await Enclosure.update(
    { designDiagramJsonUrl: "enclosureDiagramJson/Rustic Red Retreat.json" },
    {
      where: { enclosureId: enclosure3Object.newEnclosure.enclosureId },
    },
  );
  // set x y coordinate
  await Facility.update(
    { xCoordinate: 103.7746, yCoordinate: 1.2962 },
    {
      where: { facilityId: enclosure3Object.newFacility.facilityId },
    },
  );
  await EnclosureService.updateEnclosureTerrainDistribution(
    enclosure3Object.newEnclosure.enclosureId,
    0,
    0,
    15,
    0,
    75,
    10,
  );
  await EnclosureService.updateEnclosureClimateDesign(
    enclosure3Object.newEnclosure.enclosureId,
    15,
    25,
    35,
    45,
  );

  let enclosure4Template = {
    name: "Ivory Oasis",
    remark: "NA",
    length: 300,
    width: 500,
    height: 25,
    enclosureStatus: "ACTIVE",
    standOffBarrierDist: 3,
    facilityName: "Ivory Oasis",
    isSheltered: false,
    imageUrl: "img/facility/EnclosureElephant.jpg",
  } as any;
  let enclosure4Object = await EnclosureService.createNewEnclosure(
    enclosure4Template.name,
    enclosure4Template.remark,
    enclosure4Template.length,
    enclosure4Template.width,
    enclosure4Template.height,
    enclosure4Template.enclosureStatus,
    enclosure4Template.standOffBarrierDist,
    enclosure4Template.facilityName,
    enclosure4Template.isSheltered,
    enclosure4Template.imageUrl,
  );
  await Enclosure.update(
    { designDiagramJsonUrl: "enclosureDiagramJson/Ivory Oasis.json" },
    {
      where: { enclosureId: enclosure4Object.newEnclosure.enclosureId },
    },
  );
  // set x y coordinate
  await Facility.update(
    { xCoordinate: 103.776, yCoordinate: 1.2931 },
    {
      where: { facilityId: enclosure4Object.newFacility.facilityId },
    },
  );

  let enclosure5Template = {
    name: "Nemo's Nook",
    remark: "NA",
    length: 300,
    width: 500,
    height: 25,
    enclosureStatus: "ACTIVE",
    standOffBarrierDist: 3,
    facilityName: "Nemo's Nook",
    isSheltered: false,
    imageUrl: "img/facility/EnclosureNemo.jpg",
  } as any;
  let enclosure5Object = await EnclosureService.createNewEnclosure(
    enclosure5Template.name,
    enclosure5Template.remark,
    enclosure5Template.length,
    enclosure5Template.width,
    enclosure5Template.height,
    enclosure5Template.enclosureStatus,
    enclosure5Template.standOffBarrierDist,
    enclosure5Template.facilityName,
    enclosure5Template.isSheltered,
    enclosure5Template.imageUrl,
  );
  await Enclosure.update(
    { designDiagramJsonUrl: "enclosureDiagramJson/Nemo's Nook.json" },
    {
      where: { enclosureId: enclosure5Object.newEnclosure.enclosureId },
    },
  );
  // set x y coordinate
  await Facility.update(
    { xCoordinate: 103.7818, yCoordinate: 1.2987 },
    {
      where: { facilityId: enclosure5Object.newFacility.facilityId },
    },
  );

  let enclosure6Template = {
    name: "Savanna Kingdom",
    remark: "African Savanna-themed enclosure for lions.",
    length: 400,
    width: 600,
    height: 30,
    enclosureStatus: "ACTIVE",
    standOffBarrierDist: 4,
    facilityName: "Savanna Kingdom",
    isSheltered: true,
    imageUrl: "img/facility/lionEnclosure.webp",
  } as any;
  let enclosure6Object = await EnclosureService.createNewEnclosure(
    enclosure6Template.name,
    enclosure6Template.remark,
    enclosure6Template.length,
    enclosure6Template.width,
    enclosure6Template.height,
    enclosure6Template.enclosureStatus,
    enclosure6Template.standOffBarrierDist,
    enclosure6Template.facilityName,
    enclosure6Template.isSheltered,
    enclosure6Template.imageUrl,
  );
  await Enclosure.update(
    { designDiagramJsonUrl: "enclosureDiagramJson/Savanna Kingdom.json" },
    {
      where: { enclosureId: enclosure6Object.newEnclosure.enclosureId },
    },
  );
  // set x y coordinate
  await Facility.update(
    { xCoordinate: 103.7726, yCoordinate: 1.2961 },
    {
      where: { facilityId: enclosure6Object.newFacility.facilityId },
    },
  );

  let enclosure7Template = {
    name: "Antarctic Oasis",
    remark: "Antarctic-themed enclosure for penguins.",
    length: 200,
    width: 400,
    height: 15,
    enclosureStatus: "ACTIVE",
    standOffBarrierDist: 2,
    facilityName: "Antarctic Oasis",
    isSheltered: true,
    imageUrl: "img/facility/penguinEnclosure.jpg",
  } as any;
  let enclosure7Object = await EnclosureService.createNewEnclosure(
    enclosure7Template.name,
    enclosure7Template.remark,
    enclosure7Template.length,
    enclosure7Template.width,
    enclosure7Template.height,
    enclosure7Template.enclosureStatus,
    enclosure7Template.standOffBarrierDist,
    enclosure7Template.facilityName,
    enclosure7Template.isSheltered,
    enclosure7Template.imageUrl,
  );
  await Enclosure.update(
    { designDiagramJsonUrl: "enclosureDiagramJson/Antarctic Oasis.json" },
    {
      where: { enclosureId: enclosure7Object.newEnclosure.enclosureId },
    },
  );
  // set x y coordinate
  await Facility.update(
    { xCoordinate: 103.7737, yCoordinate: 1.2941 },
    {
      where: { facilityId: enclosure7Object.newFacility.facilityId },
    },
  );

  let enclosure8Template = {
    name: "Rainforest Haven",
    remark: "Borneo Rainforest-themed enclosure for orangutans.",
    length: 300,
    width: 500,
    height: 20,
    enclosureStatus: "ACTIVE",
    standOffBarrierDist: 3,
    facilityName: "Rainforest Haven",
    isSheltered: true,
    imageUrl: "img/facility/orangutanEnclosure.jpg",
  } as any;
  let enclosure8Object = await EnclosureService.createNewEnclosure(
    enclosure8Template.name,
    enclosure8Template.remark,
    enclosure8Template.length,
    enclosure8Template.width,
    enclosure8Template.height,
    enclosure8Template.enclosureStatus,
    enclosure8Template.standOffBarrierDist,
    enclosure8Template.facilityName,
    enclosure8Template.isSheltered,
    enclosure8Template.imageUrl,
  );
  await Enclosure.update(
    { designDiagramJsonUrl: "enclosureDiagramJson/Rainforest Haven.json" },
    {
      where: { enclosureId: enclosure8Object.newEnclosure.enclosureId },
    },
  );
  // set x y coordinate
  await Facility.update(
    { xCoordinate: 103.7809, yCoordinate: 1.2954 },
    {
      where: { facilityId: enclosure8Object.newFacility.facilityId },
    },
  );

  let enclosure9Template = {
    name: "Savanna Heights",
    remark: "African Savanna-themed enclosure for giraffes.",
    length: 500,
    width: 800,
    height: 35,
    enclosureStatus: "ACTIVE",
    standOffBarrierDist: 5,
    facilityName: "Savanna Heights",
    isSheltered: true,
    imageUrl: "img/facility/giraffeEnclosure.jpg",
  } as any;
  let enclosure9Object = await EnclosureService.createNewEnclosure(
    enclosure9Template.name,
    enclosure9Template.remark,
    enclosure9Template.length,
    enclosure9Template.width,
    enclosure9Template.height,
    enclosure9Template.enclosureStatus,
    enclosure9Template.standOffBarrierDist,
    enclosure9Template.facilityName,
    enclosure9Template.isSheltered,
    enclosure9Template.imageUrl,
  );
  await Enclosure.update(
    { designDiagramJsonUrl: "enclosureDiagramJson/Savanna Heights.json" },
    {
      where: { enclosureId: enclosure9Object.newEnclosure.enclosureId },
    },
  );
  // set x y coordinate
  await Facility.update(
    { xCoordinate: 103.7704, yCoordinate: 1.2982 },
    {
      where: { facilityId: enclosure9Object.newFacility.facilityId },
    },
  );

  // assign animals to enclosure
  await EnclosureService.assignAnimalToEnclosure(1, "ANM00001");
  await EnclosureService.assignAnimalToEnclosure(1, "ANM00002");
  await EnclosureService.assignAnimalToEnclosure(2, "ANM00016");
  await EnclosureService.assignAnimalToEnclosure(3, "ANM00015");
  await EnclosureService.assignAnimalToEnclosure(4, "ANM00013");
  await EnclosureService.assignAnimalToEnclosure(4, "ANM00014");
  await EnclosureService.assignAnimalToEnclosure(5, "ANM00011");
  await EnclosureService.assignAnimalToEnclosure(6, "ANM00017");
  await EnclosureService.assignAnimalToEnclosure(6, "ANM00018");
  await EnclosureService.assignAnimalToEnclosure(8, "ANM00021");
  await EnclosureService.assignAnimalToEnclosure(8, "ANM00022");
  await EnclosureService.assignAnimalToEnclosure(7, "ANM00019");
  await EnclosureService.assignAnimalToEnclosure(7, "ANM00020");



  let plantation1Template = {
    name: "African Daisy",
    biome: "TEMPERATE",
  } as any;
  await Plantation.create(plantation1Template);

  let plantation2Template = {
    name: "Baobab Tree",
    biome: "TROPICAL",
  } as any;
  await Plantation.create(plantation2Template);

  let plantation3Template = {
    name: "Cactus",
    biome: "DESERT",
  } as any;
  await Plantation.create(plantation3Template);

  let plantation4Template = {
    name: "Douglas Fir Pine",
    biome: "TAIGA",
  } as any;
  await Plantation.create(plantation4Template);

  let plantation5Template = {
    name: "Fern Tree",
    biome: "AQUATIC",
  } as any;
  await Plantation.create(plantation5Template);

  let plantation6Template = {
    name: "Goldenrod",
    biome: "GRASSLAND",
  } as any;
  await Plantation.create(plantation6Template);

  let plantation7Template = {
    name: "Himalayan Pine",
    biome: "TEMPERATE",
  } as any;
  await Plantation.create(plantation7Template);

  let plantation8Template = {
    name: "Ivy",
    biome: "TUNDRA",
  } as any;
  await Plantation.create(plantation8Template);

  let plantation9Template = {
    name: "Joshua Tree",
    biome: "DESERT",
  } as any;
  await Plantation.create(plantation9Template);

  let plantation10Template = {
    name: "Kapok Tree",
    biome: "TROPICAL",
  } as any;
  await Plantation.create(plantation10Template);

  let plantation11Template = {
    name: "Lobster Claw",
    biome: "TROPICAL",
  } as any;
  await Plantation.create(plantation11Template);

  let plantation12Template = {
    name: "Mangrove Apple",
    biome: "AQUATIC",
  } as any;
  await Plantation.create(plantation12Template);

  let plantation13Template = {
    name: "Nettle",
    biome: "TEMPERATE",
  } as any;
  await Plantation.create(plantation13Template);

  let plantation14Template = {
    name: "Olive Tree",
    biome: "TUNDRA",
  } as any;
  await Plantation.create(plantation14Template);

  let plantation15Template = {
    name: "Papyrus Sedge",
    biome: "AQUATIC",
  } as any;
  await Plantation.create(plantation15Template);

  let plantation16Template = {
    name: "Quaking Aspen Tree",
    biome: "TAIGA",
  } as any;
  await Plantation.create(plantation16Template);

  let plantation17Template = {
    name: "Rainbow Eucalyptus Tree",
    biome: "TROPICAL",
  } as any;
  await Plantation.create(plantation17Template);

  let plantation18Template = {
    name: "Saguaro Cactus",
    biome: "DESERT",
  } as any;
  await Plantation.create(plantation18Template);

  let plantation19Template = {
    name: "Tundra Moss",
    biome: "TUNDRA",
  } as any;
  await Plantation.create(plantation19Template);

  let plantation20Template = {
    name: "Umbrella Thorn Acacia",
    biome: "GRASSLAND",
  } as any;
  await Plantation.create(plantation20Template);

  let plantation21Template = {
    name: "Variegated Ivy",
    biome: "TEMPERATE",
  } as any;
  await Plantation.create(plantation21Template);

  let plantation22Template = {
    name: "Water Hyacinth",
    biome: "AQUATIC",
  } as any;
  await Plantation.create(plantation22Template);

  let plantation23Template = {
    name: "Xerophyte",
    biome: "DESERT",
  } as any;
  await Plantation.create(plantation23Template);

  let plantation24Template = {
    name: "Yellow Poplar",
    biome: "TEMPERATE",
  } as any;
  await Plantation.create(plantation24Template);

  let plantation25Template = {
    name: "Zebra Grass",
    biome: "GRASSLAND",
  } as any;
  await Plantation.create(plantation25Template);

  let plantation26Template = {
    name: "Quiver Tree",
    biome: "DESERT",
  } as any;
  await Plantation.create(plantation26Template);

  let plantation27Template = {
    name: "Siberian Peashrub",
    biome: "TAIGA",
  } as any;
  await Plantation.create(plantation27Template);

  let plantation28Template = {
    name: "Sugar Maple Tree",
    biome: "TEMPERATE",
  } as any;
  await Plantation.create(plantation28Template);

  let plantation29Template = {
    name: "Blue Lotus Plant",
    biome: "AQUATIC",
  } as any;
  await Plantation.create(plantation29Template);

  let plantation30Template = {
    name: "Red Oat Grass",
    biome: "GRASSLAND",
  } as any;
  await Plantation.create(plantation30Template);
};

export const facilityAssetsSeed = async () => {
  let facility3 = {
    facilityName: "Info Centre",
    isSheltered: true,
    showOnMap: true,
    xCoordinate: 103.78114318847656,
    yCoordinate: 1.29179263114929,
    imageUrl: "img/facility/InfoCentre.jpg",
    inHouse: {
      lastMaintained: new Date(),
      isPaid: false,
      maxAccommodationSize: 5,
      hasAirCon: false,
      facilityType: FacilityType.INFORMATION_CENTRE,
    } as any,
  } as any;
  let f3 = await Facility.create(facility3, { include: ["inHouse"] });
  let f3h: InHouse = await f3.getFacilityDetail();

  await AssetFacility.createCustomerReport(
    f3.facilityId,
    new Date(),
    "Button broken",
    "Pressed button and not working",
    false,
  );

  let facility4 = {
    facilityName: "Directory",
    isSheltered: true,
    showOnMap: true,
    xCoordinate: 103.78115844726562,
    yCoordinate: 1.29660260677338,
    imageUrl: "img/facility/Directory.png",
    inHouse: {
      lastMaintained: new Date(),
      isPaid: false,
      maxAccommodationSize: 5,
      hasAirCon: false,
      facilityType: FacilityType.ZOO_DIRECTORY,
    } as any,
  } as any;
  let f4 = await Facility.create(facility4, { include: ["inHouse"] });
  let f4h: InHouse = await f4.getFacilityDetail();

  await AssetFacility.createCustomerReport(
    f4.facilityId,
    new Date(),
    "Directory broken",
    "Pressed Directory and not working",
    false,
  );

  await AssetFacility.createCustomerReport(
    f4.facilityId,
    new Date(),
    "Directory is awesome",
    "Pressed Directory and working",
    true,
  );

  let facility5 = {
    facilityName: "Shop",
    isSheltered: true,
    showOnMap: true,
    xCoordinate: 103.78221130371094,
    yCoordinate: 1.29178547859192,
    imageUrl: "img/facility/Shop.jpg",
    inHouse: {
      lastMaintained: new Date(),
      isPaid: false,
      maxAccommodationSize: 5,
      hasAirCon: false,
      facilityType: FacilityType.SHOP_SOUVENIR,
    } as any,
  } as any;
  let f5 = await Facility.create(facility5, { include: ["inHouse"] });
  let f5h: InHouse = await f5.getFacilityDetail();

  let facility6 = {
    facilityName: "Parking",
    isSheltered: true,
    showOnMap: true,
    xCoordinate: 103.7817,
    yCoordinate: 1.291,
    imageUrl: "img/facility/Parking.jpg",
    inHouse: {
      lastMaintained: new Date(),
      isPaid: false,
      maxAccommodationSize: 5,
      hasAirCon: false,
      facilityType: FacilityType.PARKING,
    } as any,
  } as any;
  let f6 = await Facility.create(facility6, { include: ["inHouse"] });
  let f6h: InHouse = await f6.getFacilityDetail();

  for (const day of [19, 18, 17, 16, 15, 14, 13, 12]) {
    f6h.addFacilityLog(
      await FacilityLog.create({
        dateTime: new Date(Date.now() - day * DAY_IN_MILLISECONDS),
        title: "Parking ma",
        details: "found dog poop",
        remarks: "sweep the floor",
        staffName: "maint1",
        facilityLogType: FacilityLogType.MAINTENANCE_LOG,
      }),
    );
  }

  let facility7 = {
    facilityName: "Harvey Norman Amphitheatre",
    isSheltered: true,
    showOnMap: true,
    xCoordinate: 103.77511596679688,
    yCoordinate: 1.2956326007843,
    imageUrl: "img/facility/Amphitheatre.jpg",
    inHouse: {
      lastMaintained: new Date(),
      isPaid: false,
      maxAccommodationSize: 5,
      hasAirCon: false,
      facilityType: FacilityType.AMPHITHEATRE,
    } as any,
  } as any;
  let f7 = await Facility.create(facility7, { include: ["inHouse"] });
  let f7h: InHouse = await f7.getFacilityDetail();

  let facility8 = {
    facilityName: "Playground",
    isSheltered: true,
    showOnMap: true,
    xCoordinate: 103.7804946899414,
    yCoordinate: 1.29745411872864,
    imageUrl: "img/facility/Playground.jpg",
    inHouse: {
      lastMaintained: new Date(),
      isPaid: false,
      maxAccommodationSize: 5,
      hasAirCon: false,
      facilityType: FacilityType.PLAYGROUND,
    } as any,
  } as any;
  let f8 = await Facility.create(facility8, { include: ["inHouse"] });
  let f8h: InHouse = await f8.getFacilityDetail();

  let facility9 = {
    facilityName: "Nursery",
    isSheltered: true,
    showOnMap: true,
    xCoordinate: 103.7739486694336,
    yCoordinate: 1.29762589931488,
    imageUrl: "img/facility/Nursery.JPG",
    inHouse: {
      lastMaintained: new Date(),
      isPaid: false,
      maxAccommodationSize: 5,
      hasAirCon: false,
      facilityType: FacilityType.NURSERY,
    } as any,
  } as any;
  let f9 = await Facility.create(facility9, { include: ["inHouse"] });
  let f9h: InHouse = await f9.getFacilityDetail();

  let facility10 = {
    facilityName: "Gazebo 1",
    isSheltered: true,
    showOnMap: true,
    xCoordinate: 103.7840576171875,
    yCoordinate: 1.29575824737549,
    imageUrl: "img/facility/Gazebo.jpg",
    inHouse: {
      lastMaintained: new Date(),
      isPaid: false,
      maxAccommodationSize: 5,
      hasAirCon: false,
      facilityType: FacilityType.GAZEBO,
    } as any,
  } as any;
  let f10 = await Facility.create(facility10, { include: ["inHouse"] });
  let f10h: InHouse = await f10.getFacilityDetail();

  let facility11 = {
    facilityName: "Tiger Pool Cafe",
    isSheltered: true,
    showOnMap: true,
    xCoordinate: 103.7768325805664,
    yCoordinate: 1.2946457862854,
    imageUrl: "img/facility/Tiger Pool Cafe.jpg",
    inHouse: {
      lastMaintained: new Date(),
      isPaid: false,
      maxAccommodationSize: 5,
      hasAirCon: false,
      facilityType: FacilityType.RESTAURANT,
    } as any,
  } as any;
  let f11 = await Facility.create(facility11, { include: ["inHouse"] });
  let f11h: InHouse = await f11.getFacilityDetail();

  let facility12 = {
    facilityName: "The Boardwalk Amphitheatre ",
    isSheltered: true,
    showOnMap: true,
    xCoordinate: 103.7702,
    yCoordinate: 1.2967,
    imageUrl: "img/facility/Amphi2.jpg",
    inHouse: {
      lastMaintained: new Date(),
      isPaid: false,
      maxAccommodationSize: 5,
      hasAirCon: false,
      facilityType: FacilityType.AMPHITHEATRE,
    } as any,
  } as any;
  let f12 = await Facility.create(facility12, { include: ["inHouse"] });
  let f12h: InHouse = await f12.getFacilityDetail();

  let facility13 = {
    facilityName: "Gazebo 2",
    isSheltered: true,
    showOnMap: true,
    xCoordinate: 103.7781,
    yCoordinate: 1.2976,
    imageUrl: "img/facility/gazebo2.jpg",
    inHouse: {
      lastMaintained: new Date(),
      isPaid: false,
      maxAccommodationSize: 5,
      hasAirCon: false,
      facilityType: FacilityType.GAZEBO,
    } as any,
  } as any;
  let f13 = await Facility.create(facility13, { include: ["inHouse"] });
  let f13h: InHouse = await f13.getFacilityDetail();

  let toiletTemplate = {
    facilityName: "Toilet",
    isSheltered: true,
    showOnMap: true,
    xCoordinate: 103.77333068847656,
    yCoordinate: 1.2970198392868,
    imageUrl: "img/facility/Toilet.jpg",
    inHouse: {
      lastMaintained: new Date(),
      isPaid: false,
      maxAccommodationSize: 5,
      hasAirCon: false,
      facilityType: FacilityType.RESTROOM,
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
        title: "Maintenance of " + _day.toDateString(),
        details: "Bla Bla Bla...",
        remarks: "Uncommon but common",
        staffName: "maint1",
        facilityLogType: FacilityLogType.MAINTENANCE_LOG,
      }),
    );
  }

  console.log(toilet.toJSON());

  let facility1 = await Facility.create(
    {
      facilityName: "Tram Stop 1",
      xCoordinate: 103.7780990600586,
      yCoordinate: 1.29767763614655,
      isSheltered: true,
      showOnMap: true,
      imageUrl: "img/facility/Tram Stop 1.jpg",
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
        facilityType: FacilityType.TRAMSTOP,
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
      title: "log1",
      details: "Bla Bla...",
      remarks: "my log haha",
      staffName: "maint1",
      facilityLogType: FacilityLogType.MAINTENANCE_LOG,
    }),
    await FacilityLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
      title: "log2",
      details: "Bla Bla...",
      remarks: "my log haha",
      staffName: "maint1",
      facilityLogType: FacilityLogType.MAINTENANCE_LOG,
    }),
    await FacilityLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      title: "log3",
      details: "Bla Bla...",
      remarks: "my log haha",
      staffName: "maint1",
      facilityLogType: FacilityLogType.MAINTENANCE_LOG,
    }),
    await FacilityLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      title: "log4",
      details: "Bla Bla...",
      remarks: "my log haha",
      staffName: "maint1",
      facilityLogType: FacilityLogType.MAINTENANCE_LOG,
    }),
    await FacilityLog.create({
      dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      title: "log5",
      details: "Bla Bla...",
      remarks: "my log haha",
      staffName: "maint1",
      facilityLogType: FacilityLogType.MAINTENANCE_LOG,
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
      facilityName: "Tram Stop 2",
      isSheltered: true,
      xCoordinate: 5,
      yCoordinate: 50,
      imageUrl: "img/facility/Tram Stop 2.jpg",
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

  await gs?.addMaintainedFacility(is1);

  let tram2 = await Facility.create(
    {
      facilityName: "tram2",
      isSheltered: true,
      imageUrl: "img/facility/tram2.jpg",
      //@ts-ignore
      inHouse: {
        isPaid: true,
        maxAccommodationSize: 40,
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
      ipAddressName: "127.0.0.1",
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
        {
          sensorName: "Cameraa",
          sensorType: SensorType.CAMERA,
        },
        {
          sensorName: "Cameraaa",
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

  sensor = sensors[5];
  _day = new Date(Date.now());
  // [1, 5, 2, 4, 8, 5, 7, 11, 8, 10, 14, 11, 13, 17]
  for (const days of [0, 17, 13, 11, 14, 10, 8, 11, 7, 5, 8, 4, 2, 5, 1]) {
    _day = new Date(_day.getTime() - days * 1000 * 60 * 60 * 24);
    sensor.addMaintenanceLog(
      await MaintenanceLog.create({
        dateTime: _day,
        title: "Maintenance 2" + _day.toDateString(),
        details: "Bla bla bla...",
        remarks: "not uncommon",
        staffName: "maint1",
      }),
    );
  }
  sensor.dateOfLastMaintained = _day;

  for (let i = 1; i < 50; i++) {
    sensor.addSensorReading(
      await SensorReading.create({
        readingDate: new Date(Date.now() - 1000 * 60 * i),
        value: Math.random() * 15 + 3 + i,
      }),
    );
  }
  sensor.save();

  sensor = sensors[6];
  _day = new Date(Date.now());
  // [1, 5, 2, 4, 8, 5, 7, 11, 8, 10, 14, 11, 13, 17]
  for (const days of [0, 17, 13, 11, 14, 10, 8, 11, 7, 5, 8, 4, 2, 5, 1]) {
    _day = new Date(_day.getTime() - days * 1000 * 60 * 60 * 24);
    sensor.addMaintenanceLog(
      await MaintenanceLog.create({
        dateTime: _day,
        title: "Maintenance 2" + _day.toDateString(),
        details: "Bla bla bla...",
        remarks: "not uncommon",
        staffName: "maint1",
      }),
    );
  }
  sensor.dateOfLastMaintained = _day;

  for (let i = 1; i < 50; i++) {
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

export const publicEventSeed = async () => {
  const today = new Date(Date.now());
  today.setHours(0, 0, 0);

  const pubEvent = await ZooEventService.createPublicEvent(
    EventType.CUSTOMER_FEEDING,
    "Elephant Feeding",
    "Join us for an unforgettable encounter with our gentle giants! The Elephant Feeding Experience allows you to get up close and personal with our magnificent elephants as you assist in feeding them their favorite treats!",
    "img/event/elephant.jpg",
    today,
    new Date(today.getTime()),
    [],
    [1],
    5,
  );

  const pubEventSession = await ZooEventService.createPublicEventSession(
    pubEvent.publicEventId,
    RecurringPattern.NON_RECURRING,
    null,
    null,
    10,
    "23:00",
    5,
    new Date(Date.now() + 0.05 * DAY_IN_MILLISECONDS),
  );

  const pubEvent2 = await ZooEventService.createPublicEvent(
    EventType.CUSTOMER_FEEDING,
    "Red Panda Feeding",
    "Feed our red pandas? Where else can you do this?",
    "img/event/pandafeeding.jpg",
    today,
    new Date(today.getTime() + 60 * DAY_IN_MILLISECONDS),
    (await AnimalService.getAllAnimalsBySpeciesCode("SPE001")).map(
      (animal) => animal.animalCode,
    ),
    [1],
    8,
  );

  const pubEventSession2 = await ZooEventService.createPublicEventSession(
    pubEvent2.publicEventId,
    RecurringPattern.WEEKLY,
    DayOfWeek.THURSDAY,
    null,
    60,
    "15:00",
    7,
    null,
  );

  const pubEventSession3 = await ZooEventService.createPublicEventSession(
    pubEvent2.publicEventId,
    RecurringPattern.WEEKLY,
    DayOfWeek.FRIDAY,
    null,
    60,
    "12:00",
    7,
    null,
  );

  const pubEvent3 = await ZooEventService.createPublicEvent(
    EventType.TALK,
    "Clown Fish Keeper Talk",
    "Find out more about the lifestyles and managements of these sea creatures",
    "img/species/clownfish.jpg",
    today,
    null,
    (await AnimalService.getAllAnimalsBySpeciesCode("SPE005")).map(
      (animal) => animal.animalCode,
    ),
    [1],
    8,
  );

  const pubEventSession4 = await ZooEventService.createPublicEventSession(
    pubEvent3.publicEventId,
    RecurringPattern.MONTHLY,
    null,
    22,
    60,
    "15:00",
    7,
    null,
  );

  const pubEvent4 = await ZooEventService.createPublicEvent(
    EventType.SHOW,
    "Bird Show",
    "Watch our aerial ambassadors put on a show",
    "img/event/animalshow.jpg",
    today,
    new Date(today.getTime()),
    (await AnimalService.getAllAnimalsBySpeciesCode("SPE001")).map(
      (animal) => animal.animalCode,
    ),
    [1],
    5,
  );

  const pubEventSession5 = await ZooEventService.createPublicEventSession(
    pubEvent4.publicEventId,
    RecurringPattern.NON_RECURRING,
    null,
    null,
    10,
    "22:00",
    5,
    new Date(Date.now() + 0.05 * DAY_IN_MILLISECONDS),
  );

  const pubEvent5 = await ZooEventService.createPublicEvent(
    EventType.TALK,
    "Elephant Keeper Talk",
    "Find out more about the lifestyles and managements of these majestic creatures",
    "img/event/keepertalk.jpg",
    today,
    null,
    (await AnimalService.getAllAnimalsBySpeciesCode("SPE001")).map(
      (animal) => animal.animalCode,
    ),
    [1],
    8,
  );

  const pubEventSession6 = await ZooEventService.createPublicEventSession(
    pubEvent5.publicEventId,
    RecurringPattern.NON_RECURRING,
    null,
    null,
    10,
    "23:00",
    5,
    new Date(Date.now() + 0.05 * DAY_IN_MILLISECONDS),
  );

  const pubEvent7 = await ZooEventService.createPublicEvent(
    EventType.CUSTOMER_FEEDING,
    "Red Panda Feeding",
    "Join us for an unforgettable encounter with our gentle giants! The Elephant Feeding Experience allows you to get up close and personal with our magnificent elephants as you assist in feeding them their favorite treats!",
    "img/event/pandafeeding.jpg",
    today,
    new Date(today.getTime()),
    [],
    [1],
    11,
  );

  const pubEventSession7 = await ZooEventService.createPublicEventSession(
    pubEvent7.publicEventId,
    RecurringPattern.NON_RECURRING,
    null,
    null,
    10,
    "11:00",
    5,
    new Date(Date.now() + 0.05 * DAY_IN_MILLISECONDS),
  );

  const pubEvent8 = await ZooEventService.createPublicEvent(
    EventType.SHOW,
    "Capybara Show",
    "Join us for an unforgettable encounter with our cute big rodents!",
    "img/event/animalshow3.png",
    today,
    new Date(today.getTime()),
    [],
    [1],
    10,
  );

  const pubEventSession8 = await ZooEventService.createPublicEventSession(
    pubEvent8.publicEventId,
    RecurringPattern.NON_RECURRING,
    null,
    null,
    10,
    "15:00",
    5,
    new Date(Date.now() + 0.05 * DAY_IN_MILLISECONDS),
  );

  const pubEvent10 = await ZooEventService.createPublicEvent(
    EventType.SHOW,
    "Seal Show",
    "Join us for an unforgettable encounter with our slimy adorable seals!",
    "img/event/animalshow2.jpg",
    today,
    new Date(today.getTime()),
    [],
    [1],
    11,
  );

  const pubEventSession10 = await ZooEventService.createPublicEventSession(
    pubEvent10.publicEventId,
    RecurringPattern.NON_RECURRING,
    null,
    null,
    10,
    "15:00",
    5,
    new Date(Date.now() + 0.05 * DAY_IN_MILLISECONDS),
  );

  const pubEvent11 = await ZooEventService.createPublicEvent(
    EventType.TALK,
    "Parrot Keeper Talk",
    "Join us for an insightful education about parrots and their quirks!",
    "img/event/keepertalk2.jpg",
    today,
    new Date(today.getTime()),
    [],
    [1],
    11,
  );

  const pubEventSession11 = await ZooEventService.createPublicEventSession(
    pubEvent11.publicEventId,
    RecurringPattern.NON_RECURRING,
    null,
    null,
    10,
    "15:00",
    5,
    new Date(Date.now() + 0.05 * DAY_IN_MILLISECONDS),
  );
};

export const enclosureKeeperSeed = async () => {
  await EnclosureService.assignKeepersToEnclosure(1, [2, 5]);
};

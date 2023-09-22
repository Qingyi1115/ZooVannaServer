enum KeeperType {
  SENIOR_KEEPER = "SENIOR_KEEPER",
  KEEPER = "KEEPER",
}

enum PlannerType {
  CURATOR = "CURATOR",
  SALES = "SALES",
  MARKETING = "MARKETING",
  OPERATIONS_MANAGER = "OPERATIONS_MANAGER",
  CUSTOMER_OPERATIONS = "CUSTOMER_OPERATIONS",
}

enum GeneralStaffType {
  ZOO_MAINTENANCE = "ZOO_MAINTENANCE",
  ZOO_OPERATIONS = "ZOO_OPERATIONS",
}

enum SensorType {
  TEMPERATURE = "TEMPERATURE",
  LIGHT = "LIGHT",
  HUMIDITY = "HUMIDITY",
  SOUND = "SOUND",
  MOTION = "MOTION",
  CAMERA = "CAMERA",
}

enum FacilityType {
  INFORMATION_CENTRE = "INFORMATION_CENTRE",
  ZOO_DIRECTORY = "ZOO_DIRECTORY",
  AMPHITHEATRE = "AMPHITHEATRE",
  GAZEBO = "GAZEBO",
  AED = "AED",
  RESTROOM = "RESTROOM",
  NURSERY = "NURSERY",
  FIRST_AID = "FIRST_AID",
  BENCHES = "BENCHES",
  PLAYGROUND = "PLAYGROUND",
  TRAMSTOP = "TRAMSTOP",
  PARKING = "PARKING",
  RESTAURANT="RESTAURANT",
  SHOP_SOUVENIR="SHOP_SOUVENIR"
}

enum Specialization {
  MAMMAL = "MAMMAL",
  BIRD = "BIRD",
  FISH = "FISH",
  REPTILE = "REPTILE",
  AMPHIBIAN = "AMPHIBIAN",
}

enum MedicalSupplyType {
  FIRST_AID = "FIRST_AID",
  MEDICATION = "MEDICATION",
  DIAGNOSTIC_TOOL = "DIAGNOSTIC_TOOL",
  SURGICAL_TOOL = "SURGICAL_TOOL",
  FLUID_ADMINISTRATION = "FLUID_ADMINISTRATION",
  DENTAL = "DENTAL",
  EMERGENCY = "EMERGENCY",
  FEEDING_TUBE_AND_SYRINGES = "FEEDING_TUBE_AND_SYRINGES",
  LABORATORY = "LABORATORY",
  PPE = "PPE",
}

enum ConservationStatus {
  DATA_DEFICIENT = "DATA_DEFICIENT",
  DOMESTICATED = "DOMESTICATED",
  LEAST_CONCERN = "LEAST_CONCERN",
  NEAR_THREATENED = "NEAR_THREATENED",
  VULNERABLE = "VULNERABLE",
  ENDANGERED = "ENDANGERED",
  CRITICALLY_ENDANGERED = "CRITICALLY_ENDANGERED",
  EXTINCT_IN_WILD = "EXTINCT_IN_WILD",
}

enum Continent {
  AFRICA = "AFRICA",
  ASIA = "ASIA",
  EUROPE = "EUROPE",
  NORTH_AMERICA = "NORTH_AMERICA",
  SOUTH_OR_CENTRAL_AMERICA = "SOUTH_OR_CENTRAL_AMERICA",
  OCEANIA = "OCEANIA",
}

enum GroupSexualDynamic {
  MONOGAMOUS = "MONOGAMOUS",
  PROMISCUOUS = "PROMISCUOUS",
  POLYGYNOUS = "POLYGYNOUS",
  POLYANDROUS = "POLYANDROUS",
}

enum PresentationContainer {
  STAINLESS_STEEL_BOWL = "Stainless Steel Bowls",
  PLASTIC_DISH = "Plastic Feeding Dishes",
  SILICONE_DISH = "Silicone Dishes",
  MESH_BAG = "Mesh Bags",
  FREEZE_RESISTANT_CONTAINER = "Freeze-Resistant Containers",
  AUTOMATIC_FEEDER = "Automatic Feeders",
  HANGING_FEEDERS = "Hanging Feeder",
  NET = "Net",
}
enum PresentationMethod {
  CHOPPED = "CHOPPED",
  FROEZEN = "FROEZEN",
  MASHED = "MASHED",
  DICED = "DICED",
  WHOLE = "WHOLE",
  BLENDED = "BLENDED",
  PUZZLE = "PUZZLE",
}
enum PresentationLocation {
  SCATTER = "SCATTER",
  DANGLING = "DANGLING",
  ROOF = "ROOF",
  BURIED = "BURIED",
  IMPALED = "IMPALED",
  IN_CONTAINER = "IN_CONTAINER",
}
enum AnimalGrowthState {
  TEST = "TEST",
}

enum AnimalSex {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNKNOWN = "UNKNOWN",
  ASEXUAL = "ASEXUAL",
}

enum AcquisitionMethod {
  INFANT = "INFANT",
  JUVENILE = "JUVENILE",
  ADOLESCENT = "ADOLESCENT",
  ADULT = "ADULT",
  ELDER = "ELDER",
}

enum AnimalFeedCategory {
  RED_MEAT = "RED_MEAT",
  WHITE_MEAT = "WHITE_MEAT",
  FISH = "FISH",
  INSECTS = "INSECTS",
  HAY = "HAY",
  VEGETABLES = "VEGETABLES",
  FRUITS = "FRUITS",
  GRAINS = "GRAINS",
  BROWSE = "BROWSE",
  PELLETS = "PELLETS",
  NECTAR = "NECTAR",
  SUPPLEMENTS = "SUPPLEMENTS",
  OTHERS = "OTHERS",
}

enum AnimalGrowthStage {
  INFANT = "INFANT",
  JUVENILE = "JUVENILE",
  ADOLESCENT = "ADOLESCENT",
  ADULT = "ADULT",
  ELDER = "ELDER",
}

enum AnimalStatusType {
  TEST = "TEST",
}

enum Biome {
  AQUATIC = "AQUATIC",
  DESERT = "DESERT",
  GRASSLAND = "GRASSLAND",
  TAIGA = "TAIGA",
  TEMPERATE = "TEMPERATE",
  TROPICAL = "TROPICAL",
  TUNDRA = "TUNDRA",
}

enum EventType {
  SHOW = "SHOW",
  CUSTOMER_FEEDING = "CUSTOMER_FEEDING",
  TALK = "TALK",
  EMPLOYEE_FEEDING = "EMPLOYEE_FEEDING",
  ENRICHMENT = "ENRICHMENT",
  OBSERVATION = "OBSERVATION",
  ANIMAL_CHECKUP = "ANIMAL_CHECKUP",
}

enum EventTimingType {
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
  EVENING = "EVENING",
}

enum Country {
  Afghanistan = "AF",
  AlandIslands = "AX",
  Albania = "AL",
  Algeria = "DZ",
  AmericanSamoa = "AS",
  Andorra = "AD",
  Angola = "AO",
  Anguilla = "AI",
  Antarctica = "AQ",
  AntiguaAndBarbuda = "AG",
  Argentina = "AR",
  Armenia = "AM",
  Aruba = "AW",
  Australia = "AU",
  Austria = "AT",
  Azerbaijan = "AZ",
  Bahamas = "BS",
  Bahrain = "BH",
  Bangladesh = "BD",
  Barbados = "BB",
  Belarus = "BY",
  Belgium = "BE",
  Belize = "BZ",
  Benin = "BJ",
  Bermuda = "BM",
  Bhutan = "BT",
  Bolivia = "BO",
  BonaireSintEustatiusSaba = "BQ",
  BosniaAndHerzegovina = "BA",
  Botswana = "BW",
  BouvetIsland = "BV",
  Brazil = "BR",
  BritishIndianOceanTerritory = "IO",
  BruneiDarussalam = "BN",
  Bulgaria = "BG",
  BurkinaFaso = "BF",
  Burundi = "BI",
  Cambodia = "KH",
  Cameroon = "CM",
  Canada = "CA",
  CapeVerde = "CV",
  CaymanIslands = "KY",
  CentralAfricanRepublic = "CF",
  Chad = "TD",
  Chile = "CL",
  China = "CN",
  ChristmasIsland = "CX",
  CocosKeelingIslands = "CC",
  Colombia = "CO",
  Comoros = "KM",
  Congo = "CG",
  CongoDemocraticRepublic = "CD",
  CookIslands = "CK",
  CostaRica = "CR",
  CoteDIvoire = "CI",
  Croatia = "HR",
  Cuba = "CU",
  Curaçao = "CW",
  Cyprus = "CY",
  CzechRepublic = "CZ",
  Denmark = "DK",
  Djibouti = "DJ",
  Dominica = "DM",
  DominicanRepublic = "DO",
  Ecuador = "EC",
  Egypt = "EG",
  ElSalvador = "SV",
  EquatorialGuinea = "GQ",
  Eritrea = "ER",
  Estonia = "EE",
  Ethiopia = "ET",
  FalklandIslands = "FK",
  FaroeIslands = "FO",
  Fiji = "FJ",
  Finland = "FI",
  France = "FR",
  FrenchGuiana = "GF",
  FrenchPolynesia = "PF",
  FrenchSouthernTerritories = "TF",
  Gabon = "GA",
  Gambia = "GM",
  Georgia = "GE",
  Germany = "DE",
  Ghana = "GH",
  Gibraltar = "GI",
  Greece = "GR",
  Greenland = "GL",
  Grenada = "GD",
  Guadeloupe = "GP",
  Guam = "GU",
  Guatemala = "GT",
  Guernsey = "GG",
  Guinea = "GN",
  GuineaBissau = "GW",
  Guyana = "GY",
  Haiti = "HT",
  HeardIslandMcdonaldIslands = "HM",
  HolySeeVaticanCityState = "VA",
  Honduras = "HN",
  HongKong = "HK",
  Hungary = "HU",
  Iceland = "IS",
  India = "IN",
  Indonesia = "ID",
  Iran = "IR",
  Iraq = "IQ",
  Ireland = "IE",
  IsleOfMan = "IM",
  Israel = "IL",
  Italy = "IT",
  Jamaica = "JM",
  Japan = "JP",
  Jersey = "JE",
  Jordan = "JO",
  Kazakhstan = "KZ",
  Kenya = "KE",
  Kiribati = "KI",
  Korea = "KR",
  KoreaDemocraticPeoplesRepublic = "KP",
  Kuwait = "KW",
  Kyrgyzstan = "KG",
  LaoPeoplesDemocraticRepublic = "LA",
  Latvia = "LV",
  Lebanon = "LB",
  Lesotho = "LS",
  Liberia = "LR",
  LibyanArabJamahiriya = "LY",
  Liechtenstein = "LI",
  Lithuania = "LT",
  Luxembourg = "LU",
  Macao = "MO",
  Macedonia = "MK",
  Madagascar = "MG",
  Malawi = "MW",
  Malaysia = "MY",
  Maldives = "MV",
  Mali = "ML",
  Malta = "MT",
  MarshallIslands = "MH",
  Martinique = "MQ",
  Mauritania = "MR",
  Mauritius = "MU",
  Mayotte = "YT",
  Mexico = "MX",
  Micronesia = "FM",
  Moldova = "MD",
  Monaco = "MC",
  Mongolia = "MN",
  Montenegro = "ME",
  Montserrat = "MS",
  Morocco = "MA",
  Mozambique = "MZ",
  Myanmar = "MM",
  Namibia = "NA",
  Nauru = "NR",
  Nepal = "NP",
  Netherlands = "NL",
  NewCaledonia = "NC",
  NewZealand = "NZ",
  Nicaragua = "NI",
  Niger = "NE",
  Nigeria = "NG",
  Niue = "NU",
  NorfolkIsland = "NF",
  NorthernMarianaIslands = "MP",
  Norway = "NO",
  Oman = "OM",
  Pakistan = "PK",
  Palau = "PW",
  PalestinianTerritory = "PS",
  Panama = "PA",
  PapuaNewGuinea = "PG",
  Paraguay = "PY",
  Peru = "PE",
  Philippines = "PH",
  Pitcairn = "PN",
  Poland = "PL",
  Portugal = "PT",
  PuertoRico = "PR",
  Qatar = "QA",
  Reunion = "RE",
  Romania = "RO",
  RussianFederation = "RU",
  Rwanda = "RW",
  SaintBarthelemy = "BL",
  SaintHelena = "SH",
  SaintKittsAndNevis = "KN",
  SaintLucia = "LC",
  SaintMartin = "MF",
  SaintPierreAndMiquelon = "PM",
  SaintVincentAndGrenadines = "VC",
  Samoa = "WS",
  SanMarino = "SM",
  SaoTomeAndPrincipe = "ST",
  SaudiArabia = "SA",
  Senegal = "SN",
  Serbia = "RS",
  Seychelles = "SC",
  SierraLeone = "SL",
  Singapore = "SG",
  SintMaarten = "SX",
  Slovakia = "SK",
  Slovenia = "SI",
  SolomonIslands = "SB",
  Somalia = "SO",
  SouthAfrica = "ZA",
  SouthGeorgiaAndSandwichIsl = "GS",
  SouthSudan = "SS",
  Spain = "ES",
  SriLanka = "LK",
  Sudan = "SD",
  Suriname = "SR",
  SvalbardAndJanMayen = "SJ",
  Swaziland = "SZ",
  Sweden = "SE",
  Switzerland = "CH",
  SyrianArabRepublic = "SY",
  Taiwan = "TW",
  Tajikistan = "TJ",
  Tanzania = "TZ",
  Thailand = "TH",
  TimorLeste = "TL",
  Togo = "TG",
  Tokelau = "TK",
  Tonga = "TO",
  TrinidadAndTobago = "TT",
  Tunisia = "TN",
  Turkey = "TR",
  Turkmenistan = "TM",
  TurksAndCaicosIslands = "TC",
  Tuvalu = "TV",
  Uganda = "UG",
  Ukraine = "UA",
  UnitedArabEmirates = "AE",
  UnitedKingdom = "GB",
  UnitedStates = "US",
  UnitedStatesOutlyingIslands = "UM",
  Uruguay = "UY",
  Uzbekistan = "UZ",
  Vanuatu = "VU",
  Venezuela = "VE",
  Vietnam = "VN",
  VirginIslandsBritish = "VG",
  VirginIslandsUS = "VI",
  WallisAndFutuna = "WF",
  WesternSahara = "EH",
  Yemen = "YE",
  Zambia = "ZM",
  Zimbabwe = "ZW",
}

enum ListingType {
  LOCAL_ADULT_ONETIME = "LOCAL_ADULT_ONETIME",
  LOCAL_STUDENT_ONETIME = "LOCAL_STUDENT_ONETIME",
  LOCAL_SENIOR_ONETIME = "LOCAL_SENIOR_ONETIME",
  FOREIGNER_ONETIME = "FOREIGNER_ONETIME",
  ANNUALPASS = "ANNUALPASS",
}

enum ListingStatus {
  ACTIVE = "ACTIVE",
  DISCONTINUED = "DISCONTINUED",
}

enum PaymentStatus {
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
}

enum PaymentType {
  VISA = "VISA",
  MASTERCARD = "MASTERCARD",
  PAYNOW = "PAYNOW",
}

enum OrderStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
}

enum EnclosureStatus {
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  CONSTRUCTING = "CONSTRUCTING",
}

enum HubStatus {
  PENDING = "PENDING",
  DISCONNECTED = "DISCONNECTED",
  CONNECTED = "CONNECTED",
}

export {
  KeeperType,
  PlannerType,
  GeneralStaffType,
  SensorType,
  FacilityType,
  Specialization,
  MedicalSupplyType,
  ConservationStatus,
  Continent,
  GroupSexualDynamic,
  PresentationContainer,
  PresentationMethod,
  PresentationLocation,
  AnimalFeedCategory,
  AnimalGrowthState,
  AnimalSex,
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalStatusType,
  Biome,
  EventType,
  EventTimingType,
  Country,
  ListingType,
  ListingStatus,
  PaymentStatus,
  PaymentType,
  OrderStatus,
  EnclosureStatus,
  HubStatus,
};

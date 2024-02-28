# ZooVanna - Zoo Management System

<img src="https://i.imgur.com/d2nJnQj.png" width="90%">\
Elevate your zoo adventure with ZooVanna — an innovative management system designed to optimize animal care, resource allocation, and visitor engagement.

## Contents

- [System Overview](#system-overview)
  - [ZooVanna Admin Management System](#zoovanna-admin-management-system)
  - [ZooVanna Customer Portal](#zoovanna-customer-portal)
  - [Other Miscellaneous Helper Applications](#other-miscellaneous-helper-applications)
- [ZooVann's Advanced Features](#zoovannas-advanced-features)
- [Tech Stack](#tech-stack)
- [Other Repositories](#other-repositories)
- [How to Deploy ZooVanna](#how-to-deploy-zoovanna)
- [Gallery](#gallery)
- [Our Dev Steps](#our-dev-steps)

## System Overview

ZooVanna is made up of two main front-end application systems that cater to two main stakeholders: Zoo Staff and Zoo Visitors. These applications share a common back-end.

### ZooVanna Admin Management System

The ZooVanna Admin Management System is designed to enable staff around the zoo to more efficiently perform their roles. With ZooVanna, zookeepers can effectively manage their species database, design habitat and enclosures, as well as monitor and care for their animals. ZooVanna also supports management of assets and facilities, zoo crowd monitoring, employing management and rostering, event management, ticketing and sales management. All these functionalities helps zoo holistically manage both their back-office and front-office operations.

### ZooVanna Customer Portal

ZooVanna Customer Portal is in the form of a webpage that customers can access on both their desktop and mobile devices, and focuses on enhancing the customer experience before, during and after their zoo visits. This portal provides crowd control analysis, QR ticketing, a secured payment gateway, itinerary advisory, and more!

### Other Miscellaneous Helper Applications

**Entrance ticket scanner**\
This is a native mobile app that allows zoo staff to scan the QR codes present on zoo tickets, thereby speeding up the customer admission process.

**Internet-of-Things Hubs**\
Multiple IOT hubs are available to facilitate the connection between the main Admin Management System and IOT sensors and devices such as light sensors, temperature sensors and cameras used for crowd monitoring.

## ZooVanna's Advanced Features

- Animal Family Tree and Breeding Recommendation
- Animal Automatic Weight Monitoring
- Smart Feeding Plan Planner
- Enclosure Layout Designing
- Predictive Maintenance for Assets & Facilities
- Smart Employee Rostering
- IOT-Assisted Crowd Monitoring
- Zoo Itinerary Advisory Based on Preferences

## Tech Stack

- **Frontend**: React, TypeScript
- **Backend**: ExpressJS
- **Database**: MySQL
- **Object-Relational Mapping (ORM)**: Sequelize
- **IOT Hubs**: Python

## Other Repositories

- [Backend Server](https://github.com/Qingyi1115/ZooVannaServer)
- [Customer Mobile Application](https://github.com/Qingyi1115/ZooVanna)
- [Ticket Scanner App](https://github.com/Qingyi1115/ZooVannaScanner/)
- [IOT Hubs Server](https://github.com/Qingyi1115/ZooVannaIoTServer/)

## How To Deploy ZooVanna

1. **Database**

- Set up a MySQL server connection and create a local instance of MySQL
- Create a database/schema called "zoovanna"
- Data is automatically seeded by running the server (with .env value RESET_DB set to "True"). No SQL scripts are required.

2. **Server (Common Backend)**

- Create an .env file in the root folder of "ZooVannaServer", and add the following:

```env
MYSQL_PASSWORD=password
RESET_DB=TRUE #True/TRUE/true/1 (false otherwise)
SECRET_KEY=[secretKey]
MYSQL_HOST=[mysqlHostName] #default: localhost
MYSQL_USER=[mysqlUsername] #default: root
MYSQL_DB=[mysqlDatabaseName] #default: zoovanna
MYSQL_DB_PORT=[mysqlPort] #default: 3306

IMG_URL_ROOT = "img/"

EMAIL_USERNAME=[stripeAccountEmailAddress]
EMAIL_PASSWORD=[stripeAccountPassword]

STRIPE_PUBLISHABLE_KEY="[stripePublishableKey]"
STRIPE_SECRET_KEY="[stripeSecretKey]"

LOCALHOST_ADDRESS = "localhost"
```

- Replace `[secretKey]` with anything as your secret key
- Replace `[mysqlHostName]`, `[mysqlUsername]`, `[mysqlDatabaseName]`, and `[mysqlPort]` with your MySQL credentials and information
- Replace `[stripeAccountEmailAddress]`, `[stripeAccountPassword]`, `[stripePublishableKey]`, and `[stripeSecretKey]` with your Stripe account credentials and information
- For the first time running the server, leave the value for RESET_DB as `TRUE`.

- In the root folder of ZooVannaServer, run:

```bash
    npm install
```

- To start the server, run:

```bash
    npm start
```

3. Admin Management System

- In the root folder of ZooVannaAdmin, run:

```bash
    npm install
```

- To start the admin frontend application, run:

```bash
    npm run dev
```

- The application should be hosted at http:localhost:5173
- Open your internet browser (Google Chrome preferred) and go to the aforementioned link.
- Following is the account to be used to log into the admin system:

* Username/Email: marry@gmail.com
* Password: marry_password

4. Customer Portal

- In the root folder of ZooVanna, run:

```bash
    npm install
```

- To start the customer frontend application, run:

```bash
    npm run dev
```

- The application should be hosted at http:localhost:5174
- Open your internet browser (Google Chrome preferred) and go to the aforementioned link. For best experience, use Reponsive Viewport Mode and select any mobile phone layout (e.g., iPhone 12 Pro)

## Gallery

<img src="https://i.imgur.com/XVKuwZA.png" alt="ZooVanna Admin Home Page" width="90%">
<img src="https://i.imgur.com/pvUtakR.png" alt="Animal Lineage Tree" width="90%">
<img src="https://i.imgur.com/bTWzZ4Y.png" alt="Animal Enclosure Diagram" width="90%">
<img src="https://i.imgur.com/YHcsbTE.png" alt="Enclosure Environmental Conditions" width="90%">
<img src="https://i.imgur.com/j827dez.png" alt="Sales Dashboard" width="90%">
<img src="https://i.imgur.com/gUlgqz9.png" alt="Customer Portal Home Page" width="22%">
<img src="https://i.imgur.com/wXj7Sg9.png" alt="Customer Event Info" width="22%">
<img src="https://i.imgur.com/eNjHLIV.png" alt="Customer Zoo Map" width="22%">
<img src="https://i.imgur.com/5wGB2cR.png" alt="Customer Shop Info" width="22%">

# Our Dev Steps

## Setup

1.  Installing packages (express, mysql2, dotenv, sequelize, jsonwebtoken, multer, holtwinters)
    npm install <package>

2.  Installing mysql/workbench and getting my database
    https://dev.mysql.com/downloads/windows/installer/8.0.html
    Create new schema and name it zoovanna

3.  Adding environmental vars
    create file ./.env (github ignore keep ur personal info here)
    follow the format to populate .env, the following setting is compulsory, but others are optional (assuming you did not change any default setting when installing sql)

        MYSQL_PASSWORD=your_password
        RESET_DB=True/TRUE/true/1 (false otherwise)
        SECRET_KEY=anything_works
        EMAIL_USERNAME=zoovannaserver@gmail.com
        EMAIL_PASSWORD=qfiy zmgb ycoa bylw
        IMG_URL_ROOT="img/"

    Other optional env are (with their default values if not stated):

        MYSQL_HOST=localhost
        MYSQL_USER=root
        MYSQL_DB=zoovanna (depends on step 2 schema name)
        MYSQL_DB_PORT=3306

## Creating entities

0.  Import required resources and other entities for example:

        import {DataTypes, Model, InferAttributes, InferCreationAttributes, HasOneGetAssociationMixin, HasOneSetAssociationMixin} from "Sequelize";
        import {conn} from '../db';

1.  Create the model with the example below. You should declare attributes, functions and relationship names.

        class EntityModel extends Model<InferAttributes<EntityModel>, InferCreationAttributes<EntityModel>> {
            <!-- Attributes -->
            declare attribute: <enum | string | number>;

            <!-- Relationships to other models -->
            declare relationship?: <AnotherEntityModel>;

            <!-- Relationships to other models getter and setters (other mixin also possible example create : HasOneCreateAssociationMixin or in has many relationship add or remove looks like this HasManyRemoveAssociationMixin) -->
            declare getRelationship: BelongsToGetAssociationMixin<AnotherEntityModel>;
            declare setRelationship: BelongsToSetAssociationMixin<AnotherEntityModel, number>;

            <!-- Other standard instance methods -->
        }

2.  Create the table using the model. This requires your db connection to specify where (account/server/schema) to create the tables to.
    You will only need to define attributes and not relationships here.
    As relationships require multiple model classes, it will be added to index in the next step!

            EntityModel.init({
                <!-- Add attributes and define column settings such as datatype and column constraints -->
                attribute: {
                    type: DataTypes.BIGINT,
                    autoIncrement: true,
                    primaryKey: true
                },
                attribute_2: {
                    type: DataTypes.STRING,
                },
            }, {
                <!-- Define additional table settings -->
                freezeTableName: true,
                timestamps: true,
                createdAt: true,
                updatedAt: 'updateTimestamp',
                sequelize: conn, // We need to pass the connection instance
                modelName: 'Table_Name' // We need to choose the model name
            });

            <!-- Export your model -->
            export {EntityModel};

3.  Now that you have set the main data columns and table names, we will deal with foreign keys for relationships in database. I hope you remember your database module, and IS2103 relationship types.
    In src/models/index.ts, we will want to append relationships in the createDatabase function!

#### Determining relationship types

First and foremost we will need to define relationships as a one to one, one to many, or many to many relationships.
Read more on https://sequelize.org/docs/v6/core-concepts/assocs/

Next we will decide if we are to use alias "as" option when defining the relationship.

#### Alias

Alias is important for example EntityModel has two groups of Entity_Model_2 relationship.
For example we have two class, module and People, a module has many students, and a module has one prof. We will create two relationship from module to people, but how do we refer to them in the database table?
We know for sure we will create a foreign key from one table to the other table, but in this case each relationship needs their own foreign key references.
This is where aliasing comes in, we will add the "as" attribute to define the name of the relationship.

Relationships should come in pairs. Example:

        Module.hasMany(People, addCascadeOptions({foreignKey: "StudentModuleId", as: "students"}));
        People.belongsTo(Module, addCascadeOptions({foreignKey: "StudentModuleId", as: "learning"}));

        Module.hasMany(People, addCascadeOptions({foreignKey: "ProfModuleId", as: "professor"}));
        People.belongsTo(Module, addCascadeOptions({foreignKey: "ProfModuleId", as: "teaching"}));

Note: many to many relationships has not been implemented as of now. A new table will be required.

4.  Finally we will add additional functionalities for polymorphism
    In the case of inheritance, we have opted for polymorphism, where a single call to getRole will return either the keeper or planningStaff class instance.
    This is not easily done with following the sequelize tutorial in js. Because we are using Typescript which compiler does not see runtime attributes!
    However here is the solution, we implement our own way to do this.

            <!-- In this instance function, we will retrieve all the roles possible and attempt to save the role that we find exist, then we will return the class instance of the role -->
            public async getRole(){
                if (!this.role) {
                    let keeper = await this.getKeeper();
                    if (keeper){
                        this.role = "keeper";
                        return keeper;
                    }
                    let planningStaff = await this.getPlanningStaff();
                    if (planningStaff){
                        this.role = "planningStaff";
                        return planningStaff;
                    }
                    return null;
                }else{
                    <!-- As we can see this method will save the role and in the future only call required method in the future, saving some time -->
                    const mixinMethodName = `get${uppercaseFirst(this.role)}`;
                    // @ts-ignore <!--I have removed this ignore function with another one, but as you can see typescript hates anything that doesn't have strictly defined types and attributes-->
                    return this[mixinMethodName]();
                }
            }

Thank you for reading this tutorial that teaches you how bad sequelize is. Please use a java framework like springboot that supports better ORM like hibernate in the future. Thanks! - Sincerely your tech lead.

## Backend API testing

1. Add .env file with the following settings

SERVER_URL = http://localhost
SERVER_PORT = 3000

2. Run python zooVannaServer_API_test.py

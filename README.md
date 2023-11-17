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

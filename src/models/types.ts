import { Model, ModelStatic, ModelAttributes, ModelOptions } from 'sequelize';

export interface Models {
  User: ModelStatic<Model>;
  UserPhoneNumber: ModelStatic<Model>;
  UserEmail: ModelStatic<Model>;
  Campaign: ModelStatic<Model>;
  Contact: ModelStatic<Model>;
  Message: ModelStatic<Model>;
}

export interface ModelDefinition {
  attributes: ModelAttributes;
  options: ModelOptions;
} 
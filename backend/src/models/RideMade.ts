import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import { RideMadeAttributes } from '../types/RideMade';

export class RideMade extends Model<RideMadeAttributes> implements RideMadeAttributes {
  customer_id!: string;
  origin!: string;
  destination!: string;
  distance!: number;
  duration!: string;
  driver_id!: number;
  driver_name!: string;
  value!: number;
}

RideMade.init(
  {
    customer_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    distance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    driver_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'ride_made', 
    timestamps: false,      
  }
);

export default RideMade;

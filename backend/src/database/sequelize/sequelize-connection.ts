import { Sequelize } from 'sequelize';
import { getConfigOrThrow } from 'src/lib/config-utils';
let sequelizeConnection: Sequelize | null = null;
export const getSequelizeConnection = (): Sequelize => {
  // console.log(DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST);
  if (!sequelizeConnection) {
    const DB_DATABASE = getConfigOrThrow('DB_DATABASE');
    const DB_USERNAME = getConfigOrThrow('DB_USERNAME');
    const DB_PASSWORD = getConfigOrThrow('DB_PASSWORD');
    const DB_HOST = getConfigOrThrow('DB_HOST');
    sequelizeConnection = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
      host: DB_HOST,
      dialect: 'postgres',
      protocol: 'postgres',
      // dialectOptions: {
      //   typeCast: function (field, next) { // for reading from database
      //     console.log("fsdfsfsfsfsfsfsdffsfsd===========");
      //     if (field.type === 'DATETIME') {
      //       return field.string()
      //     }
      //     return next()
      //   },
      // },
      logging: false,
    });
  }

  return sequelizeConnection;
};

import { toCamelCase } from '../../utils/transformCamelCase.js'
import dbPool from '../database.js'
import { USER_QUERIES } from './user.queries.js'

export const findUserByDeviceId = async (deviceId) => {
    const [rows] = await dbPool.query(USER_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]);
    return toCamelCase(rows[0]);
};

export const createUser = async (deviceId) => {
    await dbPool.query(USER_QUERIES.CREATE_USER, [deviceId]);
    return { deviceId };
};

export const updateUserLogin = async (deviceId) => {
    await dbPool.query(USER_QUERIES.UPDATE_USER_LOGIN, [deviceId]);
};

export const updateUserLocation = async (x, y, deviceId) => {
    await dbPool.query(USER_QUERIES.UPDATE_USER_LOCATION, [x, y, deviceId]);
};
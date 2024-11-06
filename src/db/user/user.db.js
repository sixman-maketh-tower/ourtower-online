import { toCamelCase } from '../../utils/transformCamelCase.js'
import dbPool from '../database.js'
import { USER_QUERIES } from './user.queries.js'

export const findUserByAccountId = async (accountId) => {
    const [rows] = await dbPool.query(USER_QUERIES.FIND_USER_BY_ACCOUNT_ID, [accountId]);
    return rows[0];
};

export const createUser = async (accountId, password, email) => {
    await dbPool.query(USER_QUERIES.CREATE_USER, [accountId, password, email]);
    return { accountId };
};

export const updateUserLogin = async (accountId) => {
    await dbPool.query(USER_QUERIES.UPDATE_USER_LOGIN, [accountId]);
};
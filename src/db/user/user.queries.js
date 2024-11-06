export const USER_QUERIES = {
    FIND_USER_BY_ACCOUNT_ID: 'SELECT * FROM user WHERE accountId = ?',
    CREATE_USER: 'INSERT INTO user (accountId, password, email) VALUES (?, ?, ?)',
    UPDATE_USER_LOGIN: 'UPDATE user SET lastLogin = CURRENT_TIMESTAMP WHERE accountId = ?'
}
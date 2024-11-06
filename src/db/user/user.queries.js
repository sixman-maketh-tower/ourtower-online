export const USER_QUERIES = {
    FIND_USER_BY_DEVICE_ID: 'SELECT * FROM user WHERE device+id = ?',
    CREATE_USER: 'INSERT INTO user (device_id) VALUES (?)',
    UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE device_id = ?',
    UPDATE_USER_LOCATION: 'UPDATE user SET x_coord = ?, y_coord = ? WHERE device_id = ?'
}
export const USER_QUERIES = {
    FIND_USER_BY_ACCOUNT_ID: 'SELECT * FROM user WHERE accountId = ?',
    CREATE_USER: 'INSERT INTO user (accountId, password, email) VALUES (?, ?, ?)',
    UPDATE_USER_LOGIN: 'UPDATE user SET lastLogin = CURRENT_TIMESTAMP WHERE accountId = ?',
    FIND_HIGHSCORE_BY_USER_ID: 'SELECT highScore FROM score WHERE userId = ?',
    CREATE_HIGHSCORE: 'INSERT INTO score (userId, highScore) VALUES (?, ?)',
    UPDATE_HIGHSCORE: 'UPDATE score SET highScore = ? WHERE userId = ?'
};
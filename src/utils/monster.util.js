import { getAttackedBase } from "../session/monster.session.js"

export const getTotalAttackedDamage = (userId) => {
    let gameDamage = 0;
    const damageData = getAttackedBase(userId);
    damageData.forEach((list) => gameDamage += list.damage);

    return gameDamage;
}
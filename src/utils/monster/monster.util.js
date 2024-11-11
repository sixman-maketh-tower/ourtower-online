import { getAttackedBase } from "../../models/monster.model.js"

export const getTotalAttackedDamage = (userId) => {
    let gameDamage = 0;
    const damageData = getAttackedBase(userId);
    damageData.forEach((list) => gameDamage += list.damage);

    return gameDamage;
}
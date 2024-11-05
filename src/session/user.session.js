import User from '../classes/models/user.class.js';
import { userSessions } from './session.js';

// 유저를 생성하고 userSessions에 추가하는 함수
export const addUser = (socket, id) => {
  const user = new User(id, socket);
  userSessions.push(user);
  return user;
};

// 유저를 userSessions에서 제거하는 함수
export const removeUser = (socket) => {
  const userIndex = userSessions.findIndex((user) => user.socket === socket);
  if (userIndex !== -1) {
    return userSessions.splice(userIndex, 1)[0];
  }
};

// 유저를 userSessions에서 id로 찾는 함수
export const getUserById = (id) => {
  return userSessions.find((user) => user.id === id);
};

// 유저를 userSessions에서 socket으로 찾는 함수
export const getUserBySocket = (socket) => {
  const user = userSessions.find((user) => user.socket === socket);
  return user;
};

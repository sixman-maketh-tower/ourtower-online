const loginHandler = async ({ socket, userId, payload }) => {
  const { id, password } = payload;

  const loginResponse = createResponse(packetType);
};

export default loginHandler;

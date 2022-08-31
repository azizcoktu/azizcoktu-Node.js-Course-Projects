const generateMessage = (text, username = "System Bot") => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};
module.exports = {
  generateMessage,
};

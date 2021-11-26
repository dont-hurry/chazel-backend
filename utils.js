function getCurrentTimeString() {
  const date = new Date();
  const joinedString = [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((value) => (value < 10 ? "0" + value : value))
    .join(":");

  return `[${joinedString}]`;
}

module.exports = {
  getCurrentTimeString,
};

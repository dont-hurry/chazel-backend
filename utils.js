function getCurrentTimeString() {
  const date = new Date();
  const joinedString = [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((value) => (value < 10 ? "0" + value : value))
    .join(":");

  return `[${joinedString}]`;
}

function generateId() {
  return new Array(12)
    .fill(null)
    .map(() => {
      let rand = Math.floor(Math.random() * 36);

      if (rand < 10) {
        // 0 - 9
        return String.fromCodePoint(rand + 48);
      } else {
        // 10 - 35
        return String.fromCodePoint(rand + 87);
      }
    })
    .join("");
}

module.exports = {
  getCurrentTimeString,
  generateId,
};

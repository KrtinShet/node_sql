module.exports = (fn) => (...args) => {
  fn(...args).catch(args[args.length - 1]);
};

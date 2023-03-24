export const sleep = (ms): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

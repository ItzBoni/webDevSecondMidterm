exports.safeResponse = async (promise) =>{
    async function safeRequest(promise) {
  try {
    const res = await promise;
    return [res, null];
  } catch (err) {
    return [null, err];
  }
}
}
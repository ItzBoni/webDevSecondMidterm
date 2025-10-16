exports.safeResponse = async (promise) =>{
  try {
    const res = await promise;
    return [res, null];
  } catch (err) {
    return [null, err];
  }
}

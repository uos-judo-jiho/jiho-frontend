export async function fetchData(getApi: any, setState: any) {
  try {
    const result = await getApi();

    // const data = result.find((newsjson) => newsjson.year === id);
    setState(result);
  } catch (error) {
    console.error(error);
  }
}

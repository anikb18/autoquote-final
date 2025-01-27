export async function fetchCars() {
  try {
    const response = (
      await fetch(
        "https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?model=supra",
        {
          headers: {
            "X-RapidAPI-Key":
              "979015f2femsh9e2e1e9106c00cap11f09ajsn78da3339b575",
            "X-RapidAPI-Host": "cars-by-api-ninjas.p.rapidapi.com",
          },
        },
      )
    ).json();
    return response;
  } catch (error) {
    console.error(error);
  }
}

export const createCarImage = (car: any, angle?: string) => {
  const url = new URL("https://cdn.imagin.studio/getimage");

  const { make, year, model } = car;

  url.searchParams.append("customer", "hrjavascript-mastery");
  url.searchParams.append("zoomType", "fullscreen");
  url.searchParams.append("paintdescription", "radiant-green");
  url.searchParams.append("modelFamily", model.split(" ")[0]);
  url.searchParams.append("make", make);
  url.searchParams.append("modelYear", `${year}`);
  url.searchParams.append("angle", `${angle}`);

  return `${url}`;
};

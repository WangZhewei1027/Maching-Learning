async function requestLSD(method, path, parametersOrCb, cb) {
  if (!local_sd_api) {
    throw "local_sd_api is not set";
  }

  let options = {
    method: method,
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };
  if (parametersOrCb && typeof parametersOrCb != "function") {
    options.body = JSON.stringify(parametersOrCb);
  }

  let res;
  try {
    res = await fetch(local_sd_api + path, options);
  } catch (e) {
    console.error(
      "There was an error communicating to the Replicate API proxy. Is it offline?"
    );
  }

  let data;
  if (res && res.ok) {
    data = await res.json();
  } else if (res && !res.ok) {
    let message =
      "The Local SD API proxy returned an error with response code " +
      res.status;
    try {
      let error = await res.json();
      if (error && error.detail) {
        message += ": " + error.detail;
      }
    } catch (e) {}
    console.error(message);
  }

  if (typeof parametersOrCb == "function") {
    parametersOrCb(data);
  } else if (typeof cb == "function") {
    cb(data, parametersOrCb);
  }
  return data;
}

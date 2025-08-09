export function getNowLocation(
  opts: PositionOptions = { enableHighAccuracy: true, timeout: 5000 }
) {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if (!("geolocation" in navigator))
      return reject(new Error("geolocation 없음"));
    navigator.geolocation.getCurrentPosition(resolve, reject, opts);
  });
}

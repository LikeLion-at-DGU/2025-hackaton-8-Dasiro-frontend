export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const kakao = (window as any).kakao;
    if (!kakao?.maps?.services?.Geocoder) {
      return reject(new Error("Kakao Maps services.Geocoder 없음"));
    }

    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(lng, lat, (result: any, status: any) => {
      if (status === kakao.maps.services.Status.OK && result?.[0]?.address) {
        resolve(result[0].address.address_name);
      } else {
        resolve(null);
      }
    });
  });
}

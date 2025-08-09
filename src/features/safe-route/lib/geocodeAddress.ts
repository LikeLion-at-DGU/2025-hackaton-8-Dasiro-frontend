export async function geocodeAddress(query: string) {
  return new Promise<{ lat: number; lng: number } | null>((resolve, reject) => {
    const kakao = (window as any).kakao;
    if (!kakao?.maps?.services?.Geocoder) {
      return reject(new Error("Geocoder 없음"));
    }
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(query, (res: any[], status: string) => {
      if (status === kakao.maps.services.Status.OK && res?.[0]) {
        resolve({ lat: +res[0].y, lng: +res[0].x });
      } else {
        resolve(null);
      }
    });
  });
}

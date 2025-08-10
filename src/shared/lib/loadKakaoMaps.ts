let mapsReady: Promise<void> | null = null;

export function loadKakaoMaps(
  appKey: string,
  libs: string[] = ["services"]
): Promise<void> {
  if (typeof window !== "undefined" && (window as any).kakao?.maps) {
    return Promise.resolve();
  }

  if (mapsReady) return mapsReady;

  mapsReady = new Promise<void>((resolve, reject) => {
    const SCRIPT_ID = "kakao-maps-sdk";
    const existing = document.getElementById(
      SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", onLoaded);
      existing.addEventListener("error", onFailed);
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=${libs.join(
      ","
    )}`;

    script.addEventListener("load", onLoaded);
    script.addEventListener("error", onFailed);

    document.head.appendChild(script);

    function onLoaded() {
      const kakao = (window as any).kakao;
      if (!kakao?.maps) {
        reject(
          new Error("[KakaoMaps] SDK loaded but window.kakao.maps is missing")
        );
        return;
      }

      kakao.maps.load(() => resolve());
    }

    function onFailed() {
      reject(new Error("[KakaoMaps] Failed to load SDK script"));
    }
  });

  return mapsReady;
}

import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div style={{ textAlign: "center", margin: "16px 0" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="SEU_ID"
        data-ad-slot="SEU_SLOT"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
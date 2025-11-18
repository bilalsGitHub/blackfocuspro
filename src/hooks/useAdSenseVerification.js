import { useEffect } from "react";
import { Platform } from "react-native";

/**
 * Hook to ensure Google AdSense meta tag is present on every screen
 * Call this in every screen component to guarantee AdSense verification
 */
export const useAdSenseVerification = () => {
  useEffect(() => {
    if (Platform.OS === "web") {
      // Check if meta tag already exists
      const existingMeta = document.querySelector(
        'meta[name="google-adsense-account"]'
      );

      if (!existingMeta) {
        const meta = document.createElement("meta");
        meta.name = "google-adsense-account";
        meta.content = "ca-pub-3388307743726055";
        document.head.appendChild(meta);
      }

      // Check if AdSense script already exists
      const existingScript = document.querySelector(
        'script[src*="adsbygoogle.js"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");
        script.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3388307743726055";
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
    }
  }, []);
};

import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "../fonts/Inter.woff2",
      style: "normal",
    },
    {
      path: "../fonts/Inter-Italic.woff2",
      style: "italic",
    },
  ],
});

export const abhayalibre = localFont({
  src: [
    {
      path: "../fonts/AbhayaLibre-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../fonts/AbhayaLibre-Medium.woff2",
      style: "normal",
      weight: "500",
    },
    {
      path: "../fonts/AbhayaLibre-SemiBold.woff2",
      style: "normal",
      weight: "600",
    },
    {
      path: "../fonts/AbhayaLibre-Bold.woff2",
      style: "normal",
      weight: "700",
    },
    {
      path: "../fonts/AbhayaLibre-ExtraBold.woff2",
      style: "normal",
      weight: "800",
    },
  ],
});

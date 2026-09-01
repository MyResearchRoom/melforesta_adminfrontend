import { useContext, useEffect } from "react";
import HeaderContext from "../context/headercontext";

export default function useHeader(title) {
  const { setHeader } = useContext(HeaderContext);

  useEffect(() => {
    if (setHeader && title) {
      setHeader(title);
    }
  }, [setHeader, title]);
}

import { Link } from "expo-router";

export function DisablePreviewMode() {
//   const [show, setShow] = useState(false);
//   useEffect(() => {
//     setShow(window === window.parent && !window.opener);
//   }, []);

  return <Link href="/preview-mode/disable">Disable Preview Mode</Link>;
}
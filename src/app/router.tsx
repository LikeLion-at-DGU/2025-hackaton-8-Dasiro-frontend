import { createBrowserRouter } from "react-router-dom";

//layouts
import DefaultLayout from "src/shared/layouts/DefaultLayout";
import SinkholePage from "@pages/SinkholePage";
import RecoveryPage from "@pages/RecoveryPage";
import SafeRoutePage from "@pages/SafeRoutePage";
import OnboardingPage from "@pages/OnboardingPage";
import CitizenIntro from "@pages/CitizenIntroPage";
// import CitizenInfo from "@pages/CitizenInfoPage";
import CitizenReport from "@pages/CitizenReportPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      { path: "/sinkhole", element: <SinkholePage /> },
      { path: "/", element: <RecoveryPage /> },
      { path: "/safeRoute", element: <SafeRoutePage /> },
      { path: "/onboard", element: <OnboardingPage /> },
      { path: "/citizenIntro", element: <CitizenIntro /> },
      // { path: "/citizenInfo", element: <CitizenInfo /> },
      { path: "/citizenReport", element: <CitizenReport /> },
    ],
  },
]);

export default router;

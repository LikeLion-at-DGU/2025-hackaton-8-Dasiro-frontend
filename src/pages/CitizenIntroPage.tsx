import BotIntro from "@features/citizen-report/ui/intro/BotIntro";
import IntroBtn from "@features/citizen-report/ui/intro/IntroBtn";
import CitizenLayout from "@shared/ui/CitizenLayout";
import { useNavigate } from "react-router-dom";

const CitizenIntro = () => {
  const navigate = useNavigate();

  return (
    <>
      <CitizenLayout onClose={() => navigate(-1)}>
        <BotIntro />
        <IntroBtn
          onClickReport={() => navigate("/citizenReport")}
          onClickInfo={() => navigate("/citizenInfo")}
        />
      </CitizenLayout>
    </>
  );
};

export default CitizenIntro;

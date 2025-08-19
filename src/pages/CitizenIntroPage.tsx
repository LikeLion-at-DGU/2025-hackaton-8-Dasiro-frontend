import BotIntro from "@features/citizen-report/ui/intro/BotIntro";
import IntroBtn from "@features/citizen-report/ui/intro/IntroBtn";
import CitizenLayout from "@shared/ui/CitizenLayout";

const CitizenIntro = () => {
  return (
    <>
      <CitizenLayout>
        <BotIntro />
        <IntroBtn />
      </CitizenLayout>
    </>
  );
};

export default CitizenIntro;

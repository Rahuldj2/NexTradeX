// components/CustomStepper.js

import React from "react";
import { Stepper, Step, Button } from "@material-tailwind/react";
import { CurrencyDollarIcon, PlusCircleIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

const CustomStepper = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  return (
    <div className="w-full py-4 px-8">
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        <Step onClick={() => setActiveStep(0)}>
          <CurrencyDollarIcon className="h-5 w-5" />
        </Step>
        <Step onClick={() => setActiveStep(1)}>
          <PlusCircleIcon className="h-5 w-5" />
        </Step>
        <Step onClick={() => setActiveStep(2)}>
          <ShoppingCartIcon className="h-5 w-5" />
        </Step>
      </Stepper>
      <div className="mt-16 flex justify-between">
        <Button onClick={handlePrev} disabled={isFirstStep}>
          Prev
        </Button>
        <Button onClick={handleNext} disabled={isLastStep}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default CustomStepper;

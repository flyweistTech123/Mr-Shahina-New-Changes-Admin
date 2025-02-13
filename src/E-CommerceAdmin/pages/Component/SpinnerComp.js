/** @format */
import { PulseLoader  } from "react-spinners";

const SpinnerComp = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <PulseLoader  color="#042B26" height={20} width={2} />
    </div>
  );
};

export default SpinnerComp;

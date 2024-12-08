"use client";

import { useAuth } from "@/hooks/useAuth";
import SignIn from "./SignIn";
import Verify from "./Verify";

function State() {
  const { step } = useAuth();
  return (
    <>
      {step === "login" && <SignIn />}
      {step === "verify" && <Verify />}
    </>
  );
}

export default State;

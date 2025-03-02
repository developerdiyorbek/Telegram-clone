"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

function Social() {
  const [isLoading, setIsLoading] = useState(false);

  const onSignIn = (provider: string) => {
    setIsLoading(true);
    signIn(provider, { callbackUrl: "/" });
    setIsLoading(false);
  };

  return (
    <section className="grid grid-cols-2 w-full gap-1">
      <Button variant={"outline"}>
        <span>Sign up with google</span>
        <FaGoogle />
      </Button>
      <Button
        variant={"secondary"}
        disabled={isLoading}
        onClick={() => onSignIn("github")}
      >
        <span>Sign up with github</span>
        <FaGithub />
      </Button>
    </section>
  );
}

export default Social;

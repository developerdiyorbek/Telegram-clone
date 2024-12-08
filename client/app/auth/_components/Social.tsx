import { Button } from "@/components/ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";

function Social() {
  return (
    <section className="grid grid-cols-2 w-full gap-1">
      <Button variant={"outline"}>
        <span>Sign up with google</span>
        <FaGoogle />
      </Button>
      <Button variant={"secondary"}>
        <span>Sign up with github</span>
        <FaGithub />
      </Button>
    </section>
  );
}

export default Social;

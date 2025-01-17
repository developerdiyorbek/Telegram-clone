import { FaTelegram } from "react-icons/fa";
import State from "./_components/State";
import Social from "./_components/Social";
import { ModeToggle } from "@/components/shared/ToggleMode";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

async function Page() {
  const session = await getServerSession(authOptions);
  if (session) return redirect("/");

  return (
    <main className="container mx-auto max-w-md w-full h-screen flex justify-center items-center flex-col space-y-4">
      <FaTelegram size={120} className="text-blue-500" />
      <div className="flex items-center gap-2">
        <h1 className="text-4xl font-bold">Telegram</h1>
        <ModeToggle />
      </div>
      <State />
      <Social />
    </main>
  );
}

export default Page;

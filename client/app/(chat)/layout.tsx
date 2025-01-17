import { authOptions } from "@/lib/authOptions";
import { ChildProps } from "@/types";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function Layout({ children }: ChildProps) {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/auth");

  return <>{children}</>;
}

export default Layout;

import { redirect } from "next/navigation";

// "/" has no page of its own: send admins to the login screen
export default function Home() {
  redirect("/login");
}

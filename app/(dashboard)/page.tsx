import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

//Components
import Header from "./_components/Header";
import CollectionList from "./_components/CollectionList";

const Home = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  return (
    <>
      <Header firstName={user.firstName!} lastName={user.lastName!} />
      <CollectionList userId={user.id!} />
    </>
  );
};

export default Home;

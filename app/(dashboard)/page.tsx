import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import CollectionForm from "@/components/forms/CollectionForm";
import { SadFace } from "@/components/shared/Icons";

import { getCollections } from "@/lib/actions/collection.action";
import CollectionCard from "@/components/cards/CollectionCard";

const Home = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const collections = await getCollections(user.id);
  return (
    <>
      <div className="w-full mb-4 min-[420px]:mb-8 flex">
        <h1 className="text-2xl sm:text-3xl md::text-4xl">
          <span className="font-bold">Welcome</span>, <br /> {user.firstName}{" "}
          {user.lastName}
        </h1>
      </div>
      {collections.length === 0 ? (
        <div className="flex flex-col gap-5">
          <Alert className="flex items-center">
            <SadFace />
            <div className="flex flex-col justify-between">
              <AlertTitle className="px-2 pt-1 text-lg">
                There are no collections yet!
              </AlertTitle>
              <AlertDescription className="px-2 text-base font-light">
                Create a collection to get started.
              </AlertDescription>
            </div>
          </Alert>
          <CollectionForm userId={user.id} />
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:gap-4">
          <CollectionForm userId={user.id} />
          {collections.map((collection, index) => (
            <CollectionCard
              key={index}
              collection={collection}
              userId={user.id}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Home;

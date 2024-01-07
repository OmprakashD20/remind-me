import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CollectionSheet from "@/components/shared/CollectionSheet";

import { SadFace } from "./Icons";

import { getCollection } from "@/lib/actions/collection.action";

const CollectionList = async ({ userId }: { userId: string }) => {
  const collection = await getCollection(userId);
  return collection.length === 0 ? (
    <div className="flex flex-col gap-5">
      <Alert className="flex items-center">
        <SadFace />
        <div className="flex flex-col justify-between">
          <AlertTitle className="px-2 pt-1 text-xl">There are no collections yet!</AlertTitle>
          <AlertDescription className="px-2 text-lg font-light">
            Create a collection to get started.
          </AlertDescription>
        </div>
      </Alert>
      <CollectionSheet userId={userId} />
    </div>
  ) : (
    <>
      <CollectionSheet userId={userId} />
      <div>Collection: {collection.length}</div>
    </>
  );
};

export default CollectionList;

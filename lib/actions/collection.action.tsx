"use server";

import prisma from "../prisma";

import { revalidatePath } from "next/cache";

import { CollectionSchemaType } from "@/validations/collectionSchema";

type CreateCollectionParams = {
  collectionDetails: CollectionSchemaType;
  userId: string;
  path: string;
};

//Create Collection
export const createCollection = async ({
  collectionDetails,
  userId,
  path,
}: CreateCollectionParams) => {
  try {
    const collection = await prisma.collection.create({
      data: {
        ...collectionDetails,
        userId,
      },
    });
    revalidatePath(path);
    return collection;
  } catch (error: any) {
    throw new Error(`Failed to create collection: ${error.message}`);
  }
};

//Get Collection
export const getCollections = async (userId: string) => {
  try {
    const collection = await prisma.collection.findMany({
      where: {
        userId: userId,
      },
      include: {
        tasks: true,
      },
    });
    return collection;
  } catch (error: any) {
    throw new Error(`Failed to get user's collection: ${error.message}`);
  }
};

//Delete Collection
export const deleteCollection = async (collectionId: string, path: string) => {
  try {
    await prisma.collection.delete({
      where: {
        id: collectionId,
      },
    });
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete collection: ${error.message}`);
  }
};

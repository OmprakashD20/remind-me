"use server";

import prisma from "../prisma";

import { revalidatePath } from "next/cache";

import { TaskSchemaType } from "@/validations/taskSchema";

type CreateTaskParams = {
  taskDetails: TaskSchemaType;
  userId: string;
  path: string;
};

type UpdateTaskStatusParams = {
  taskId: string;
  status: boolean;
  path: string;
};

export const createTask = async ({
  taskDetails,
  userId,
  path,
}: CreateTaskParams) => {
  const { name, description, collectionId, expiresAt } = taskDetails;
  try {
    const task = await prisma.task.create({
      data: {
        name,
        description,
        expiresAt,
        userId,
        collection: {
          connect: {
            id: collectionId,
          },
        },
      },
    });
    revalidatePath(path);
    return task;
  } catch (error: any) {
    throw new Error(`Error creating the task: ${error.message}`);
  }
};

export const setTaskStatus = async ({
  taskId,
  status,
  path,
}: UpdateTaskStatusParams) => {
  try {
    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        done: status,
      },
    });
    revalidatePath(path);
    return task;
  } catch (error: any) {
    throw new Error(`Failed to update task status: ${error.message}`);
  }
};

export const deleteTask = async (taskId: string, path: string) => {
  try {
    const task = await prisma.task.delete({
      where: {
        id: taskId,
      },
    });
    revalidatePath(path);
    return task;
  } catch (error: any) {
    throw new Error(`Failed to delete task: ${error.message}`);
  }
};

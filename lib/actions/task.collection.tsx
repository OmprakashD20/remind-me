"use server";

import prisma from "../prisma";
import { Task } from "@prisma/client";

import { revalidatePath } from "next/cache";

import { TaskSchemaType } from "@/validations/taskSchema";

type CreateTaskParams = {
  taskDetails: TaskSchemaType;
  userId: string;
  path: string;
};

type SetStatusParams = {
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

export const updateTask = async (task: Task, path: string) => {
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        name: task.name,
        description: task.description,
        expiresAt: task.expiresAt,
      },
    });
    revalidatePath(path);
    return updatedTask;
  } catch (error: any) {
    throw new Error(`Error updating the task: ${error.message}`);
  }
};

export const setTaskStatus = async ({
  taskId,
  status,
  path,
}: SetStatusParams) => {
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

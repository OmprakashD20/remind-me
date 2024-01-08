"use client";
import { Task } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { CollectionColors, CollectionColor } from "@/lib/constants";
import { deleteTask, setTaskStatus } from "@/lib/actions/task.collection";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons";

const getExpirationColor = (expiresAt: Date) => {
  const days = Math.floor(expiresAt.getTime() - Date.now()) / 1000 / 60 / 60;

  if (days < 0) return "text-gray-300 dark:text-gray-400";

  if (days <= 3 * 24) return "text-red-500 dark:text-red-400";
  if (days <= 7 * 24) return "text-orange-500 dark:text-orange-400";
  return "text-gree-500 dark:text-green-400";
};

interface Props {
  task: Task;
  collectionColor: CollectionColor;
}

function TaskCard({ task, collectionColor }: Props) {
  const [isMarkingStatus, startMarkingStatus] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  //Toast
  const { toast } = useToast();

  const handleCheck = async () => {
    try {
      await setTaskStatus({
        taskId: task.id,
        status: !task.done,
        path,
      });
      toast({
        title: "Success",
        description: `Task marked as ${task.done ? "undone" : "done"}!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to mark task as done!",
        variant: "destructive",
      });
      console.log(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id, path);
      {
        !isDeleting &&
          toast({
            title: "Success",
            description: "Task deleted successfully!",
          });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Cannot delete task",
        variant: "destructive",
      });
      console.log(error.message);
    }
  };

  //Pathname
  const path = usePathname();

  return (
    <div className="flex items-center justify-between gap-2">
      <Checkbox
        id={task.id}
        className="w-5 h-5"
        checked={task.done}
        disabled={isMarkingStatus}
        onCheckedChange={() => startMarkingStatus(handleCheck)}
      />
      <label
        htmlFor={task.id}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 decoration-1 dark:decoration-white px-2 flex-1",
          task.done && "line-through"
        )}
      >
        {task.name}
        {task.expiresAt && (
          <p
            className={cn(
              "text-xs text-neutral-500 dark:text-neutral-400 pt-2",
              getExpirationColor(task.expiresAt)
            )}
          >
            {format(task.expiresAt, "dd/MM/yyyy")}
          </p>
        )}
      </label>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(CollectionColors[collectionColor], "text-white")}
          >
            View
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle
              className={cn(
                "bg-clip-text text-transparent",
                CollectionColors[collectionColor]
              )}
            >
              {task.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <DialogDescription>
                <p className="text-base text-neutral-500 dark:text-neutral-400">
                  {task.description}
                </p>
              </DialogDescription>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              {task.expiresAt && (
                <p
                  className={cn(
                    "text-xs text-neutral-500 dark:text-neutral-400 pt-2",
                    getExpirationColor(task.expiresAt)
                  )}
                >
                  {format(task.expiresAt, "dd/MM/yyyy")}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant={"outline"}
                className={cn(CollectionColors[collectionColor], "text-white")}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isDeleting ? (
        <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size={"icon"} variant={"ghost"}>
              <TrashIcon height={20} width={20} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              task.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className={cn(
                  "dark:text-white",
                  CollectionColors[collectionColor]
                )}
                onClick={() => startDeleting(() => handleDelete())}
              >
                Proceed
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export default TaskCard;

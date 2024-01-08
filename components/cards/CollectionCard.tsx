"use client";

import { Collection, Task } from "@prisma/client";
import { useMemo, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import {
  CaretDownIcon,
  CaretUpIcon,
  TrashIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { deleteCollection } from "@/lib/actions/collection.action";

import { Plus } from "@/components/shared/Icons";

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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

import TaskForm from "@/components/forms/TaskForm";
import TaskCard from "@/components/cards/TaskCard";

interface Props {
  collection: Collection & {
    tasks: Task[];
  };
  userId: string;
}

const CollectionCard = ({ collection, userId }: Props) => {
  const [isDeleting, startDeleting] = useTransition();

  //Task
  const tasks = collection.tasks;
  const taskDone = useMemo(
    () => tasks.filter((task) => task.done).length,
    [tasks]
  );
  const taskTotal = useMemo(() => tasks.length, [tasks]);
  const progress = useMemo(
    () => (taskDone / taskTotal) * 100,
    [taskDone, taskTotal]
  );

  //Collapsible state
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpand = (expand: boolean) => {
    setIsExpanded(expand);
  };

  //Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = (open: boolean) => {
    setIsModalOpen(open);
  };

  //Toast
  const { toast } = useToast();

  //Pathname
  const path = usePathname();

  const handleDelete = async () => {
    try {
      await deleteCollection(collection.id, path);
      {
        !isDeleting &&
          toast({
            title: "Success",
            description: "Collection deleted successfully!",
          });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Cannot delete collection",
        variant: "destructive",
      });
      console.log(error.message);
    }
  };
  return (
    <>
      <TaskForm
        open={isModalOpen}
        setOpen={handleModalOpen}
        collection={collection}
        userId={userId}
      />
      <Collapsible open={isExpanded} onOpenChange={handleExpand}>
        <CollapsibleTrigger asChild>
          <Button
            variant={"ghost"}
            className={cn(
              "w-full flex justify-between p-6",
              isExpanded && "rounded-b-none",
              CollectionColors[collection.color as CollectionColor]
            )}
          >
            <span className="text-white font-medium tracking-wide text-base">
              {collection.name}
            </span>
            {!isExpanded && <CaretDownIcon className="h-6 w-6" />}
            {isExpanded && <CaretUpIcon className="h-6 w-6" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex rounded-b-md flex-col dark:bg-neutral-900 shadow-lg">
          {tasks.length !== 0 ? (
            <>
              <Progress className={cn("rounded-none")} value={progress} />
              <div className="p-4 gap-3 flex flex-col">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} collection={collection} />
                ))}
              </div>
            </>
          ) : (
            <Button
              variant={"ghost"}
              className="flex items-center justify-center gap-1 p-8 py-12 rounded-none"
              onClick={() => handleModalOpen(true)}
            >
              <p>There are no tasks yet:</p>
              <span
                className={cn(
                  "text-sm bg-clip-text text-transparent",
                  CollectionColors[collection.color as CollectionColor]
                )}
              >
                Create one
              </span>
            </Button>
          )}
          <Separator />
          <footer className="h-[40px] px-4 p-[2px] text-xs text-neutral-500 flex justify-between items-center">
            <p>Created at {collection.createdAt.toLocaleDateString("en-US")}</p>
            {isDeleting ? (
              <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
            ) : (
              <div className="flex">
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  onClick={() => handleModalOpen(true)}
                >
                  <Plus />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size={"icon"} variant={"ghost"}>
                      <TrashIcon height={20} width={20} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your collection and all tasks inside it.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className={cn(
                          "dark:text-white",
                          CollectionColors[collection.color as CollectionColor]
                        )}
                        onClick={() => startDeleting(() => handleDelete())}
                      >
                        Proceed
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </footer>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};

export default CollectionCard;

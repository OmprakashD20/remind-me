"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";

import { cn } from "@/lib/utils";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { createCollection } from "@/lib/actions/collection.action";

import {
  CollectionSchema,
  CollectionSchemaType,
} from "@/validations/collectionSchema";
import { Separator } from "../ui/separator";

const CollectionForm = ({ userId }: { userId: string }) => {
  //Sheet state
  const [open, setOpen] = useState(false);
  const handleSheetOpen = (open: boolean) => {
    setOpen(open);
    form.reset();
  };

  //Toast
  const { toast } = useToast();

  //Pathname
  const path = usePathname();

  //Collection form
  const form = useForm<CollectionSchemaType>({
    resolver: zodResolver(CollectionSchema),
    defaultValues: {},
  });

  const handleSubmit = async (values: CollectionSchemaType) => {
    try {
      handleSheetOpen(false);
      await createCollection({ collectionDetails: values, userId, path });
      toast({
        title: "Success",
        description: "Collection created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create collection!",
        variant: "destructive",
      });
      console.log(error.message);
    }
  };

  return (
    <div className="w-full rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-px">
      <Button
        variant={"outline"}
        className="w-full bg-white dark:bg-neutral-950 dark:text-white"
        onClick={() => handleSheetOpen(true)}
      >
        <span className="bg-gradient-to-r from-red-500 to-orange-500 hover:to-orange-800 bg-clip-text text-transparent">
          Create Collection
        </span>
      </Button>
      <Sheet open={open} onOpenChange={handleSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add new collection</SheetTitle>
            <SheetDescription>
              Collection are a great way to organize your reminders.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 flex flex-col mt-3"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Personal" {...field} />
                    </FormControl>
                    <FormDescription>Collection name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Select onValueChange={(color) => field.onChange(color)}>
                        <SelectTrigger
                          className={cn(
                            "w-full h-8",
                            CollectionColors[field.value as CollectionColor]
                          )}
                        >
                          <SelectValue
                            placeholder="Color"
                            className="w-full h-8"
                          />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {Object.keys(CollectionColors).map((color) => (
                            <SelectItem
                              key={color}
                              value={color}
                              className={cn(
                                `w-full h-8 rounded-md my-1 text-white focus:text-white focus:font-bold focus:ring-2 ring-neutral-600 focus:ring-inset dark:focus:ring-white`,
                                CollectionColors[color as CollectionColor]
                              )}
                            >
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select a color for your collection
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <div className="flex flex-col gap-3 mt-4">
            <Separator />
            <Button
              disabled={form.formState.isSubmitting}
              variant={"outline"}
              className={cn(
                form.watch("color") &&
                  CollectionColors[form.getValues("color") as CollectionColor]
              )}
              onClick={form.handleSubmit(handleSubmit)}
            >
              Confirm
              {form.formState.isSubmitting && (
                <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CollectionForm;

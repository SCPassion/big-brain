"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import LoadingButton from "@/components/LoadingButton";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

const formSchema = z.object({
  text: z.string().min(2),
});

const notify = () =>
  toast("Note created successfully!", {
    position: "bottom-right",
    duration: 1500,
    style: {
      background: "blue",
      color: "#fff",
    },
    iconTheme: {
      primary: "#4CAF50",
      secondary: "#fff",
    },
  });

export default function CreateNoteForm({
  onNoteCreated,
}: {
  onNoteCreated: () => void;
}) {
  const createNote = useMutation(api.notes.createNote);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createNote({
      text: values.text,
    });

    notify();
    onNoteCreated();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Textarea rows={8} placeholder="Your note" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          isLoading={form.formState.isSubmitting}
          loadingText="Creating..."
        >
          Create
        </LoadingButton>
      </form>
    </Form>
  );
}

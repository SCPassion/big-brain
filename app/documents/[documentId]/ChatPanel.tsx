"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";

export default function ChatPanel() {
  async function handleAction(formData: FormData) {
    const text = formData.get("text");
    console.log("Form submitted with data:", text);
  }
  return (
    <div className="w-[300px] bg-gray-900 flex flex-col gap-2 p-4">
      <div className="overflow-y-auto h-[350px]">
        <div className="p-4">cdsadas</div>
        <div className="p-4">cdsadas</div>
        <div className="p-4">cdsadas</div>
        <div className="p-4">cdsadas</div>
        <div className="p-4">cdsadas</div>
        <div className="p-4">cdsadas</div>
        <div className="p-4">cdsadas</div>
        <div className="p-4">cdsadas</div>
        <div className="p-4">cdsadas</div>
        <div className="p-4">cdsadas</div>
        <div className="p-4">cdsadas</div>
        <div className="p-4">cdsadas</div>
        <div className="p-4">cdsadas</div>
      </div>

      <div className="flex gap-1">
        <form action={handleAction}>
          <Input name="text" required />
          <Button>Submit</Button>
        </form>
      </div>
    </div>
  );
}

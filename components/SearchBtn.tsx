"use client";

import React from "react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

export default function SearchBtn() {
  const { pending } = useFormStatus();

  return <Button disabled={pending}>Search</Button>;
}

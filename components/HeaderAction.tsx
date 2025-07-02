"use client";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
// This import tells what to show when the user is authenticated, unauthenticated, or when the auth state is loading.
export default function HeaderAction() {
  return (
    <>
      <Authenticated>
        <UserButton />
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <AuthLoading>Loading...</AuthLoading>
    </>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { Button } from "~/app/_components/ui/button";
import {
  Field,
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/app/_components/ui/field";
import { Input } from "~/app/_components/ui/input";

export default function SignUpPageClient() {
        

  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-12 p-6">
      <form>
        <FieldSet>
          <FieldLegend>Sign Up</FieldLegend>
          <FieldDescription>Create your account on Mindmate</FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Password</FieldLabel>
              <Input id="password" type="password" />
            </Field>
          </FieldGroup>
        </FieldSet>
        <Button type="submit" className="mt-6 w-full">
          Sign Up
        </Button>
      </form>
    </main>
  );
}

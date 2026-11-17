"use client";

import { SignUpButton, useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

/**
 * Clerk's <PricingTable for="organization" /> hides every plan's button until the viewer
 * has an active organization. This fills that gap: visitors sign up, signed-in users
 * without an org create one, and once an org is active Clerk's own buttons take over.
 */
export function TeamPricingCta() {
  const { isLoaded, isSignedIn, orgId } = useAuth();
  const clerk = useClerk();

  if (!isLoaded || orgId) return null;

  return (
    <div className="mt-8 flex flex-col items-center gap-3 text-center">
      <p className="text-sm text-muted-foreground">
        {isSignedIn
          ? "Team plans are billed to an organization. Create one to subscribe."
          : "Sign up and create an organization to subscribe your team."}
      </p>
      {isSignedIn ? (
        <Button
          className="h-11 px-5 text-base"
          onClick={() =>
            clerk.openCreateOrganization({ afterCreateOrganizationUrl: "/#pricing" })
          }
        >
          Create an organization
        </Button>
      ) : (
        <SignUpButton mode="modal">
          <Button className="h-11 px-5 text-base">Get started</Button>
        </SignUpButton>
      )}
    </div>
  );
}

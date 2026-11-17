"use server"

import { FREE_WORKSPACE_LIMIT, LimitError } from "@/lib/plan-limits";
import { checkUser } from "./check-user";
import { auth } from "@clerk/nextjs/server";
import { scopeWhere } from "@/lib/workspace-scope";
import { getEntitlement } from "@/lib/billing";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { revalidatePath } from "next/cache";

const MAX_TX_ATTEMPTS = 3;

function revalidateWorkspaceLists(){
    revalidatePath("/dashboard");
    revalidatePath("/workspace");
}

export async function createWorkspace(
    name: string,
    description?: string,
): Promise<{ workspace: { id: string } } | { limit: LimitError}> {
    const user = await checkUser();
    if (!user) throw new Error("Not signed in");

    const trimmedName = name.trim();
    if(!trimmedName) throw new Error("Workspace name is required");

    const { orgId } = await auth();
    const scope = scopeWhere(orgId, user.id);

    const { unlimitedWorkspaces } = await getEntitlement(orgId ?? user.clerkId);

    // Count and insert in one Serializable transaction so concurrent requests
    // for the same scope can't both pass the limit check.
    const create = () =>
        prisma.$transaction(
            async (tx) => {
                if(
                    !unlimitedWorkspaces &&
                    (await tx.workspace.count({ where: scope })) >= FREE_WORKSPACE_LIMIT
                ){
                    return null;
                }

                const top = await tx.workspace.findFirst({
                    where: {status: "PLANNING", ...scope},
                    orderBy: { position: "asc" },
                    select: { position: true},
                });

                return tx.workspace.create({
                    data:{
                        name: trimmedName,
                        description: description?.trim() || null,
                        creatorId: user.id,
                        clerkOrgId:orgId ?? null,
                        position:top ? top.position -1 :0,
                        doc: {create: {} },
                        canvas: {create: {} },
                    },
                    select: { id: true },
                });
            },
            { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );

    let workspace: { id: string } | null = null;
    for (let attempt = 1; ; attempt++) {
        try {
            workspace = await create();
            break;
        } catch (error) {
            // P2034: serialization failure / deadlock; safe to retry the whole transaction.
            const retryable =
                error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034";
            if (!retryable || attempt >= MAX_TX_ATTEMPTS) throw error;
        }
    }

    if (!workspace) return { limit: "workspaces" };

    revalidateWorkspaceLists()

        return { workspace: {id:workspace.id} };
}

"use server"

import { FREE_WORKSPACE_LIMIT, LimitError } from "@/lib/plan-limits";
import { checkUser } from "./check-user";
import { auth } from "@clerk/nextjs/server";
import { scopeWhere } from "@/lib/workspace-scope";
import { getEntitlement } from "@/lib/billing";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    if(
        !unlimitedWorkspaces &&
        (await prisma.workspace.count({where:scope })) >=FREE_WORKSPACE_LIMIT
    ){
        return {limit: "workspaces"}
    }

    const top = await prisma.workspace.findFirst({
        where: {status: "PLANNING", ...scope},
        orderBy: { position: "asc" },
        select: { position: true},
    });

    const workspace = await prisma.workspace.create({
        data:{
            name: trimmedName,
            description: description?.trim() || null,
            creatorId: user.id,
            clerkOrgId:orgId ?? null,
            position:top ? top.position -1 :0,
            doc: {create: {} },
            canvas: {create: {} },
        },
    });

    revalidateWorkspaceLists()

        return { workspace: {id:workspace.id} };
}

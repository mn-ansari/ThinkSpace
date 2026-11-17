"use server"

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@/lib/generated/prisma/client";

export async function checkUser(){
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const existing = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id},
    });

    if (existing) return existing;

    const email =
        clerkUser.primaryEmailAddress?.emailAddress ??
        clerkUser.emailAddresses[0]?.emailAddress;
    if(!email) return null;

    const data = {
        clerkId: clerkUser.id,
        email,
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null,
        imageUrl: clerkUser.imageUrl,
    };

    try {
        // Upsert on email: if a row already exists for this email under an old Clerk ID
        // (account re-created, or switched Clerk instances), relink it to the new Clerk ID.
        return await prisma.user.upsert({
            where: { email },
            update: data,
            create: data,
        });
    } catch (error) {
        // Two concurrent requests both tried to create the user; the other one won.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
        }
        throw error;
    }
}

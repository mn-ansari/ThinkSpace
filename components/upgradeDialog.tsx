"use client";

import { PricingTable, useAuth } from "@clerk/nextjs";
import next from "next/dist/types";
import React, { Children, createContext, ReactNode, useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type UpgradeReason = {title: string; description?: string };

const DEFAULT_REASON: UpgradeReason = {
    title: "Upgrade your PLan",
    description:
    "Get more agent prompts, unlimited workspaces, share links and PDF export.",
};

const UpgradeDialogContext = createContext<(reason?: UpgradeReason) =>void>(
    () =>{},
);



export const UPgradeDialogProvider = ({ children }: {children: ReactNode }) => {
    const [reason, setReason] = useState<UpgradeReason | null>(null);
    const { orgId } = useAuth();
    const close = () => setReason(null);
    
    return (<UpgradeDialogContext.Provider
            value={(next) => setReason(next ?? DEFAULT_REASON)}
            >
                {children}
                <Dialog
                modal = {false}
                open = {reason !== null}
                onOpenChange={(open) => !open && close()}
                >
                    <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-5xl">
                        <DialogHeader className="item-center text-center" >
                            <DialogTitle className="text-2xl" >{reason?.title}</DialogTitle>
                            {reason?.description &&(
                                <DialogDescription>
                                    {reason.description}
                                </DialogDescription>
                            )}
                        </DialogHeader>
                        <PricingTable for={orgId ? "organization" : "user"} />
                    </DialogContent>
                </Dialog>
            </UpgradeDialogContext.Provider>
        );
};

export function useUpgradeDialog(){
    return useContext(UpgradeDialogContext);
}
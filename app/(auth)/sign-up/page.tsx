"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const router = useRouter();

    const handleSignUp = async () => {
        await signUp.email({
            email,
            password,
            name,
        }, {
            onSuccess: () => {
                router.push("/");
            },
            onError: (ctx) => {
                alert(ctx.error.message);
            }
        });
    };

    return (
        <div className="flex flex-col gap-4 max-w-sm mx-auto mt-20 p-4 border rounded">
            <h1 className="text-xl font-bold">Create Account</h1>
            <Input placeholder="Name" onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <Button onClick={handleSignUp}>Sign Up</Button>
        </div>
    );
}
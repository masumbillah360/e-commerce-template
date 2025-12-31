"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    value: string[];       // Array of URLs
    onChange: (value: string[]) => void;
    onRemove: (value: string) => void;
    maxFiles?: number;
}

export default function ImageUpload({
    value,
    onChange,
    onRemove,
    maxFiles = 1
}: ImageUploadProps) {

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-50 h-50 rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image fill className="object-cover" alt="Image" src={url} />
                    </div>
                ))}
            </div>

            {value.length < maxFiles && (
                <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                        const urls = res.map((r) => r.url);
                        onChange([...value, ...urls]);
                    }}
                    onUploadError={(error: Error) => {
                        alert(`ERROR! ${error.message}`);
                    }}
                />
            )}
        </div>
    );
}
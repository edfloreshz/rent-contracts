import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function getStatusColor(status: string): string {
    switch (status) {
        case "Active":
            return "bg-green-100 text-green-800";
        case "Expired":
            return "bg-red-100 text-red-800";
        case "Terminated":
            return "bg-gray-100 text-gray-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
}

export function downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Case conversion utilities
export function camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function snakeToCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function objectToSnakeCase(obj: any): any {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(objectToSnakeCase);
    }

    const snakeCaseObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
        const snakeKey = camelToSnakeCase(key);
        snakeCaseObj[snakeKey] = objectToSnakeCase(value);
    }
    return snakeCaseObj;
}

export function objectToCamelCase(obj: any): any {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(objectToCamelCase);
    }

    const camelCaseObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
        const camelKey = snakeToCamelCase(key);
        camelCaseObj[camelKey] = objectToCamelCase(value);
    }
    return camelCaseObj;
}

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

export function formatPhone(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, "");

    // Check if it's a valid phone number (assuming 10-11 digits)
    if (digits.length === 10) {
        // Format as +1 (XXX) XXX XXXX for US numbers
        return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${
            digits.slice(6)
        }`;
    } else if (digits.length === 11 && digits.startsWith("1")) {
        // Format as +1 (XXX) XXX XXXX for US numbers with country code
        return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)} ${
            digits.slice(7)
        }`;
    } else if (digits.length > 7) {
        // For international numbers, try to format as +XX (XXX) XXX XXX
        const countryCode = digits.slice(0, -10);
        const areaCode = digits.slice(-10, -7);
        const firstPart = digits.slice(-7, -4);
        const secondPart = digits.slice(-4);

        if (countryCode.length > 0) {
            return `+${countryCode} (${areaCode}) ${firstPart} ${secondPart}`;
        } else {
            // Fallback for shorter numbers
            return `+${digits.slice(0, 2)} (${digits.slice(2, 5)}) ${
                digits.slice(5, 8)
            } ${digits.slice(8)}`;
        }
    }

    // Return original phone if it doesn't match expected patterns
    return phone;
}

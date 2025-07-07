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

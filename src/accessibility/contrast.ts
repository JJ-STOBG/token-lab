function channel(value: string): number {
    const normalized = Number.parseInt(value, 16) / 255
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
}

export function contrastRatio(foreground: string, background: string): number {
    const luminance = (color: string) => {
        const red = channel(color.slice(1, 3))
        const green = channel(color.slice(3, 5))
        const blue = channel(color.slice(5, 7))
        return 0.2126 * red + 0.7152 * green + 0.0722 * blue
    }
    const foregroundLuminance = luminance(foreground)
    const backgroundLuminance = luminance(background)
    return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
}

export function meetsContrast(foreground: string, background: string, threshold: number): boolean {
    return contrastRatio(foreground, background) >= threshold
}
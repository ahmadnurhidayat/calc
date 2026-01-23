// IP Calculator Logic

export interface IPCalculation {
    ipAddress: string;
    cidr: number;
    networkAddress: string;
    broadcastAddress: string;
    subnetMask: string;
    wildcardMask: string;
    firstUsableIP: string;
    lastUsableIP: string;
    totalHosts: number;
    usableHosts: number;
    ipClass: string;
    ipType: 'Private' | 'Public';
    binary: string;
}

// Validate IPv4 address
export const isValidIPv4 = (ip: string): boolean => {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;

    return parts.every(part => {
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255 && part === num.toString();
    });
};

// Validate CIDR notation
export const isValidCIDR = (cidr: number): boolean => {
    return cidr >= 0 && cidr <= 32;
};

// Convert IP to 32-bit integer
export const ipToInt = (ip: string): number => {
    const parts = ip.split('.').map(Number);
    return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
};

// Convert 32-bit integer to IP
export const intToIp = (int: number): string => {
    return [
        (int >>> 24) & 255,
        (int >>> 16) & 255,
        (int >>> 8) & 255,
        int & 255
    ].join('.');
};

// Calculate subnet mask from CIDR
export const cidrToSubnetMask = (cidr: number): string => {
    const mask = ~((1 << (32 - cidr)) - 1);
    return intToIp(mask >>> 0);
};

// Calculate wildcard mask
export const getWildcardMask = (subnetMask: string): string => {
    const maskInt = ipToInt(subnetMask);
    const wildcardInt = ~maskInt >>> 0;
    return intToIp(wildcardInt);
};

// Get network address
export const getNetworkAddress = (ip: string, cidr: number): string => {
    const ipInt = ipToInt(ip);
    const maskInt = ~((1 << (32 - cidr)) - 1) >>> 0;
    const networkInt = (ipInt & maskInt) >>> 0;
    return intToIp(networkInt);
};

// Get broadcast address
export const getBroadcastAddress = (ip: string, cidr: number): string => {
    const ipInt = ipToInt(ip);
    const maskInt = ~((1 << (32 - cidr)) - 1) >>> 0;
    const wildcardInt = ~maskInt >>> 0;
    const broadcastInt = (ipInt | wildcardInt) >>> 0;
    return intToIp(broadcastInt);
};

// Get first usable IP
export const getFirstUsableIP = (networkAddress: string, cidr: number): string => {
    if (cidr === 31 || cidr === 32) return networkAddress;
    const networkInt = ipToInt(networkAddress);
    return intToIp(networkInt + 1);
};

// Get last usable IP
export const getLastUsableIP = (broadcastAddress: string, cidr: number): string => {
    if (cidr === 31 || cidr === 32) return broadcastAddress;
    const broadcastInt = ipToInt(broadcastAddress);
    return intToIp(broadcastInt - 1);
};

// Calculate total hosts
export const getTotalHosts = (cidr: number): number => {
    return Math.pow(2, 32 - cidr);
};

// Calculate usable hosts
export const getUsableHosts = (cidr: number): number => {
    if (cidr === 31) return 2;
    if (cidr === 32) return 1;
    return Math.pow(2, 32 - cidr) - 2;
};

// Get IP class
export const getIPClass = (ip: string): string => {
    const firstOctet = parseInt(ip.split('.')[0], 10);

    if (firstOctet >= 1 && firstOctet <= 126) return 'A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)';
    if (firstOctet >= 240 && firstOctet <= 255) return 'E (Reserved)';

    return 'Unknown';
};

// Check if IP is private
export const isPrivateIP = (ip: string): 'Private' | 'Public' => {
    const parts = ip.split('.').map(Number);
    const firstOctet = parts[0];
    const secondOctet = parts[1];

    // 10.0.0.0 - 10.255.255.255
    if (firstOctet === 10) return 'Private';

    // 172.16.0.0 - 172.31.255.255
    if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) return 'Private';

    // 192.168.0.0 - 192.168.255.255
    if (firstOctet === 192 && secondOctet === 168) return 'Private';

    // 127.0.0.0 - 127.255.255.255 (Loopback)
    if (firstOctet === 127) return 'Private';

    return 'Public';
};

// Convert IP to binary
export const ipToBinary = (ip: string): string => {
    return ip.split('.')
        .map(octet => parseInt(octet, 10).toString(2).padStart(8, '0'))
        .join('.');
};

// Main calculation function
export const calculateIPInfo = (ip: string, cidr: number): IPCalculation | null => {
    if (!isValidIPv4(ip) || !isValidCIDR(cidr)) {
        return null;
    }

    const networkAddress = getNetworkAddress(ip, cidr);
    const broadcastAddress = getBroadcastAddress(ip, cidr);
    const subnetMask = cidrToSubnetMask(cidr);
    const wildcardMask = getWildcardMask(subnetMask);
    const firstUsableIP = getFirstUsableIP(networkAddress, cidr);
    const lastUsableIP = getLastUsableIP(broadcastAddress, cidr);
    const totalHosts = getTotalHosts(cidr);
    const usableHosts = getUsableHosts(cidr);
    const ipClass = getIPClass(ip);
    const ipType = isPrivateIP(ip);
    const binary = ipToBinary(ip);

    return {
        ipAddress: ip,
        cidr,
        networkAddress,
        broadcastAddress,
        subnetMask,
        wildcardMask,
        firstUsableIP,
        lastUsableIP,
        totalHosts,
        usableHosts,
        ipClass,
        ipType,
        binary,
    };
};

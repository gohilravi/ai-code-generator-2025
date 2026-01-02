import { SignJWT, jwtVerify, base64url } from 'jose';
import { UserType, SearchToken } from '@/types';

// Secret key for JWT signing (in production, this should be in environment variables)
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'offer-management-secret-key-2025';

// Convert secret to Uint8Array for jose library
const secretKey = new TextEncoder().encode(JWT_SECRET);

/**
 * Generates a JWT access token for search functionality
 * Uses jose library which is browser-compatible
 */
export async function generateLocalToken(userType: UserType, userId: string): Promise<SearchToken> {
  const timestamp = Date.now();
  // Set expiration to maximum (10 years from now - effectively infinite for frontend use)
  const expiresIn = 10 * 365 * 24 * 60 * 60; // 10 years in seconds
  const expiresAt = new Date(timestamp + expiresIn * 1000).toISOString();
  
  // Create JWT payload
  const payload = {
    userType,
    userId,
    iat: Math.floor(timestamp / 1000),
    exp: Math.floor(timestamp / 1000) + expiresIn,
  };
  
  // Generate JWT token using jose
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(Math.floor(timestamp / 1000))
    .setExpirationTime(Math.floor(timestamp / 1000) + expiresIn)
    .sign(secretKey);
  
  return {
    userType,
    userId,
    token,
    expiresAt,
  };
}

/**
 * Validates if a token is still valid (not expired)
 */
export async function isTokenValid(token: SearchToken): Promise<boolean> {
  try {
    // Verify JWT token using jose
    await jwtVerify(token.token, secretKey);
    
    // Also check expiration timestamp
    const now = new Date().getTime();
    const expiresAt = new Date(token.expiresAt).getTime();
    return now < expiresAt;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
}

/**
 * Decodes a JWT token to extract its payload
 */
export async function decodeToken(tokenString: string): Promise<{ userType: UserType; userId: string } | null> {
  try {
    const { payload } = await jwtVerify(tokenString, secretKey);
    
    return {
      userType: payload.userType as UserType,
      userId: payload.userId as string,
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

/**
 * Synchronous token generation for immediate use (fallback)
 * This creates a simple token structure without JWT for immediate response
 */
export function generateLocalTokenSync(userType: UserType, userId: string): SearchToken {
  const timestamp = Date.now();
  const expiresIn = 10 * 365 * 24 * 60 * 60; // 10 years in seconds
  const expiresAt = new Date(timestamp + expiresIn * 1000).toISOString();
  
  // Create a simple token structure (base64 encoded payload + signature)
  const payload = {
    userType,
    userId,
    iat: Math.floor(timestamp / 1000),
    exp: Math.floor(timestamp / 1000) + expiresIn,
  };
  
  // Encode payload
  const payloadEncoded = base64url.encode(JSON.stringify(payload));
  
  // Create simple signature
  const signature = base64url.encode(`${userType}-${userId}-${timestamp}`);
  
  // Combine to create token
  const token = `${payloadEncoded}.${signature}`;
  
  return {
    userType,
    userId,
    token,
    expiresAt,
  };
}

/**
 * Synchronous token validation for immediate use
 */
export function isTokenValidSync(token: SearchToken): boolean {
  try {
    // Check expiration timestamp
    const now = new Date().getTime();
    const expiresAt = new Date(token.expiresAt).getTime();
    return now < expiresAt;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
}

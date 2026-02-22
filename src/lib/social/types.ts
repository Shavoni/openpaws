// Shared social API types — implemented in Phase 4
export interface SocialClient {
  getAuthUrl(redirectUri: string): string
  handleCallback(code: string): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: Date }>
  refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: Date }>
  publishPost(post: { content: string; mediaUrls?: string[]; mediaType?: string }): Promise<{ platformPostId: string; platformPostUrl: string }>
  getProfile(): Promise<{ id: string; name: string; username: string; avatarUrl: string; followerCount: number }>
  getPostMetrics(platformPostId: string): Promise<{ likes: number; comments: number; shares: number; views: number }>
}

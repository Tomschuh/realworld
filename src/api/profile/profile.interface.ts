export interface ProfileRes {
    profile: ProfileData
}

export interface ProfileData {
    username: string,
    bio?: string,
    image?: string,
    following: boolean
}
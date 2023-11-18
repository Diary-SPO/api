export interface ResponseLogin {
    id: number
    spoId?: number
    groupId: number
    login: string
    phone: string
    birthday: string
    firstName: string
    lastName: string
    middleName: string
    token?: string
}
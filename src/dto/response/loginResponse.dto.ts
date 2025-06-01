export class LoginResponseDto {
    result: boolean;
    data: {
        access_token: string;
        id: string;
    }
}
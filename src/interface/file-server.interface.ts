export interface FilerServerInterface {
    get(publicKey: number)
    upload(file: Express.Multer.File)
    delete(privateKey: string)
}

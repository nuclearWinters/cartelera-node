type UserFromDB = {
    _id: string,
    Contraseña: string,
    Usuario: string,
    Nombre: string
}

type UserFromInput = {
    Contraseña: string,
    Usuario: string
}

export { UserFromInput, UserFromDB }
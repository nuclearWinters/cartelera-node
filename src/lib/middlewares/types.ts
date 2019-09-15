type User = {
    _id: string,
    Contraseña: string,
    Usuario: string,
    Nombre: string
}

type UserInput = {
    Contraseña: string,
    Usuario: string
}

export { UserInput, User }
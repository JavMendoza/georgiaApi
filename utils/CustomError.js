export default class CustomError extends Error {
  constructor(code, ...params) {
    // Pasa los argumentos restantes (incluidos los específicos del proveedor) al constructor padre
    super(...params)

    // Mantiene un seguimiento adecuado de la pila para el lugar donde se lanzó nuestro error (solo disponible en V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }

    this.name = 'CustomError'
    // Información de depuración personalizada
    this.code = code
    this.date = new Date()
  }
}
import jwt from 'jsonwebtoken'

export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables")
  }

  return jwt.sign(
    { id: userId },                // payload
    process.env.JWT_SECRET,       // secret key
    { expiresIn: '30d' }          // token options
  )
}

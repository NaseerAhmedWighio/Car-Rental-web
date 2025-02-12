import { type SchemaTypeDefinition } from 'sanity'
import { Recommended } from './Recommended'
import { Popular } from './Popular'
// import  products  from "./products"
// import cars from './cars'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [Recommended, Popular],
}

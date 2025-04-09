import Pocketbase from 'pocketbase'
import type { TypedPocketBase } from '../pocketbase-types'

export const pb = new Pocketbase(import.meta.env.PUBLIC_VITE_POCKETBASE_URL) as TypedPocketBase

